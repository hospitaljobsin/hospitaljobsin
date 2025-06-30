import hashlib

from google.genai import Client
from google.genai.types import EmbedContentConfig


class EmbeddingsService:
    def __init__(self, genai_client: Client) -> None:
        self._genai_client = genai_client
        # TODO: use a proper cache instead of in-memory cache
        self._cache: dict[str, list[float]] = {}

    def _generate_embedding_cache_key(
        self, text: str, task_type: str, model: str
    ) -> str:
        key_string = f"{text}-{task_type}-{model}"
        return hashlib.sha256(key_string.encode("utf-8")).hexdigest()

    async def _get_embedding_from_cache(
        self, text: str, task_type: str, model: str
    ) -> list[float] | None:
        cache_key = self._generate_embedding_cache_key(text, task_type, model)
        return self._cache.get(cache_key)

    async def _set_embedding_in_cache(
        self, text: str, task_type: str, model: str, embedding: list[float]
    ) -> None:
        cache_key = self._generate_embedding_cache_key(text, task_type, model)
        self._cache[cache_key] = embedding

    async def generate_embeddings(
        self,
        text: str,
        *,
        task_type: str = "SEMANTIC_SIMILARITY",
        model: str = "gemini-embedding-exp-03-07",
        use_cache: bool = False,
    ) -> list[float]:
        """Generate embeddings for a text."""
        if use_cache:
            embedding = await self._get_embedding_from_cache(text, task_type, model)
            if embedding is not None:
                return embedding

        response = self._genai_client.models.embed_content(
            model=model,
            contents=text,
            config=EmbedContentConfig(task_type=task_type),
        )
        if response.embeddings is None or response.embeddings[0].values is None:
            raise ValueError("No embeddings found")
        result = response.embeddings[0].values
        if use_cache:
            await self._set_embedding_in_cache(text, task_type, model, result)
        return result
