import json
from collections.abc import AsyncIterator

import pytest
from app.accounts.documents import Account
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from jose import jwe

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


@pytest.fixture
async def webauthn_auth_http_client(
    fastapi_app: FastAPI,
    webauthn_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    session_token = await session_repo.create(
        webauthn_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    # Create session data and encrypt it as JWE cookie (same as SessionMiddleware does)
    session_data = {"session_token": session_token}
    secret_key = secret_settings.jwe_secret_key.get_secret_value()
    encrypted_session = jwe.encrypt(
        json.dumps(session_data),
        key=secret_key,
        algorithm="dir",
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=fastapi_app,  # type: ignore[arg-type]
        ),
        base_url="http://test",
        cookies={
            auth_settings.session_user_cookie_name: encrypted_session.decode("utf-8")
        },
    ) as client:
        yield client


@pytest.fixture
async def webauthn_auth_graphql_client(
    webauthn_auth_http_client: AsyncClient,
) -> GraphQLClient:
    return GraphQLClient(
        client=webauthn_auth_http_client,
        endpoint="/graphql",
    )


@pytest.fixture
async def password_auth_http_client(
    fastapi_app: FastAPI,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    session_token = await session_repo.create(
        password_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    # Create session data and encrypt it as JWE cookie (same as SessionMiddleware does)
    session_data = {"session_token": session_token}
    secret_key = secret_settings.jwe_secret_key.get_secret_value()
    encrypted_session = jwe.encrypt(
        json.dumps(session_data),
        key=secret_key,
        algorithm="dir",
    )
    async with AsyncClient(
        transport=ASGITransport(
            app=fastapi_app,  # type: ignore[arg-type]
        ),
        base_url="http://test",
        cookies={
            auth_settings.session_user_cookie_name: encrypted_session.decode("utf-8")
        },
    ) as client:
        yield client


@pytest.fixture
async def password_auth_graphql_client(
    password_auth_http_client: AsyncClient,
) -> GraphQLClient:
    return GraphQLClient(
        client=password_auth_http_client,
        endpoint="/graphql",
    )
