import asyncio
from io import BytesIO

import fitz
from PIL.Image import Image, open
from tesserocr import PSM, PyTessBaseAPI
from types_aiobotocore_s3.client import S3Client
from types_aiobotocore_textract.client import TextractClient

from app.config import AWSSettings, TesseractSettings


class BaseOCRClient:
    """Base OCR client. Converts PDF documents into images and extracts text from them."""

    async def __call__(self, document_url: str) -> list[str]:
        """Extract text from the given image (bytes stream)."""
        raise NotImplementedError


class TextractOCRClient(BaseOCRClient):
    """OCR client that uses AWS Textract."""

    def __init__(
        self,
        textract_client: TextractClient,
        aws_settings: AWSSettings,
    ) -> None:
        super().__init__()
        self.__client = textract_client
        self._aws_settings = aws_settings

    async def __call__(self, document_url: str) -> list[str]:
        response = await self.__client.detect_document_text(
            Document={
                "S3Object": {
                    "Bucket": self._aws_settings.s3_bucket_name,
                    "Name": document_url,
                }
            }
        )
        blocks = response["Blocks"]
        return [block.get("Text", "") for block in blocks]


class TesseractOCRClient(BaseOCRClient):
    """OCR client that uses TesserOCR under the hood."""

    def __init__(
        self,
        tesseract_settings: TesseractSettings,
        s3_client: S3Client,
        aws_settings: AWSSettings,
    ) -> None:
        super().__init__()
        # Note: PyTessBaseAPI is not thread-safe, so we should create it inside the thread.
        self._tesseract_settings = tesseract_settings
        self._s3_client = s3_client
        self._aws_settings = aws_settings

    async def __call__(self, document_url: str) -> list[str]:
        document = await self._s3_client.get_object(
            Bucket=self._aws_settings.s3_bucket_name,
            Key=document_url,
        )
        pdf_document = fitz.open(
            stream=(await document.get("Body").read()), filetype="pdf"
        )  # type: ignore[reportUnknownReturnType]

        # Render pages and collect PIL Images
        images = []
        for page in pdf_document:
            pix = page.get_pixmap()
            img = open(BytesIO(pix.tobytes("png")))  # Convert Pixmap to PIL Image
            images.append(img)

        pdf_document.close()
        page_texts = await asyncio.gather(
            *(self._internal_process_image(image) for image in images)
        )

        return page_texts

    async def _internal_process_image(self, image: Image) -> tuple[str, int]:
        return await asyncio.to_thread(self._process_image, image)

    def _process_image(self, image: Image) -> str:
        """Helper function to run Tesseract in a blocking way."""
        # Create and use PyTessBaseAPI within the thread
        with PyTessBaseAPI(
            path=self._tesseract_settings.tesseract_data_path,
            lang="eng",
            psm=PSM.SPARSE_TEXT_OSD,
        ) as api:
            api.SetImage(image)
            return api.GetUTF8Text()
