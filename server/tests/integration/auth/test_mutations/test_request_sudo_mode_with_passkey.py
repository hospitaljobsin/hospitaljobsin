import base64
import json
from base64 import b64encode
from typing import Any

import pytest
from app.config import AuthSettings, get_settings
from webauthn.helpers.base64url_to_bytes import base64url_to_bytes
from webauthn.helpers.bytes_to_base64url import bytes_to_base64url

from tests.integration.graphql_client import GraphQLClient

REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION = """
mutation RequestSudoModeWithPasskeyMutation(
    $authenticationResponse: JSON!
    $captchaToken: String!
) {
    requestSudoModeWithPasskey(
        authenticationResponse: $authenticationResponse
        captchaToken: $captchaToken
    ) {
        __typename
        ... on Account {
            __typename
            id
            email
            fullName
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
        ... on InvalidPasskeyAuthenticationCredentialError {
            __typename
        }
        ... on WebAuthnChallengeNotFoundError {
            __typename
        }
    }
}
"""

GENERATE_REAUTHENTICATION_OPTIONS_MUTATION = """
mutation GenerateReauthenticationOptionsMutation($captchaToken: String!) {
    generateReauthenticationOptions(captchaToken: $captchaToken) {
        __typename
        ... on GenerateAuthenticationOptionsSuccess {
            __typename
            authenticationOptions
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
    }
}
"""


async def generate_reauthentication_options_for_test(
    graphql_client: GraphQLClient,
) -> tuple[bytes, dict[str, Any]]:
    """Generate reauthentication options and return the challenge bytes and full options."""
    response = await graphql_client(
        GENERATE_REAUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    assert (
        response["data"]["generateReauthenticationOptions"]["__typename"]
        == "GenerateAuthenticationOptionsSuccess"
    )

    auth_options_json = response["data"]["generateReauthenticationOptions"][
        "authenticationOptions"
    ]
    auth_options = json.loads(auth_options_json)

    challenge_base64url = auth_options["challenge"]
    challenge_bytes = base64url_to_bytes(challenge_base64url)

    return challenge_bytes, auth_options


def create_mock_webauthn_authentication_response(challenge: bytes) -> dict[str, Any]:
    """Create a mock WebAuthn authentication credential response."""
    origin = get_settings(AuthSettings).rp_expected_origin
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    client_data = {
        "type": "webauthn.get",
        "challenge": bytes_to_base64url(challenge),
        "origin": origin,
        "crossOrigin": False,
    }
    client_data_json = b64encode(json.dumps(client_data).encode()).decode()

    rp_id_hash = b"0" * 32
    flags = b"\x01"
    sign_count = b"\x00\x00\x00\x01"
    auth_data = rp_id_hash + flags + sign_count

    mock_signature = base64.b64encode(b"mock_signature_data").decode()

    return {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "authenticatorData": base64.b64encode(auth_data).decode(),
            "clientDataJSON": client_data_json,
            "signature": mock_signature,
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }


async def test_request_sudo_mode_with_passkey_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that request_sudo_mode_with_passkey fails when user is not authenticated."""
    challenge = b"test-challenge-bytes-1234567890123456"
    authentication_response = create_mock_webauthn_authentication_response(challenge)

    response = await graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_request_sudo_mode_with_passkey_no_challenge(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that request_sudo_mode_with_passkey fails when WebAuthn challenge is not found."""
    challenge = b"test-challenge-bytes-1234567890123456"
    authentication_response = create_mock_webauthn_authentication_response(challenge)

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "WebAuthnChallengeNotFoundError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_invalid_credential_structure(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with invalid credential structure."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        password_auth_graphql_client
    )

    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_malformed_response(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with malformed authentication response."""
    await generate_reauthentication_options_for_test(password_auth_graphql_client)

    malformed_response = {
        "id": "some-id",
        "type": "public-key",
    }

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": malformed_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_empty_response(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with empty authentication response."""
    await generate_reauthentication_options_for_test(password_auth_graphql_client)

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": {},
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_missing_response_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with missing response fields."""
    await generate_reauthentication_options_for_test(password_auth_graphql_client)

    incomplete_response = {
        "id": "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s",
        "rawId": "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s",
        "response": {},
        "type": "public-key",
    }

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": incomplete_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_invalid_client_data_type(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with wrong client data type."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        password_auth_graphql_client
    )

    origin = get_settings(AuthSettings).rp_expected_origin
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    client_data = {
        "type": "webauthn.create",
        "challenge": bytes_to_base64url(challenge_bytes),
        "origin": origin,
        "crossOrigin": False,
    }
    client_data_json = b64encode(json.dumps(client_data).encode()).decode()

    auth_data = b"0" * 32 + b"\x01" + b"\x00\x00\x00\x01"
    mock_signature = base64.b64encode(b"mock_signature_data").decode()

    authentication_response = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "authenticatorData": base64.b64encode(auth_data).decode(),
            "clientDataJSON": client_data_json,
            "signature": mock_signature,
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_invalid_origin(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with invalid origin in client data."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        password_auth_graphql_client
    )
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    client_data = {
        "type": "webauthn.get",
        "challenge": bytes_to_base64url(challenge_bytes),
        "origin": "https://evil.com",
        "crossOrigin": False,
    }
    client_data_json = b64encode(json.dumps(client_data).encode()).decode()

    auth_data = b"0" * 32 + b"\x01" + b"\x00\x00\x00\x01"
    mock_signature = base64.b64encode(b"mock_signature_data").decode()

    authentication_response = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "authenticatorData": base64.b64encode(auth_data).decode(),
            "clientDataJSON": client_data_json,
            "signature": mock_signature,
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_request_sudo_mode_with_passkey_null_authentication_response(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with null authentication response."""
    await generate_reauthentication_options_for_test(password_auth_graphql_client)

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": None,
            "captchaToken": "captcha-token",
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_request_sudo_mode_with_passkey_invalid_base64_data(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with invalid base64 encoded data."""
    await generate_reauthentication_options_for_test(password_auth_graphql_client)
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    authentication_response = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "authenticatorData": "invalid-base64-data!@#$",
            "clientDataJSON": "invalid-base64-data!@#$",
            "signature": "invalid-base64-data!@#$",
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


@pytest.mark.parametrize(
    "wrong_type",
    [
        "wrong-type",
        "",
        None,
    ],
)
async def test_request_sudo_mode_with_passkey_invalid_credential_type(
    password_auth_graphql_client: GraphQLClient,
    wrong_type: str | None,
) -> None:
    """Test request_sudo_mode_with_passkey with invalid credential type."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        password_auth_graphql_client
    )
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )
    authentication_response["type"] = wrong_type

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


@pytest.mark.parametrize(
    "user_handle, description",
    [
        (None, "Null user handle"),
        ("", "Empty user handle"),
        ("user123", "Valid user handle"),
        ("invalid-base64!@#", "Invalid base64 user handle"),
    ],
)
async def test_request_sudo_mode_with_passkey_various_user_handle_values(
    password_auth_graphql_client: GraphQLClient,
    user_handle: str | None,
    description: str,
) -> None:
    """Test request_sudo_mode_with_passkey with various userHandle values."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        password_auth_graphql_client
    )
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )
    authentication_response["response"]["userHandle"] = user_handle

    response = await password_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }, f"Failed for case: {description}"


async def test_request_sudo_mode_with_passkey_with_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Test request_sudo_mode_with_passkey with an account that has a passkey."""
    challenge_bytes, _ = await generate_reauthentication_options_for_test(
        webauthn_auth_graphql_client
    )
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await webauthn_auth_graphql_client(
        REQUEST_SUDO_MODE_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestSudoModeWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }
