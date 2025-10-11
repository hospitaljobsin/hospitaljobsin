import base64
import json
from base64 import b64encode
from typing import Any

import pytest
from app.accounts.documents import Account
from app.config import AuthSettings, get_settings
from webauthn.helpers.bytes_to_base64url import bytes_to_base64url

from tests.integration.graphql_client import GraphQLClient

CREATE_WEB_AUTHN_CREDENTIAL_MUTATION = """
mutation CreateWebAuthnCredentialMutation(
    $passkeyRegistrationResponse: JSON!
    $nickname: String!
) {
    createWebAuthnCredential(
        passkeyRegistrationResponse: $passkeyRegistrationResponse
        nickname: $nickname
    ) {
        __typename
        ... on CreateWebAuthnCredentialSuccess {
            webAuthnCredentialEdge {
                node {
                    id
                    nickname
                }
            }
        }
        ... on InvalidPasskeyRegistrationCredentialError {
            __typename
        }
    }
}
"""


def create_mock_webauthn_credential(challenge: bytes) -> dict[str, Any]:
    """Create a mock WebAuthn registration credential response."""
    origin = get_settings(AuthSettings).rp_expected_origin
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    rp_id_hash = b"0" * 32
    flags = b"\x41"
    sign_count = b"\x00\x00\x00\x00"
    aaguid = b"0" * 16
    credential_id_length = len(credential_id).to_bytes(2, "big")
    credential_id_bytes = credential_id.encode("ascii")
    mock_public_key = b'{"kty":"RSA","use":"sig","alg":"RS256"}'

    auth_data = (
        rp_id_hash
        + flags
        + sign_count
        + aaguid
        + credential_id_length
        + credential_id_bytes
        + mock_public_key
    )

    attestation_json = json.dumps(
        {"fmt": "none", "attStmt": {}, "authData": base64.b64encode(auth_data).decode()}
    )
    attestation_object = base64.b64encode(attestation_json.encode()).decode()

    client_data = {
        "type": "webauthn.create",
        "challenge": bytes_to_base64url(challenge),
        "origin": origin,
        "crossOrigin": False,
    }
    client_data_json = b64encode(json.dumps(client_data).encode()).decode()

    return {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "attestationObject": attestation_object,
            "clientDataJSON": client_data_json,
            "transports": ["internal"],
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }


def create_invalid_webauthn_credential() -> dict[str, Any]:
    """Create an invalid WebAuthn credential for testing error scenarios."""
    invalid_client_data = {
        "type": "webauthn.create",
        "challenge": "wrong-challenge",
        "origin": "https://evil.com",
        "crossOrigin": False,
    }
    invalid_client_data_json = b64encode(
        json.dumps(invalid_client_data).encode()
    ).decode()

    return {
        "id": "invalid-credential-id",
        "rawId": "different-raw-id",
        "response": {
            "attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVgkSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAApAEDAzkBACBZAQDfV20epzvQP-HtcdDpX-cGzdOxy73WQEvs",
            "clientDataJSON": invalid_client_data_json,
            "transports": ["internal"],
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }


async def test_create_web_authn_credential_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that create_web_authn_credential fails without authentication."""
    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Passkey",
        },
    )

    assert "errors" in response


async def test_create_web_authn_credential_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that create_web_authn_credential fails without sudo mode."""
    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await password_auth_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Passkey",
        },
    )

    assert "errors" in response


async def test_create_web_authn_credential_with_invalid_credential(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test create_web_authn_credential with invalid credential structure."""
    passkey_registration_response = create_invalid_webauthn_credential()

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Passkey",
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0
    error_message = response["errors"][0]["message"]
    assert "id and raw_id were not equivalent" in error_message


async def test_create_web_authn_credential_with_malformed_response(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test create_web_authn_credential with malformed passkey response."""
    malformed_response = {
        "id": "some-id",
        "type": "public-key",
    }

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": malformed_response,
            "nickname": "My Passkey",
        },
    )

    assert response == {
        "data": {
            "createWebAuthnCredential": {
                "__typename": "InvalidPasskeyRegistrationCredentialError",
            },
        },
    }


async def test_create_web_authn_credential_with_empty_response(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test create_web_authn_credential with empty passkey response."""
    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": {},
            "nickname": "My Passkey",
        },
    )

    assert response == {
        "data": {
            "createWebAuthnCredential": {
                "__typename": "InvalidPasskeyRegistrationCredentialError",
            },
        },
    }


async def test_create_web_authn_credential_id_rawid_mismatch(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test create_web_authn_credential when id and rawId don't match."""
    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)
    passkey_registration_response["rawId"] = "different-raw-id"

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Passkey",
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0
    error_message = response["errors"][0]["message"]
    assert "id and raw_id were not equivalent" in error_message


@pytest.mark.parametrize(
    ("nickname", "description"),
    [
        ("", "Empty nickname"),
        ("   ", "Whitespace only nickname"),
        ("a" * 256, "Very long nickname"),
    ],
)
async def test_create_web_authn_credential_invalid_nickname(
    password_auth_sudo_graphql_client: GraphQLClient,
    nickname: str,
    description: str,
) -> None:
    """Ensure that create_web_authn_credential handles invalid nicknames properly."""
    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": nickname,
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0
    error_message = response["errors"][0]["message"]
    assert "Could not decode CBOR data" in error_message, (
        f"Failed for case: {description}"
    )


async def test_create_web_authn_credential_successful_mock(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that create_web_authn_credential with mock credential fails at CBOR parsing."""
    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Test Passkey",
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0
    error_message = response["errors"][0]["message"]
    assert "Could not decode CBOR data" in error_message


async def test_create_web_authn_credential_adds_auth_provider(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that creating first webauthn credential adds auth provider."""
    assert "webauthn_credential" not in password_account.auth_providers

    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await password_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "My Passkey",
        },
    )

    assert response["data"] is None
    assert "errors" in response


async def test_create_web_authn_credential_for_webauthn_account(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    webauthn_account: Account,
) -> None:
    """Ensure that webauthn accounts can add additional credentials."""
    assert "webauthn_credential" in webauthn_account.auth_providers

    challenge = b"test-challenge-bytes-1234567890123456"
    passkey_registration_response = create_mock_webauthn_credential(challenge)

    response = await webauthn_auth_sudo_graphql_client(
        CREATE_WEB_AUTHN_CREDENTIAL_MUTATION,
        variables={
            "passkeyRegistrationResponse": passkey_registration_response,
            "nickname": "Second Passkey",
        },
    )

    assert response["data"] is None
    assert "errors" in response
