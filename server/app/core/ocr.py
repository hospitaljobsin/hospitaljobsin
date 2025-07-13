import asyncio
from io import BytesIO

from PIL.Image import Image
from tesserocr import PSM, PyTessBaseAPI
from types_aiobotocore_textract.client import TextractClient

from app.config import TesseractSettings


class BaseOCRClient:
    """Base OCR client. Converts PDF documents into images and extracts text from them."""

    async def __call__(self, ordered_images: list[tuple[Image, int]]) -> list[str]:
        """Extract text from the given image (bytes stream)."""
        raise NotImplementedError


class TextractOCRClient(BaseOCRClient):
    """OCR client that uses AWS Textract."""

    def __init__(self, textract_client: TextractClient) -> None:
        super().__init__()
        self.__client = textract_client

    async def __call__(self, ordered_images: list[tuple[Image, int]]) -> list[str]:
        page_texts = await asyncio.gather(
            *(
                self._internal_process_image(image, page_number)
                for image, page_number in ordered_images
            )
        )

        return [page_text for page_text, _ in page_texts]

    async def _internal_process_image(
        self, image: Image, page_number: int
    ) -> tuple[str, int]:
        # Convert the PIL Image to a byte stream
        image_bytes = BytesIO()
        image.save(image_bytes, format="PNG")
        image_bytes.seek(0)  # Reset the stream position to the beginning

        # Call AWS Textract to analyze the document
        response = self.__client.analyze_document(
            Document={"Bytes": image_bytes.getvalue()}, FeatureTypes=["TABLES", "FORMS"]
        )

        # Extract text from the response
        text_blocks = response.get("Blocks", [])
        page_text = "\n".join(
            block["Text"] for block in text_blocks if block["BlockType"] == "LINE"
        )

        return page_text, page_number


class TesseractOCRClient(BaseOCRClient):
    """OCR client that uses TesserOCR under the hood."""

    def __init__(self, tesseract_settings: TesseractSettings) -> None:
        super().__init__()
        # Note: PyTessBaseAPI is not thread-safe, so we should create it inside the thread.
        self.tesseract_settings = tesseract_settings

    async def __call__(self, ordered_images: list[tuple[Image, int]]) -> list[str]:
        page_texts = await asyncio.gather(
            *(
                self._internal_process_image(image, page_number)
                for image, page_number in ordered_images
            )
        )

        return [page_text for page_text, _ in page_texts]

    async def _internal_process_image(
        self, image: Image, page_number: int
    ) -> tuple[str, int]:
        return await asyncio.to_thread(self._process_image, image, page_number)

    def _process_image(self, image: Image, page_number: int) -> tuple[str, int]:
        """Helper function to run Tesseract in a blocking way."""
        # Create and use PyTessBaseAPI within the thread
        with PyTessBaseAPI(
            path=self.tesseract_settings.tesseract_data_path,
            lang="eng",
            psm=PSM.SPARSE_TEXT_OSD,
        ) as api:
            api.SetImage(image)
            return api.GetUTF8Text(), page_number
