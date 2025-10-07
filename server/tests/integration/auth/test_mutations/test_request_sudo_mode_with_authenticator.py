import pyotp
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

REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION = """
mutation RequestSudoModeWithAuthenticatorMutation(
    $twoFactorToken: String!
    $captchaToken: String!
) {
    requestSudoModeWithAuthenticator(
        twoFactorToken: $twoFactorToken
        captchaToken: $captchaToken
    ) {
        __typename
        ... on Account {
            __typename
        }
        ... on InvalidCredentialsError {
            __typename
        }
        ... on AuthenticatorNotEnabledError {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
    }
}
"""


@pytest.fixture(scope="function")
async def account_with_2fa(account_repo: AccountRepo) -> Account:
    """Create an account with 2FA enabled."""
    totp_secret = pyotp.random_base32()
    account = await account_repo.create(
        full_name="Test User",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    await account_repo.set_two_factor_secret(account=account, totp_secret=totp_secret)
    yield account
    await account_repo.delete(account)


@pytest.fixture
async def account_with_2fa_auth_http_client(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncClient:
    """Create authenticated HTTP client for account with 2FA."""
    session_token = await session_repo.create(
        account_with_2fa, user_agent="test-agent", ip_address="192.168.1.1"
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
async def account_with_2fa_auth_graphql_client(
    account_with_2fa_auth_http_client: AsyncClient,
) -> GraphQLClient:
    """Create authenticated GraphQL client for account with 2FA."""
    return GraphQLClient(
        client=account_with_2fa_auth_http_client,
        endpoint="/graphql",
    )


async def test_request_sudo_mode_with_valid_totp(
    account_with_2fa_auth_graphql_client: GraphQLClient,
    account_with_2fa: Account,
) -> None:
    """Ensure that we can request sudo mode with a valid TOTP token."""
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await account_with_2fa_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "twoFactorToken": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithAuthenticator": {
                "__typename": "Account",
            },
        },
    }


async def test_request_sudo_mode_with_invalid_totp(
    account_with_2fa_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot request sudo mode with an invalid TOTP token."""
    response = await account_with_2fa_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "twoFactorToken": "000000",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_request_sudo_mode_without_authenticator_enabled(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we cannot request sudo mode when authenticator is not enabled."""
    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "twoFactorToken": "123456",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithAuthenticator": {
                "__typename": "AuthenticatorNotEnabledError",
            },
        },
    }


async def test_request_sudo_mode_with_empty_totp(
    account_with_2fa_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot request sudo mode with an empty TOTP token."""
    response = await account_with_2fa_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "twoFactorToken": "",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_request_sudo_mode_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot request sudo mode."""
    response = await graphql_client(
        REQUEST_SUDO_MODE_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "twoFactorToken": "123456",
            "captchaToken": "captcha-token",
        },
    )

    assert "errors" in response
