from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
from app import create_app
from app.accounts.documents import Account
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.utils.auth import encrypt_session_data

from .graphql_client import GraphQLClient


@pytest.fixture(scope="session")
async def lifespan_manager() -> AsyncIterator[LifespanManager]:
    app = create_app()
    async with LifespanManager(app=app) as manager:
        yield manager


@pytest.fixture
async def http_client(lifespan_manager: LifespanManager) -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=Cookies(),
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
    lifespan_manager: LifespanManager,
    webauthn_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    session_token = await session_repo.create(
        webauthn_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    # Create session data and encrypt it as JWE cookie (same as SessionMiddleware does)
    encrypted_session = encrypt_session_data(
        secret_settings, {"session_token": session_token}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
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
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    session_token = await session_repo.create(
        password_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    # Create session data and encrypt it as JWE cookie (same as SessionMiddleware does)
    encrypted_session = encrypt_session_data(
        secret_settings, {"session_token": session_token}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
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


@pytest.fixture
async def password_auth_sudo_http_client(
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    """Create authenticated HTTP client with sudo mode enabled."""
    session_token = await session_repo.create(
        password_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    # Enable sudo mode
    sudo_mode_expires_at = datetime.now(UTC) + timedelta(seconds=SUDO_MODE_EXPIRES_IN)

    # Create session data with sudo mode and encrypt it as JWE cookie
    session_data = {
        "session_token": session_token,
        "sudo_mode_expires_at": sudo_mode_expires_at.isoformat(),
    }
    encrypted_session = encrypt_session_data(secret_settings, session_data)

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        yield client


@pytest.fixture
async def password_auth_sudo_graphql_client(
    password_auth_sudo_http_client: AsyncClient,
) -> GraphQLClient:
    """Create authenticated GraphQL client with sudo mode enabled."""
    return GraphQLClient(
        client=password_auth_sudo_http_client,
        endpoint="/graphql",
    )


@pytest.fixture
async def webauthn_auth_sudo_http_client(
    lifespan_manager: LifespanManager,
    webauthn_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    """Create authenticated HTTP client with sudo mode for webauthn-only account."""
    session_token = await session_repo.create(
        webauthn_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    sudo_mode_expires_at = datetime.now(UTC) + timedelta(seconds=SUDO_MODE_EXPIRES_IN)

    session_data = {
        "session_token": session_token,
        "sudo_mode_expires_at": sudo_mode_expires_at.isoformat(),
    }
    encrypted_session = encrypt_session_data(secret_settings, session_data)

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        yield client


@pytest.fixture
async def webauthn_auth_sudo_graphql_client(
    webauthn_auth_sudo_http_client: AsyncClient,
) -> GraphQLClient:
    """Create authenticated GraphQL client with sudo mode for webauthn-only account."""
    return GraphQLClient(
        client=webauthn_auth_sudo_http_client,
        endpoint="/graphql",
    )


@pytest.fixture
async def foreign_password_auth_http_client(
    lifespan_manager: LifespanManager,
    foreign_password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    session_token = await session_repo.create(
        foreign_password_account, user_agent="test-agent", ip_address="192.168.1.1"
    )

    encrypted_session = encrypt_session_data(
        secret_settings, {"session_token": session_token}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        yield client


@pytest.fixture
async def foreign_password_auth_graphql_client(
    foreign_password_auth_http_client: AsyncClient,
) -> GraphQLClient:
    return GraphQLClient(
        client=foreign_password_auth_http_client,
        endpoint="/graphql",
    )
