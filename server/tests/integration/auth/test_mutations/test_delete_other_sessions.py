from datetime import UTC, datetime, timedelta

from app.accounts.documents import Account
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data

DELETE_OTHER_SESSIONS_MUTATION = """
mutation DeleteOtherSessionsMutation {
    deleteOtherSessions {
        __typename
        deletedSessionIds
    }
}
"""


async def test_delete_other_sessions_success(
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Test successful deletion of other sessions."""
    # Create multiple sessions
    session_token_1 = await session_repo.create(
        password_account, user_agent="test-agent-1", ip_address="192.168.1.1"
    )
    await session_repo.create(
        password_account, user_agent="test-agent-2", ip_address="192.168.1.2"
    )
    await session_repo.create(
        password_account, user_agent="test-agent-3", ip_address="192.168.1.3"
    )

    sudo_mode_expires_at = datetime.now(UTC) + timedelta(seconds=SUDO_MODE_EXPIRES_IN)
    session_data = {
        "session_token": session_token_1,
        "sudo_mode_expires_at": sudo_mode_expires_at.isoformat(),
    }
    encrypted_session = encrypt_session_data(secret_settings, session_data)

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
        response = await graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert (
        response["data"]["deleteOtherSessions"]["__typename"]
        == "DeleteOtherSessionsPayload"
    )
    assert len(response["data"]["deleteOtherSessions"]["deletedSessionIds"]) == 2

    remaining_sessions = await session_repo.get_all_list(
        account_id=password_account.id, except_session_token=""
    )
    assert len(remaining_sessions) == 1


async def test_delete_other_sessions_no_other_sessions(
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Test deletion when only current session exists."""
    all_sessions = await session_repo.get_all_list(
        account_id=password_account.id, except_session_token=""
    )
    for session in all_sessions:
        await session_repo.delete(session)

    session_token = await session_repo.create(
        password_account, user_agent="test-agent", ip_address="192.168.1.1"
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
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")
        response = await graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert (
        response["data"]["deleteOtherSessions"]["__typename"]
        == "DeleteOtherSessionsPayload"
    )
    assert response["data"]["deleteOtherSessions"]["deletedSessionIds"] == []

    remaining_sessions = await session_repo.get_all_list(
        account_id=password_account.id, except_session_token=""
    )
    assert len(remaining_sessions) == 1


async def test_delete_other_sessions_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Test that unauthenticated users cannot delete sessions."""
    response = await graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert "errors" in response


async def test_delete_other_sessions_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that deletion requires sudo mode."""
    response = await password_auth_graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert "errors" in response


async def test_delete_other_sessions_preserves_current_session(
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Test that current session is preserved after deletion."""
    current_session_token = await session_repo.create(
        password_account, user_agent="current-agent", ip_address="192.168.1.1"
    )
    await session_repo.create(
        password_account, user_agent="other-agent-1", ip_address="192.168.1.2"
    )
    await session_repo.create(
        password_account, user_agent="other-agent-2", ip_address="192.168.1.3"
    )

    sudo_mode_expires_at = datetime.now(UTC) + timedelta(seconds=SUDO_MODE_EXPIRES_IN)
    session_data = {
        "session_token": current_session_token,
        "sudo_mode_expires_at": sudo_mode_expires_at.isoformat(),
    }
    encrypted_session = encrypt_session_data(secret_settings, session_data)

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
        response = await graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert (
        response["data"]["deleteOtherSessions"]["__typename"]
        == "DeleteOtherSessionsPayload"
    )

    current_session = await session_repo.get(current_session_token)
    assert current_session is not None


async def test_delete_other_sessions_webauthn_account(
    lifespan_manager: LifespanManager,
    webauthn_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Test deletion works for webauthn authenticated accounts."""
    session_token = await session_repo.create(
        webauthn_account, user_agent="webauthn-agent", ip_address="192.168.1.1"
    )
    await session_repo.create(
        webauthn_account, user_agent="other-agent", ip_address="192.168.1.2"
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
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")
        response = await graphql_client(DELETE_OTHER_SESSIONS_MUTATION)

    assert (
        response["data"]["deleteOtherSessions"]["__typename"]
        == "DeleteOtherSessionsPayload"
    )
    assert len(response["data"]["deleteOtherSessions"]["deletedSessionIds"]) == 1
