from collections.abc import AsyncIterator

import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from .graphql_client import GraphQLClient


@pytest.fixture(scope="session")
async def fastapi_app() -> AsyncIterator[FastAPI]:
    from app import create_app

    app = create_app()
    async with LifespanManager(app=app):
        yield app


@pytest.fixture
async def http_client(fastapi_app: FastAPI) -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(
            app=fastapi_app,  # type: ignore[arg-type]
        ),
        base_url="http://test",
    ) as client:
        yield client


@pytest.fixture
async def graphql_client(http_client: AsyncClient) -> GraphQLClient:
    return GraphQLClient(
        client=http_client,
        endpoint="/graphql/",
    )
