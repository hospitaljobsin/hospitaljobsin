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

UPDATE_PASSWORD_MUTATION = """
mutation UpdatePasswordMutation($newPassword: String!) {
    updatePassword(newPassword: $newPassword) {
        __typename
        ... on Account {
            __typename
        }
        ... on PasswordNotStrongError {
            __typename
        }
    }
}
"""


async def test_update_password_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that we can update password successfully."""
    response = await password_auth_sudo_graphql_client(
        UPDATE_PASSWORD_MUTATION,
        variables={
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "updatePassword": {
                "__typename": "Account",
            },
        },
    }

    updated_account = await account_repo.get(password_account.id)
    assert updated_account is not None
    assert "password" in updated_account.auth_providers


async def test_update_password_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot update password without authentication."""
    response = await graphql_client(
        UPDATE_PASSWORD_MUTATION,
        variables={
            "newPassword": "NewPassword123!",
        },
    )

    assert "errors" in response


async def test_update_password_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot update password without sudo mode."""
    response = await password_auth_graphql_client(
        UPDATE_PASSWORD_MUTATION,
        variables={
            "newPassword": "NewPassword123!",
        },
    )

    assert "errors" in response


@pytest.mark.parametrize(
    ("new_password", "description"),
    [
        ("weak", "Too short password"),
        ("password", "No uppercase or numbers"),
        ("PASSWORD", "No lowercase or numbers"),
        ("Password", "No numbers or special chars"),
        ("12345678", "Only numbers"),
        ("", "Empty password"),
        ("   ", "Whitespace only password"),
    ],
)
async def test_update_password_with_weak_password(
    password_auth_sudo_graphql_client: GraphQLClient,
    new_password: str,
    description: str,
) -> None:
    """Ensure that we cannot update password with weak password."""
    response = await password_auth_sudo_graphql_client(
        UPDATE_PASSWORD_MUTATION,
        variables={
            "newPassword": new_password,
        },
    )

    assert response == {
        "data": {
            "updatePassword": {
                "__typename": "PasswordNotStrongError",
            },
        },
    }, f"Failed for case: {description}"


@pytest.fixture
async def webauthn_only_account(account_repo: AccountRepo) -> AsyncIterator[Account]:
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


@pytest.fixture
async def webauthn_only_auth_sudo_graphql_client(
    lifespan_manager: LifespanManager,
    webauthn_only_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[GraphQLClient]:
    """Create authenticated GraphQL client with sudo mode for webauthn-only account."""
    session_token = await session_repo.create(
        webauthn_only_account, user_agent="test-agent", ip_address="192.168.1.1"
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
        yield GraphQLClient(client=client, endpoint="/graphql")


async def test_update_password_adds_password_provider(
    webauthn_only_auth_sudo_graphql_client: GraphQLClient,
    webauthn_only_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that updating password adds password to auth_providers if not present."""
    assert "password" not in webauthn_only_account.auth_providers

    response = await webauthn_only_auth_sudo_graphql_client(
        UPDATE_PASSWORD_MUTATION,
        variables={
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "updatePassword": {
                "__typename": "Account",
            },
        },
    }

    updated_account = await account_repo.get(webauthn_only_account.id)
    assert updated_account is not None
    assert "password" in updated_account.auth_providers
