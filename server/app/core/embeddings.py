import hashlib
import json
from pathlib import Path

from filelock import FileLock
from redis.asyncio import Redis
from types_aiobotocore_bedrock_runtime.client import BedrockRuntimeClient


class BaseEmbeddingsService:
    async def generate_embeddings(
        self,
        text: str,
        *,
        dimensions: int,
        task_type: str = "SEMANTIC_SIMILARITY",
        use_cache: bool = False,
    ) -> list[float]:
        raise NotImplementedError


class EmbeddingsService(BaseEmbeddingsService):
    def __init__(
        self, bedrock_client: BedrockRuntimeClient, redis_client: Redis
    ) -> None:
        self._bedrock_client = bedrock_client
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
        dimensions: int,
        task_type: str = "SEMANTIC_SIMILARITY",
        use_cache: bool = False,
    ) -> list[float]:
        """Generate embeddings for a text."""
        model = "amazon.titan-embed-text-v2:0"
        if not text.strip():
            raise ValueError("Text for embedding generation must not be empty.")
        if use_cache:
            embedding = await self._get_embedding_from_cache(text, task_type, model)
            if embedding is not None:
                return embedding

        model_input = {"inputText": text, "dimensions": dimensions, "normalize": True}

        response = await self._bedrock_client.invoke_model(
            modelId=model,
            body=json.dumps(model_input),
            contentType="application/json",
        )

        response_body = json.loads(await response.get("body").read())
        if response_body.get("embedding") is None:
            raise ValueError("No embeddings found")

        result = response_body.get("embedding")
        if use_cache:
            await self._set_embedding_in_cache(text, task_type, model, result)
        return result


class LocalEmbeddingsService(BaseEmbeddingsService):
    """
    Local embeddings service for testing.

    Generates deterministic embeddings based on text hashing and caches them
    to disk for reuse across test runs. This avoids AWS Bedrock API calls
    during testing while maintaining consistent embedding values.
    """

    def __init__(self) -> None:
        self._cache_dir = Path.cwd() / ".embeddings_cache"
        self._cache_dir.mkdir(parents=True, exist_ok=True)

    def _generate_cache_key(self, text: str, dimensions: int, task_type: str) -> str:
        key_string = f"{text}-{dimensions}-{task_type}"
        return hashlib.sha256(key_string.encode("utf-8")).hexdigest()

    def _get_cache_path(self, cache_key: str) -> Path:
        return self._cache_dir / f"{cache_key}.json"

    def _generate_deterministic_embedding(
        self, text: str, dimensions: int
    ) -> list[float]:
        """Generate deterministic embeddings based on text hash."""
        text_hash = hashlib.sha256(text.encode("utf-8")).digest()
        embedding = []
        for i in range(dimensions):
            byte_idx = (i * 4) % len(text_hash)
            value = int.from_bytes(text_hash[byte_idx : byte_idx + 4], "big") / (2**32)
            embedding.append(value * 2 - 1)

        # Normalize to unit vector
        magnitude = sum(x * x for x in embedding) ** 0.5
        return [x / magnitude for x in embedding]

    async def generate_embeddings(
        self,
        text: str,
        *,
        dimensions: int,
        task_type: str = "SEMANTIC_SIMILARITY",
        use_cache: bool = False,
    ) -> list[float]:
        """Generate deterministic embeddings with file-based caching."""
        if not text.strip():
            raise ValueError("Text for embedding generation must not be empty.")

        cache_key = self._generate_cache_key(text, dimensions, task_type)
        cache_path = self._get_cache_path(cache_key)
        lock_path = cache_path.with_suffix(".lock")

        with FileLock(str(lock_path), timeout=10):
            if cache_path.exists():
                with cache_path.open("r") as f:
                    return json.load(f)

            embedding = self._generate_deterministic_embedding(text, dimensions)

            with cache_path.open("w") as f:
                json.dump(embedding, f)

            return embedding
