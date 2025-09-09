from typing import Any, NotRequired, TypedDict, cast

from httpx import AsyncClient


class GraphQLResponse(TypedDict):
    data: dict[str, Any]
    errors: NotRequired[Any]


class GraphQLClient:
    """Async GraphQL client."""

    def __init__(self, client: AsyncClient, endpoint: str) -> None:
        self._client = client
        self._endpoint = endpoint

    async def __call__(
        self,
        query: str,
        variables: dict[str, Any] | None = None,
    ) -> GraphQLResponse:
        response = await self._client.post(
            self._endpoint,
            json={
                "query": query,
                "variables": variables,
            },
        )
        print(response.cookies)
        response.raise_for_status()
        return cast("GraphQLResponse", response.json())
