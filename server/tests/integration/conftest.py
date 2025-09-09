from collections.abc import AsyncIterator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
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
        endpoint="/graphql",
    )


@pytest.fixture(scope="session")
async def password_account(account_repo: AccountRepo) -> Account:
    return await account_repo.create(
        full_name="Aryan Iyappan",
        email="aryan@outlook.com",
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
