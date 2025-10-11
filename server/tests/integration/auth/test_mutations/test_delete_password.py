from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

DELETE_PASSWORD_MUTATION = """
mutation DeletePasswordMutation {
    deletePassword {
        __typename
        ... on Account {
            __typename
        }
        ... on InsufficientAuthProvidersError {
            __typename
        }
    }
}
"""


@pytest.fixture
async def webauthn_account_sudo_graphql_client(
    lifespan_manager: LifespanManager,
    webauthn_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[GraphQLClient]:
    """Create authenticated GraphQL client with sudo mode for webauthn account."""
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
        yield GraphQLClient(
            client=client,
            endpoint="/graphql",
        )


async def test_delete_password_successful(
    webauthn_account_sudo_graphql_client: GraphQLClient,
    webauthn_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that we can delete password successfully when other auth providers exist."""
    assert "password" in webauthn_account.auth_providers
    assert "webauthn_credential" in webauthn_account.auth_providers

    response = await webauthn_account_sudo_graphql_client(DELETE_PASSWORD_MUTATION)

    assert response == {
        "data": {
            "deletePassword": {
                "__typename": "Account",
            },
        },
    }

    updated_account = await account_repo.get(webauthn_account.id)
    assert updated_account is not None
    assert "password" not in updated_account.auth_providers
    assert "webauthn_credential" in updated_account.auth_providers


async def test_delete_password_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete password without authentication."""
    response = await graphql_client(DELETE_PASSWORD_MUTATION)

    assert "errors" in response


async def test_delete_password_without_sudo_mode(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete password without sudo mode."""
    response = await webauthn_auth_graphql_client(DELETE_PASSWORD_MUTATION)

    assert "errors" in response


async def test_delete_password_with_only_password_provider(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete password when it's the only auth provider."""
    response = await password_auth_sudo_graphql_client(DELETE_PASSWORD_MUTATION)

    assert response == {
        "data": {
            "deletePassword": {
                "__typename": "InsufficientAuthProvidersError",
            },
        },
    }


@pytest.fixture
async def multi_provider_account(
    account_repo: AccountRepo,
) -> Account:
    """Create an account with multiple auth providers including password."""
    account = await account_repo.create(
        full_name="Multi Provider User",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password", "webauthn_credential", "oauth_google"],
    )
    yield account
    await account_repo.delete(account)


async def test_delete_password_with_multiple_providers(
    lifespan_manager: LifespanManager,
    multi_provider_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
    account_repo: AccountRepo,
) -> None:
    """Ensure that deleting password works when multiple auth providers exist."""
    assert "password" in multi_provider_account.auth_providers
    assert len(multi_provider_account.auth_providers) > 1

    session_token = await session_repo.create(
        multi_provider_account, user_agent="test-agent", ip_address="192.168.1.1"
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
        graphql_client = GraphQLClient(
            client=client,
            endpoint="/graphql",
        )
        response = await graphql_client(DELETE_PASSWORD_MUTATION)

    assert response == {
        "data": {
            "deletePassword": {
                "__typename": "Account",
            },
        },
    }

    updated_account = await account_repo.get(multi_provider_account.id)
    assert updated_account is not None
    assert "password" not in updated_account.auth_providers
    assert len(updated_account.auth_providers) >= 1


@pytest.fixture
async def webauthn_only_account(account_repo: AccountRepo) -> Account:
    """Create an account with only webauthn auth provider."""
    account = await account_repo.create(
        full_name="Test User WebAuthn",
        email=generate_test_email(),
        password=None,
        analytics_preference="acceptance",
        auth_providers=["webauthn_credential"],
    )
    yield account
    await account_repo.delete(account)


async def test_delete_password_when_no_password_exists(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    webauthn_only_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that deleting password when none exists doesn't cause errors."""
    assert "password" not in webauthn_only_account.auth_providers

    response = await webauthn_auth_sudo_graphql_client(DELETE_PASSWORD_MUTATION)

    assert response == {
        "data": {
            "deletePassword": {
                "__typename": "Account",
            },
        },
    }

    updated_account = await account_repo.get(webauthn_only_account.id)
    assert updated_account is not None
    assert "password" not in updated_account.auth_providers
