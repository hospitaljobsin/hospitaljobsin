from collections.abc import AsyncIterator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION = """
mutation RequestSudoModeWithPassword($password: String!, $captchaToken: String!) {
    requestSudoModeWithPassword(password: $password, captchaToken: $captchaToken) {
        __typename
        ... on Account {
            __typename
        }
    }
}
"""


async def test_unauthenticated_request(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure unauthenticated users cannot request sudo mode."""
    response = await graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION,
        variables={
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert "errors" in response


async def test_wrong_password(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure wrong password is rejected."""
    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION,
        variables={
            "password": "WrongPassword123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPassword": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


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
async def webauthn_only_auth_graphql_client(
    lifespan_manager: LifespanManager,
    webauthn_only_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[GraphQLClient]:
    """Create authenticated GraphQL client for webauthn-only account."""
    session_token = await session_repo.create(
        webauthn_only_account, user_agent="test-agent", ip_address="192.168.1.1"
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
        yield GraphQLClient(client=client, endpoint="/graphql")


async def test_webauthn_only_account(
    webauthn_only_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure webauthn-only accounts cannot use password for sudo mode."""
    response = await webauthn_only_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION,
        variables={
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPassword": {
                "__typename": "InvalidAuthenticationProviderError",
            },
        },
    }


async def test_account_with_2fa_enabled(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure accounts with 2FA enabled require 2FA verification."""
    await account_repo.set_two_factor_secret(
        account=password_account,
        totp_secret="test-secret",
    )

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION,
        variables={
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPassword": {
                "__typename": "TwoFactorAuthenticationRequiredError",
            },
        },
    }

    await account_repo.delete_two_factor_secret(account=password_account)


async def test_successful_sudo_mode_request(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure valid password grants sudo mode."""
    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSWORD_MUTATION,
        variables={
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPassword": {
                "__typename": "Account",
            },
        },
    }
