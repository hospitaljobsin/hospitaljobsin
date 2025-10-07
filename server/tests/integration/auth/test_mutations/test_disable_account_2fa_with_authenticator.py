import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import RecoveryCodeRepo, SessionRepo
from app.config import AuthSettings, SecretSettings
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION = """
mutation DisableAccount2FAWithAuthenticatorMutation {
    disableAccount2faWithAuthenticator {
        __typename
        ... on Account {
            id
            twoFactorProviders
        }
        ... on AuthenticatorNotEnabledError {
            __typename
        }
    }
}
"""


@pytest.fixture
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
async def account_with_2fa_auth_sudo_http_client(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncClient:
    """Create authenticated HTTP client with sudo mode for account with 2FA."""
    from datetime import UTC, datetime, timedelta

    from app.core.constants import SUDO_MODE_EXPIRES_IN

    session_token = await session_repo.create(
        account_with_2fa, user_agent="test-agent", ip_address="192.168.1.1"
    )

    sudo_mode_expires_at = datetime.now(UTC) + timedelta(seconds=SUDO_MODE_EXPIRES_IN)

    encrypted_session = encrypt_session_data(
        secret_settings,
        {
            "session_token": session_token,
            "sudo_mode_expires_at": sudo_mode_expires_at.isoformat(),
        },
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
async def account_with_2fa_auth_sudo_graphql_client(
    account_with_2fa_auth_sudo_http_client: AsyncClient,
) -> GraphQLClient:
    """Create authenticated GraphQL client with sudo mode for account with 2FA."""
    return GraphQLClient(
        client=account_with_2fa_auth_sudo_http_client,
        endpoint="/graphql",
    )


async def test_disable_2fa_success(
    account_with_2fa_auth_sudo_graphql_client: GraphQLClient,
    account_with_2fa: Account,
    account_repo: AccountRepo,
    recovery_code_repo: RecoveryCodeRepo,
) -> None:
    """Ensure that we can disable 2FA for an account with 2FA enabled."""
    await recovery_code_repo.create_many(account_id=account_with_2fa.id)

    response = await account_with_2fa_auth_sudo_graphql_client(
        DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
    )

    assert (
        response["data"]["disableAccount2faWithAuthenticator"]["__typename"]
        == "Account"
    )
    assert (
        response["data"]["disableAccount2faWithAuthenticator"]["twoFactorProviders"]
        == []
    )

    updated_account = await account_repo.get(account_with_2fa.id)
    assert updated_account.two_factor_secret is None
    assert updated_account.two_factor_providers == []


async def test_disable_2fa_removes_recovery_codes(
    account_with_2fa_auth_sudo_graphql_client: GraphQLClient,
    account_with_2fa: Account,
    recovery_code_repo: RecoveryCodeRepo,
) -> None:
    """Ensure that disabling 2FA removes all recovery codes."""
    recovery_codes = await recovery_code_repo.create_many(
        account_id=account_with_2fa.id
    )
    assert len(recovery_codes) == 10

    response = await account_with_2fa_auth_sudo_graphql_client(
        DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
    )

    assert (
        response["data"]["disableAccount2faWithAuthenticator"]["__typename"]
        == "Account"
    )

    for code in recovery_codes:
        existing_code = await recovery_code_repo.get(
            account_id=account_with_2fa.id, code=code
        )
        assert existing_code is None


async def test_disable_2fa_without_2fa_enabled(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot disable 2FA when it is not enabled."""
    response = await password_auth_sudo_graphql_client(
        DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
    )

    assert response == {
        "data": {
            "disableAccount2faWithAuthenticator": {
                "__typename": "AuthenticatorNotEnabledError",
            },
        },
    }


async def test_disable_2fa_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot disable 2FA."""
    response = await graphql_client(
        DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
    )

    assert "errors" in response


async def test_disable_2fa_without_sudo_mode(
    account_with_2fa: Account,
    lifespan_manager: LifespanManager,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that users cannot disable 2FA without sudo mode."""
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
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")
        response = await graphql_client(DISABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION)

        assert "errors" in response
