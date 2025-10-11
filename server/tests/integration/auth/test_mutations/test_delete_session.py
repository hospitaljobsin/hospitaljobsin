from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
from app.accounts.documents import Account
from app.auth.repositories import SessionRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data

DELETE_SESSION_MUTATION = """
mutation DeleteSessionMutation($sessionId: ID!) {
    deleteSession(sessionId: $sessionId) {
        __typename
        ... on DeleteSessionSuccess {
            sessionEdge {
                node {
                    id
                }
            }
        }
        ... on SessionNotFoundError {
            __typename
        }
    }
}
"""


@pytest.fixture
async def password_account_with_multiple_sessions(
    lifespan_manager: LifespanManager,
    password_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[tuple[GraphQLClient, str, str]]:
    """Create authenticated GraphQL client with sudo mode and multiple sessions."""
    # Create first session (current session)
    session_token_1 = await session_repo.create(
        password_account, user_agent="test-agent-1", ip_address="192.168.1.1"
    )

    # Create second session (to be deleted)
    session_token_2 = await session_repo.create(
        password_account, user_agent="test-agent-2", ip_address="192.168.1.2"
    )

    # Get session 2 details
    session_2 = await session_repo.get(session_token_2)
    session_2_id = relay.to_base64("Session", str(session_2.id))

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
        transport=ASGITransport(
            app=lifespan_manager.app,  # type: ignore[arg-type]
        ),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        yield (
            GraphQLClient(
                client=client,
                endpoint="/graphql",
            ),
            session_2_id,
            session_token_1,
        )


async def test_delete_session_successful(
    password_account_with_multiple_sessions: tuple[GraphQLClient, str, str],
    session_repo: SessionRepo,
) -> None:
    """Ensure that we can delete a session successfully."""
    graphql_client, session_2_id, _ = password_account_with_multiple_sessions

    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": session_2_id}
    )

    assert response == {
        "data": {
            "deleteSession": {
                "__typename": "DeleteSessionSuccess",
                "sessionEdge": {
                    "node": {
                        "id": session_2_id,
                    }
                },
            },
        },
    }

    # Verify session was actually deleted
    session_2 = await session_repo.get(relay.GlobalID.from_id(session_2_id).node_id)
    assert session_2 is None


async def test_delete_session_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete a session without authentication."""
    fake_session_id = relay.to_base64("Session", "507f1f77bcf86cd799439011")

    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": fake_session_id}
    )

    assert "errors" in response


async def test_delete_session_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete a session without sudo mode."""
    fake_session_id = relay.to_base64("Session", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": fake_session_id}
    )

    assert "errors" in response


async def test_delete_session_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that deleting a non-existent session returns SessionNotFoundError."""
    fake_session_id = relay.to_base64("Session", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": fake_session_id}
    )

    assert response == {
        "data": {
            "deleteSession": {
                "__typename": "SessionNotFoundError",
            },
        },
    }


async def test_delete_session_belonging_to_another_user(
    password_account_with_multiple_sessions: tuple[GraphQLClient, str, str],
    foreign_password_account: Account,
    session_repo: SessionRepo,
) -> None:
    """Ensure that we cannot delete a session belonging to another user."""
    graphql_client, _, _ = password_account_with_multiple_sessions

    # Create a session for the foreign account
    foreign_session_token = await session_repo.create(
        foreign_password_account, user_agent="foreign-agent", ip_address="192.168.1.3"
    )
    foreign_session = await session_repo.get(foreign_session_token)
    foreign_session_id = relay.to_base64("Session", str(foreign_session.id))

    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": foreign_session_id}
    )

    assert response == {
        "data": {
            "deleteSession": {
                "__typename": "SessionNotFoundError",
            },
        },
    }

    # Verify foreign session still exists
    foreign_session_check = await session_repo.get(foreign_session_token)
    assert foreign_session_check is not None


async def test_delete_current_session(
    password_account_with_multiple_sessions: tuple[GraphQLClient, str, str],
    session_repo: SessionRepo,
) -> None:
    """Ensure that we cannot delete the current session."""
    graphql_client, _, current_session_token = password_account_with_multiple_sessions

    # Get current session ID
    current_session = await session_repo.get(current_session_token)
    current_session_id = relay.to_base64("Session", str(current_session.id))

    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": current_session_id}
    )

    assert response == {
        "data": {
            "deleteSession": {
                "__typename": "SessionNotFoundError",
            },
        },
    }

    # Verify current session still exists
    current_session_check = await session_repo.get(current_session_token)
    assert current_session_check is not None


async def test_delete_already_deleted_session(
    password_account_with_multiple_sessions: tuple[GraphQLClient, str, str],
    session_repo: SessionRepo,
) -> None:
    """Ensure that deleting an already deleted session returns SessionNotFoundError."""
    graphql_client, session_2_id, _ = password_account_with_multiple_sessions

    # Delete the session first time
    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": session_2_id}
    )

    assert response["data"]["deleteSession"]["__typename"] == "DeleteSessionSuccess"

    # Try to delete the same session again
    response = await graphql_client(
        DELETE_SESSION_MUTATION, variables={"sessionId": session_2_id}
    )

    assert response == {
        "data": {
            "deleteSession": {
                "__typename": "SessionNotFoundError",
            },
        },
    }
