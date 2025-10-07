from collections.abc import AsyncIterator
from datetime import datetime

import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import TwoFactorAuthenticationChallengeRepo
from app.config import AuthSettings, SecretSettings
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION = """
mutation Verify2FAWithAuthenticatorMutation(
    $token: String!
    $captchaToken: String!
) {
    verify2faWithAuthenticator(
        token: $token
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
        ... on TwoFactorAuthenticationChallengeNotFoundError {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
    }
}
"""


@pytest.fixture(scope="module")
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
async def http_client_with_2fa_challenge(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    """Create HTTP client with 2FA challenge in session."""
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=account_with_2fa
    )

    encrypted_session = encrypt_session_data(
        secret_settings, {"2fa_challenge": challenge}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        yield client


@pytest.fixture
async def graphql_client_with_2fa_challenge(
    http_client_with_2fa_challenge: AsyncClient,
) -> GraphQLClient:
    """Create GraphQL client with 2FA challenge in session."""
    return GraphQLClient(
        client=http_client_with_2fa_challenge,
        endpoint="/graphql",
    )


async def test_verify_2fa_with_valid_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
    account_with_2fa: Account,
) -> None:
    """Ensure that we can verify 2FA with a valid TOTP token."""
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "Account",
            },
        },
    }


async def test_verify_2fa_with_invalid_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA with an invalid TOTP token."""
    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": "000000",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_with_empty_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA with an empty TOTP token."""
    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": "",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_without_challenge(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA without a challenge in session."""
    response = await graphql_client(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": "123456",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "TwoFactorAuthenticationChallengeNotFoundError",
            },
        },
    }


async def test_verify_2fa_with_invalid_challenge(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that we cannot verify 2FA with an invalid challenge token."""
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    encrypted_session = encrypt_session_data(
        secret_settings, {"2fa_challenge": "invalid-challenge"}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")

        response = await graphql_client(
            VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
            variables={
                "token": valid_token,
                "captchaToken": "captcha-token",
            },
        )

        assert response == {
            "data": {
                "verify2faWithAuthenticator": {
                    "__typename": "TwoFactorAuthenticationChallengeNotFoundError",
                },
            },
        }


async def test_verify_2fa_without_authenticator_enabled(
    lifespan_manager: LifespanManager,
    password_account: Account,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that we cannot verify 2FA when authenticator is not enabled."""
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=password_account
    )

    encrypted_session = encrypt_session_data(
        secret_settings, {"2fa_challenge": challenge}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")

        response = await graphql_client(
            VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
            variables={
                "token": "123456",
                "captchaToken": "captcha-token",
            },
        )

        assert response == {
            "data": {
                "verify2faWithAuthenticator": {
                    "__typename": "AuthenticatorNotEnabledError",
                },
            },
        }


async def test_verify_2fa_with_expired_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
    account_with_2fa: Account,
) -> None:
    """Ensure that we cannot verify 2FA with an expired TOTP token."""
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    expired_token = totp.at(totp.timecode(datetime.now()) - 2)

    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": expired_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_with_malformed_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA with a malformed TOTP token."""
    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": "abc123",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_with_whitespace_totp(
    graphql_client_with_2fa_challenge: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA with a whitespace-only TOTP token."""
    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "token": "   ",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_creates_session(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that successful 2FA verification creates a session."""
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=account_with_2fa
    )
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    encrypted_session = encrypt_session_data(
        secret_settings, {"2fa_challenge": challenge}
    )

    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")

        response = await graphql_client(
            VERIFY_2FA_WITH_AUTHENTICATOR_MUTATION,
            variables={
                "token": valid_token,
                "captchaToken": "captcha-token",
            },
        )

        assert response == {
            "data": {
                "verify2faWithAuthenticator": {
                    "__typename": "Account",
                },
            },
        }

        session_cookies = [
            cookie
            for cookie in client.cookies.jar
            if cookie.name == auth_settings.session_user_cookie_name
        ]
        assert len(session_cookies) > 0
