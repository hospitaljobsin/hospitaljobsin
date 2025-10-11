from collections.abc import AsyncIterator

import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import RecoveryCodeRepo, TwoFactorAuthenticationChallengeRepo
from app.config import AuthSettings, SecretSettings
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION = """
mutation Verify2FAWithRecoveryCodeMutation(
    $token: String!
    $captchaToken: String!
) {
    verify2faWithRecoveryCode(
        token: $token
        captchaToken: $captchaToken
    ) {
        __typename
        ... on Account {
            id
            email
        }
        ... on InvalidCredentialsError {
            __typename
        }
        ... on TwoFactorAuthenticationNotEnabledError {
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
async def http_client_with_2fa_challenge(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[AsyncClient]:
    """Create HTTP client with 2FA challenge in session."""
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=account_with_2fa,
        totp_secret=account_with_2fa.two_factor_secret,
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


async def test_verify_2fa_with_valid_recovery_code(
    graphql_client_with_2fa_challenge: GraphQLClient,
    account_with_2fa: Account,
    recovery_code_repo: RecoveryCodeRepo,
) -> None:
    """Ensure that we can verify 2FA with a valid recovery code."""
    recovery_code = await recovery_code_repo.create(account_id=account_with_2fa.id)

    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION,
        variables={
            "token": recovery_code,
            "captchaToken": "captcha-token",
        },
    )

    assert response["data"]["verify2faWithRecoveryCode"]["__typename"] == "Account"
    assert (
        response["data"]["verify2faWithRecoveryCode"]["email"] == account_with_2fa.email
    )

    existing_code = await recovery_code_repo.get(
        account_id=account_with_2fa.id, code=recovery_code
    )
    assert existing_code is None


async def test_verify_2fa_with_invalid_recovery_code(
    graphql_client_with_2fa_challenge: GraphQLClient,
) -> None:
    """Ensure that we cannot verify 2FA with an invalid recovery code."""
    response = await graphql_client_with_2fa_challenge(
        VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION,
        variables={
            "token": "INVALIDCODE",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithRecoveryCode": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_verify_2fa_with_recovery_code_without_challenge(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    recovery_code_repo: RecoveryCodeRepo,
) -> None:
    """Ensure that we cannot verify 2FA without a challenge cookie."""
    recovery_code = await recovery_code_repo.create(account_id=account_with_2fa.id)

    response = await graphql_client(
        VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION,
        variables={
            "token": recovery_code,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faWithRecoveryCode": {
                "__typename": "TwoFactorAuthenticationChallengeNotFoundError",
            },
        },
    }

    existing_code = await recovery_code_repo.get(
        account_id=account_with_2fa.id, code=recovery_code
    )
    assert existing_code is not None
    await recovery_code_repo.delete(existing_code)


async def test_verify_2fa_with_recovery_code_without_2fa_enabled(
    lifespan_manager: LifespanManager,
    password_account: Account,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that we cannot verify 2FA when 2FA is not enabled."""
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=password_account,
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
            VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION,
            variables={
                "token": "SOMECODE",
                "captchaToken": "captcha-token",
            },
        )

        assert response == {
            "data": {
                "verify2faWithRecoveryCode": {
                    "__typename": "TwoFactorAuthenticationNotEnabledError",
                },
            },
        }


async def test_verify_2fa_with_recovery_code_creates_session(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    recovery_code_repo: RecoveryCodeRepo,
    two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that a session is created after successful verification."""
    recovery_code = await recovery_code_repo.create(account_id=account_with_2fa.id)
    challenge, _ = await two_factor_authentication_challenge_repo.create(
        account=account_with_2fa,
        totp_secret=account_with_2fa.two_factor_secret,
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
            VERIFY_2FA_WITH_RECOVERY_CODE_MUTATION,
            variables={
                "token": recovery_code,
                "captchaToken": "captcha-token",
            },
        )

        assert response["data"]["verify2faWithRecoveryCode"]["__typename"] == "Account"

        session_cookies = [
            cookie
            for cookie in client.cookies.jar
            if cookie.name == auth_settings.session_user_cookie_name
        ]
        assert len(session_cookies) > 0
