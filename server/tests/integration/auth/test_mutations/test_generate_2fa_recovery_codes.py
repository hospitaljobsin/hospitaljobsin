from datetime import UTC, datetime, timedelta

import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import RecoveryCodeRepo, SessionRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

GENERATE_2FA_RECOVERY_CODES_MUTATION = """
mutation Generate2FARecoveryCodesMutation {
    generate2faRecoveryCodes {
        __typename
        ... on Generate2FARecoveryCodesSuccess {
            recoveryCodes
        }
        ... on TwoFactorAuthenticationNotEnabledError {
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
async def account_with_2fa_auth_sudo_http_client(
    lifespan_manager: LifespanManager,
    account_with_2fa: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncClient:
    """Create authenticated HTTP client with sudo mode for account with 2FA."""

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


async def test_generate_recovery_codes_success(
    account_with_2fa_auth_sudo_graphql_client: GraphQLClient,
    recovery_code_repo: RecoveryCodeRepo,
    account_with_2fa: Account,
) -> None:
    """Ensure that we can generate recovery codes for an account with 2FA enabled."""
    # Create initial recovery codes
    await recovery_code_repo.create_many(account_id=account_with_2fa.id)

    response = await account_with_2fa_auth_sudo_graphql_client(
        GENERATE_2FA_RECOVERY_CODES_MUTATION,
    )

    assert (
        response["data"]["generate2faRecoveryCodes"]["__typename"]
        == "Generate2FARecoveryCodesSuccess"
    )
    recovery_codes = response["data"]["generate2faRecoveryCodes"]["recoveryCodes"]
    assert isinstance(recovery_codes, list)
    assert len(recovery_codes) == 10
    for code in recovery_codes:
        assert isinstance(code, str)
        assert len(code) > 0


async def test_generate_recovery_codes_replaces_old_codes(
    account_with_2fa_auth_sudo_graphql_client: GraphQLClient,
    recovery_code_repo: RecoveryCodeRepo,
    account_with_2fa: Account,
) -> None:
    """Ensure that generating new recovery codes replaces old ones."""
    # Create initial recovery codes
    old_codes = await recovery_code_repo.create_many(account_id=account_with_2fa.id)

    response = await account_with_2fa_auth_sudo_graphql_client(
        GENERATE_2FA_RECOVERY_CODES_MUTATION,
    )

    assert (
        response["data"]["generate2faRecoveryCodes"]["__typename"]
        == "Generate2FARecoveryCodesSuccess"
    )
    new_codes = response["data"]["generate2faRecoveryCodes"]["recoveryCodes"]

    # Verify old codes are no longer valid
    for old_code in old_codes:
        existing_code = await recovery_code_repo.get(
            account_id=account_with_2fa.id, code=old_code
        )
        assert existing_code is None

    # Verify new codes exist
    for new_code in new_codes:
        existing_code = await recovery_code_repo.get(
            account_id=account_with_2fa.id, code=new_code
        )
        assert existing_code is not None


async def test_generate_recovery_codes_without_2fa_enabled(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot generate recovery codes when 2FA is not enabled."""
    response = await password_auth_sudo_graphql_client(
        GENERATE_2FA_RECOVERY_CODES_MUTATION,
    )

    assert response == {
        "data": {
            "generate2faRecoveryCodes": {
                "__typename": "TwoFactorAuthenticationNotEnabledError",
            },
        },
    }


async def test_generate_recovery_codes_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot generate recovery codes."""
    response = await graphql_client(
        GENERATE_2FA_RECOVERY_CODES_MUTATION,
    )

    assert "errors" in response


async def test_generate_recovery_codes_without_sudo_mode(
    account_with_2fa: Account,
    lifespan_manager: LifespanManager,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that users cannot generate recovery codes without sudo mode."""
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
        response = await graphql_client(GENERATE_2FA_RECOVERY_CODES_MUTATION)

        assert "errors" in response
