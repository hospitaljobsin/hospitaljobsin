import secrets
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import SessionRepo, WebAuthnCredentialRepo
from app.config import AuthSettings, SecretSettings
from app.core.constants import SUDO_MODE_EXPIRES_IN
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient, Cookies
from strawberry.relay import to_base64
from webauthn.helpers.structs import AuthenticatorTransport

from tests.integration.graphql_client import GraphQLClient
from tests.utils.auth import encrypt_session_data
from tests.utils.emails import generate_test_email

DELETE_WEB_AUTHN_CREDENTIAL_MUTATION = """
mutation DeleteWebAuthnCredentialMutation($webAuthnCredentialId: ID!) {
    deleteWebAuthnCredential(webAuthnCredentialId: $webAuthnCredentialId) {
        __typename
        ... on DeleteWebAuthnCredentialSuccess {
            webAuthnCredentialEdge {
                node {
                    id
                }
            }
        }
        ... on WebAuthnCredentialNotFoundError {
            __typename
        }
        ... on InsufficientAuthProvidersError {
            __typename
        }
    }
}
"""


@pytest.fixture
async def multi_credential_account(
    account_repo: AccountRepo,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> AsyncIterator[Account]:
    """Create an account with multiple webauthn credentials and password."""
    account = await account_repo.create(
        full_name="Multi Credential User",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password", "webauthn_credential"],
    )

    if account.id is not None:
        await webauthn_credential_repo.create(
            account_id=account.id,
            credential_id=secrets.token_bytes(16),
            credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
            sign_count=0,
            backed_up=False,
            device_type="platform",
            nickname="First Passkey",
            transports=[AuthenticatorTransport.INTERNAL],
        )
        await webauthn_credential_repo.create(
            account_id=account.id,
            credential_id=secrets.token_bytes(16),
            credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
            sign_count=0,
            backed_up=False,
            device_type="platform",
            nickname="Second Passkey",
            transports=[AuthenticatorTransport.INTERNAL],
        )

    yield account
    await account_repo.delete(account)


@pytest.fixture
async def multi_credential_auth_sudo_graphql_client(
    lifespan_manager: LifespanManager,
    multi_credential_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[GraphQLClient]:
    """Create authenticated GraphQL client with sudo mode for multi-credential account."""
    session_token = await session_repo.create(
        multi_credential_account, user_agent="test-agent", ip_address="192.168.1.1"
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


@pytest.fixture
async def single_credential_account(
    account_repo: AccountRepo,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> AsyncIterator[Account]:
    """Create an account with only one webauthn credential."""
    account = await account_repo.create(
        full_name="Single Credential User",
        email=generate_test_email(),
        password=None,
        analytics_preference="acceptance",
        auth_providers=["webauthn_credential"],
    )

    if account.id is not None:
        await webauthn_credential_repo.create(
            account_id=account.id,
            credential_id=secrets.token_bytes(16),
            credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
            sign_count=0,
            backed_up=False,
            device_type="platform",
            nickname="Only Passkey",
            transports=[AuthenticatorTransport.INTERNAL],
        )

    yield account
    await account_repo.delete(account)


@pytest.fixture
async def single_credential_auth_sudo_graphql_client(
    lifespan_manager: LifespanManager,
    single_credential_account: Account,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> AsyncIterator[GraphQLClient]:
    """Create authenticated GraphQL client with sudo mode for single-credential account."""
    session_token = await session_repo.create(
        single_credential_account, user_agent="test-agent", ip_address="192.168.1.1"
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


async def test_delete_web_authn_credential_successful(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    webauthn_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
    account_repo: AccountRepo,
) -> None:
    """Ensure that we can delete a webauthn credential successfully when other auth providers exist."""
    assert "password" in webauthn_account.auth_providers
    assert "webauthn_credential" in webauthn_account.auth_providers

    credentials = await webauthn_credential_repo.get_all_by_account_list(
        webauthn_account.id
    )
    assert len(credentials) == 1
    credential_to_delete = credentials[0]

    response = await webauthn_auth_sudo_graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64(
                "WebAuthnCredential", credential_to_delete.id
            )
        },
    )

    assert response == {
        "data": {
            "deleteWebAuthnCredential": {
                "__typename": "DeleteWebAuthnCredentialSuccess",
                "webAuthnCredentialEdge": {
                    "node": {
                        "id": to_base64("WebAuthnCredential", credential_to_delete.id),
                    }
                },
            },
        },
    }

    remaining_credentials = await webauthn_credential_repo.get_all_by_account_list(
        webauthn_account.id
    )
    assert len(remaining_credentials) == 0

    updated_account = await account_repo.get(webauthn_account.id)
    assert updated_account is not None
    assert "password" in updated_account.auth_providers


async def test_delete_web_authn_credential_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot delete a webauthn credential without authentication."""
    response = await graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64(
                "WebAuthnCredential", "123456789012345678901234"
            )
        },
    )

    assert "errors" in response


async def test_delete_web_authn_credential_without_sudo_mode(
    lifespan_manager: LifespanManager,
    multi_credential_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
    session_repo: SessionRepo,
    auth_settings: AuthSettings,
    secret_settings: SecretSettings,
) -> None:
    """Ensure that we cannot delete a webauthn credential without sudo mode."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        multi_credential_account.id
    )
    credential_to_delete = credentials[0]

    session_token = await session_repo.create(
        multi_credential_account, user_agent="test-agent", ip_address="192.168.1.1"
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
        graphql_client = GraphQLClient(
            client=client,
            endpoint="/graphql",
        )
        response = await graphql_client(
            DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
            variables={
                "webAuthnCredentialId": to_base64(
                    "WebAuthnCredential", credential_to_delete.id
                )
            },
        )

    assert "errors" in response


async def test_delete_web_authn_credential_with_only_one_credential(
    single_credential_auth_sudo_graphql_client: GraphQLClient,
    single_credential_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> None:
    """Ensure that we cannot delete the only webauthn credential when it's the only auth provider."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        single_credential_account.id
    )
    assert len(credentials) == 1
    credential_to_delete = credentials[0]

    response = await single_credential_auth_sudo_graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64(
                "WebAuthnCredential", credential_to_delete.id
            )
        },
    )

    assert response == {
        "data": {
            "deleteWebAuthnCredential": {
                "__typename": "InsufficientAuthProvidersError",
            },
        },
    }

    remaining_credentials = await webauthn_credential_repo.get_all_by_account_list(
        single_credential_account.id
    )
    assert len(remaining_credentials) == 1


async def test_delete_web_authn_credential_not_found(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we get an error when trying to delete a non-existent webauthn credential."""
    response = await webauthn_auth_sudo_graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64(
                "WebAuthnCredential", "123456789012345678901234"
            )
        },
    )

    assert response == {
        "data": {
            "deleteWebAuthnCredential": {
                "__typename": "WebAuthnCredentialNotFoundError",
            },
        },
    }


async def test_delete_web_authn_credential_from_another_account(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> None:
    """Ensure that we cannot delete a webauthn credential belonging to another account."""
    credential = await webauthn_credential_repo.create(
        account_id=foreign_password_account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="Foreign Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )

    response = await webauthn_auth_sudo_graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64("WebAuthnCredential", credential.id)
        },
    )

    assert response == {
        "data": {
            "deleteWebAuthnCredential": {
                "__typename": "WebAuthnCredentialNotFoundError",
            },
        },
    }

    remaining_credentials = await webauthn_credential_repo.get_all_by_account_list(
        foreign_password_account.id
    )
    assert len(remaining_credentials) == 1


async def test_delete_web_authn_credential_with_multiple_credentials(
    multi_credential_auth_sudo_graphql_client: GraphQLClient,
    multi_credential_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
    account_repo: AccountRepo,
) -> None:
    """Ensure that deleting one webauthn credential works when multiple credentials exist."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        multi_credential_account.id
    )
    assert len(credentials) == 2
    credential_to_delete = credentials[0]

    response = await multi_credential_auth_sudo_graphql_client(
        DELETE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": to_base64(
                "WebAuthnCredential", credential_to_delete.id
            )
        },
    )

    assert response == {
        "data": {
            "deleteWebAuthnCredential": {
                "__typename": "DeleteWebAuthnCredentialSuccess",
                "webAuthnCredentialEdge": {
                    "node": {
                        "id": to_base64("WebAuthnCredential", credential_to_delete.id),
                    }
                },
            },
        },
    }

    remaining_credentials = await webauthn_credential_repo.get_all_by_account_list(
        multi_credential_account.id
    )
    assert len(remaining_credentials) == 1

    updated_account = await account_repo.get(multi_credential_account.id)
    assert updated_account is not None
    assert "webauthn_credential" in updated_account.auth_providers
    assert "password" in updated_account.auth_providers
