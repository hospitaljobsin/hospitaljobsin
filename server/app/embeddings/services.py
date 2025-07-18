import hashlib
import json

from redis.asyncio import Redis
from types_aiobotocore_bedrock_runtime.client import BedrockRuntimeClient


class EmbeddingsService:
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
        model: str = "amazon.titan-embed-text-v2:0",
        use_cache: bool = False,
    ) -> list[float]:
        """Generate embeddings for a text."""
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
        print("body: ", response_body)
        if response_body.get("embedding") is None:
            raise ValueError("No embeddings found")

        result = response_body.get("embedding")
        print("Embeddings: ", result)
        if use_cache:
            await self._set_embedding_in_cache(text, task_type, model, result)
        return result
