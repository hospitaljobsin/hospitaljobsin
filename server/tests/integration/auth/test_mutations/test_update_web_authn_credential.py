import secrets

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import WebAuthnCredentialRepo
from strawberry import relay
from webauthn.helpers.structs import AuthenticatorTransport

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION = """
mutation UpdateWebAuthnCredentialMutation(
    $webAuthnCredentialId: ID!
    $nickname: String!
) {
    updateWebAuthnCredential(
        webAuthnCredentialId: $webAuthnCredentialId
        nickname: $nickname
    ) {
        __typename
        ... on WebAuthnCredential {
            id
            nickname
        }
        ... on WebAuthnCredentialNotFoundError {
            message
        }
    }
}
"""


async def test_update_web_authn_credential_successful(
    webauthn_auth_graphql_client: GraphQLClient,
    webauthn_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> None:
    """Ensure that we can update webauthn credential successfully."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        account_id=webauthn_account.id
    )
    credential = credentials[0]

    response = await webauthn_auth_graphql_client(
        UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": relay.to_base64(
                "WebAuthnCredential", credential.id
            ),
            "nickname": "Updated Passkey Name",
        },
    )

    assert response == {
        "data": {
            "updateWebAuthnCredential": {
                "__typename": "WebAuthnCredential",
                "id": relay.to_base64("WebAuthnCredential", credential.id),
                "nickname": "Updated Passkey Name",
            },
        },
    }

    updated_credential = await webauthn_credential_repo.get(
        credential_id=credential.credential_id
    )
    assert updated_credential is not None
    assert updated_credential.nickname == "Updated Passkey Name"


async def test_update_web_authn_credential_without_authentication(
    graphql_client: GraphQLClient,
    webauthn_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> None:
    """Ensure that we cannot update webauthn credential without authentication."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        account_id=webauthn_account.id
    )
    credential = credentials[0]

    response = await graphql_client(
        UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": relay.to_base64(
                "WebAuthnCredential", credential.id
            ),
            "nickname": "Updated Passkey Name",
        },
    )

    assert "errors" in response


async def test_update_web_authn_credential_not_found(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we get an error when updating a non-existent webauthn credential."""
    from bson import ObjectId

    fake_id = ObjectId()

    response = await webauthn_auth_graphql_client(
        UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": relay.to_base64("WebAuthnCredential", fake_id),
            "nickname": "Updated Passkey Name",
        },
    )

    assert response == {
        "data": {
            "updateWebAuthnCredential": {
                "__typename": "WebAuthnCredentialNotFoundError",
                "message": "Webauthn credential not found.",
            },
        },
    }


async def test_update_web_authn_credential_belonging_to_another_user(
    webauthn_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> None:
    """Ensure that we cannot update another user's webauthn credential."""
    foreign_credential = await webauthn_credential_repo.create(
        account_id=foreign_password_account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\\x04\\x03O\\xc0QU\\xac-\\xfdJ[O\\xa8t&\\xe30X#\\r\\x19\\x9e\\xa3W\\x14\\x08SM\\xbf\\x9b\\x11\\x16\\x9e\\x89\\xb9j\\xe4\\xe2\\x17\\x9a\\xe0Z\\xc5\\xcf\\xc9\\xfb/\\x96B{\\xed\\x13\\x84G\\xca\\xb6\\xf9\\xb9V\\xff\\xd1\\x1f\\x00\\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="Foreign Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )

    response = await webauthn_auth_graphql_client(
        UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": relay.to_base64(
                "WebAuthnCredential", foreign_credential.id
            ),
            "nickname": "Hacked Passkey",
        },
    )

    assert response == {
        "data": {
            "updateWebAuthnCredential": {
                "__typename": "WebAuthnCredentialNotFoundError",
                "message": "Webauthn credential not found.",
            },
        },
    }

    unchanged_credential = await webauthn_credential_repo.get(
        credential_id=foreign_credential.credential_id
    )
    assert unchanged_credential is not None
    assert unchanged_credential.nickname == "Foreign Passkey"


@pytest.mark.parametrize(
    ("new_nickname", "description"),
    [
        ("A", "Single character nickname"),
        ("My Work Laptop", "Nickname with spaces"),
        ("iPhone 15 Pro Max", "Nickname with numbers"),
        ("🔑 Primary Key", "Nickname with emoji"),
        ("a" * 100, "Very long nickname"),
    ],
)
async def test_update_web_authn_credential_with_various_nicknames(
    webauthn_auth_graphql_client: GraphQLClient,
    webauthn_account: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
    new_nickname: str,
    description: str,
) -> None:
    """Ensure that we can update webauthn credential with various valid nicknames."""
    credentials = await webauthn_credential_repo.get_all_by_account_list(
        account_id=webauthn_account.id
    )
    credential = credentials[0]

    response = await webauthn_auth_graphql_client(
        UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "webAuthnCredentialId": relay.to_base64(
                "WebAuthnCredential", credential.id
            ),
            "nickname": new_nickname,
        },
    )

    assert (
        response["data"]["updateWebAuthnCredential"]["__typename"]
        == "WebAuthnCredential"
    )
    assert response["data"]["updateWebAuthnCredential"]["nickname"] == new_nickname

    updated_credential = await webauthn_credential_repo.get(
        credential_id=credential.credential_id
    )
    assert updated_credential is not None
    assert updated_credential.nickname == new_nickname


@pytest.fixture(scope="module")
async def account_with_multiple_credentials(
    account_repo: AccountRepo,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> Account:
    """Create an account with multiple webauthn credentials."""
    account = await account_repo.create(
        full_name="Multi Credential User",
        email=generate_test_email(),
        password=None,
        analytics_preference="acceptance",
        auth_providers=["webauthn_credential"],
    )

    await webauthn_credential_repo.create(
        account_id=account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\\x04\\x03O\\xc0QU\\xac-\\xfdJ[O\\xa8t&\\xe30X#\\r\\x19\\x9e\\xa3W\\x14\\x08SM\\xbf\\x9b\\x11\\x16\\x9e\\x89\\xb9j\\xe4\\xe2\\x17\\x9a\\xe0Z\\xc5\\xcf\\xc9\\xfb/\\x96B{\\xed\\x13\\x84G\\xca\\xb6\\xf9\\xb9V\\xff\\xd1\\x1f\\x00\\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="First Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )

    await webauthn_credential_repo.create(
        account_id=account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\\x04\\x03O\\xc0QU\\xac-\\xfdJ[O\\xa8t&\\xe30X#\\r\\x19\\x9e\\xa3W\\x14\\x08SM\\xbf\\x9b\\x11\\x16\\x9e\\x89\\xb9j\\xe4\\xe2\\x17\\x9a\\xe0Z\\xc5\\xcf\\xc9\\xfb/\\x96B{\\xed\\x13\\x84G\\xca\\xb6\\xf9\\xb9V\\xff\\xd1\\x1f\\x00\\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="Second Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )

    yield account
    await account_repo.delete(account)


async def test_update_one_of_multiple_credentials(
    lifespan_manager,
    account_with_multiple_credentials: Account,
    webauthn_credential_repo: WebAuthnCredentialRepo,
    session_repo,
    auth_settings,
    secret_settings,
) -> None:
    """Ensure that updating one credential doesn't affect others."""
    from datetime import UTC, datetime, timedelta

    from app.core.constants import SUDO_MODE_EXPIRES_IN
    from httpx import ASGITransport, AsyncClient, Cookies

    from tests.utils.auth import encrypt_session_data

    credentials = await webauthn_credential_repo.get_all_by_account_list(
        account_id=account_with_multiple_credentials.id
    )
    assert len(credentials) == 2

    first_credential = credentials[0]
    second_credential = credentials[1]

    session_token = await session_repo.create(
        account_with_multiple_credentials,
        user_agent="test-agent",
        ip_address="192.168.1.1",
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

        response = await graphql_client(
            UPDATE_WEB_AUTHN_CREDENTIAL_MUTATION,
            variables={
                "webAuthnCredentialId": relay.to_base64(
                    "WebAuthnCredential", first_credential.id
                ),
                "nickname": "Updated First Passkey",
            },
        )

        assert (
            response["data"]["updateWebAuthnCredential"]["__typename"]
            == "WebAuthnCredential"
        )
        assert (
            response["data"]["updateWebAuthnCredential"]["nickname"]
            == "Updated First Passkey"
        )

    updated_first = await webauthn_credential_repo.get(
        credential_id=first_credential.credential_id
    )
    unchanged_second = await webauthn_credential_repo.get(
        credential_id=second_credential.credential_id
    )

    assert updated_first is not None
    assert updated_first.nickname == "Updated First Passkey"
    assert unchanged_second is not None
    assert unchanged_second.nickname == "Second Passkey"
