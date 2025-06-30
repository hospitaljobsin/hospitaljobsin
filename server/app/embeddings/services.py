import hashlib
import json

from google.genai import Client
from google.genai.types import EmbedContentConfig
from redis.asyncio import Redis


class EmbeddingsService:
    def __init__(self, genai_client: Client, redis_client: Redis) -> None:
        self._genai_client = genai_client
        self._redis_client = redis_client

    def _generate_embedding_cache_key(
        self, text: str, task_type: str, model: str
    ) -> str:
        key_string = f"{text}-{task_type}-{model}"
        return f"embedding:{hashlib.sha256(key_string.encode('utf-8')).hexdigest()}"

    async def _get_embedding_from_cache(
        self, text: str, task_type: str, model: str
    ) -> list[float] | None:
        cache_key = self._generate_embedding_cache_key(text, task_type, model)
        embedding = await self._redis_client.get(cache_key)
        if embedding is None:
            return None
        return json.loads(embedding)

    async def _set_embedding_in_cache(
        self, text: str, task_type: str, model: str, embedding: list[float]
    ) -> None:
        cache_key = self._generate_embedding_cache_key(text, task_type, model)
        await self._redis_client.set(cache_key, json.dumps(embedding))

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
