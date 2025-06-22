from google import genai
from google.genai.types import EmbedContentConfig


class EmbeddingsService:
    def __init__(self, genai_client: genai.Client) -> None:
        self._genai_client = genai_client

    async def generate_embeddings(
        self, text: str, *, task_type: str = "SEMANTIC_SIMILARITY"
    ) -> list[float]:
        """Generate embeddings for a text."""
        response = self._genai_client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=text,
            config=EmbedContentConfig(task_type=task_type),
        )
        if response.embeddings is None or response.embeddings[0].values is None:
            raise ValueError("No embeddings found")
        return response.embeddings[0].values
