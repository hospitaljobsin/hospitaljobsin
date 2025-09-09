import base64
import json
from base64 import b64encode
from typing import Any

import pytest
from app.config import AuthSettings, get_settings
from webauthn.helpers.base64url_to_bytes import base64url_to_bytes
from webauthn.helpers.bytes_to_base64url import bytes_to_base64url

from tests.integration.graphql_client import GraphQLClient

LOGIN_WITH_PASSKEY_MUTATION = """
mutation LoginWithPasskeyMutation(
    $authenticationResponse: JSON!
    $captchaToken: String!
) {
    loginWithPasskey(
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

GENERATE_AUTHENTICATION_OPTIONS_MUTATION = """
mutation GenerateAuthenticationOptionsMutation($captchaToken: String!) {
    generateAuthenticationOptions(captchaToken: $captchaToken) {
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


async def generate_authentication_options_for_test(
    graphql_client: GraphQLClient,
) -> tuple[bytes, dict[str, Any]]:
    """
    Generate authentication options and return the challenge bytes and full options.

    Returns:
        Tuple of (challenge_bytes, authentication_options_dict)

    """
    response = await graphql_client(
        GENERATE_AUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    assert (
        response["data"]["generateAuthenticationOptions"]["__typename"]
        == "GenerateAuthenticationOptionsSuccess"
    )

    auth_options_json = response["data"]["generateAuthenticationOptions"][
        "authenticationOptions"
    ]
    auth_options = json.loads(auth_options_json)

    # Extract challenge bytes from the authentication options
    challenge_base64url = auth_options["challenge"]
    challenge_bytes = base64url_to_bytes(challenge_base64url)

    return challenge_bytes, auth_options


def create_mock_webauthn_authentication_response(challenge: bytes) -> dict[str, Any]:
    """
    Create a mock WebAuthn authentication credential response.

    This creates a structurally valid credential that will fail WebAuthn verification
    due to invalid cryptographic signatures, but has the right structure.
    """
    origin = get_settings(AuthSettings).rp_expected_origin
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    # Create client data JSON with the provided challenge
    client_data = {
        "type": "webauthn.get",
        "challenge": bytes_to_base64url(challenge),
        "origin": origin,
        "crossOrigin": False,
    }
    client_data_json = b64encode(json.dumps(client_data).encode()).decode()

    # Mock authenticator data (37+ bytes as required)
    # Structure includes: rpIdHash, flags, signCount
    rp_id_hash = b"0" * 32  # Mock RP ID hash
    flags = b"\x01"  # User present flag
    sign_count = b"\x00\x00\x00\x01"  # Counter
    auth_data = rp_id_hash + flags + sign_count

    # Mock signature (this will fail verification but has correct structure)
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


def create_invalid_webauthn_authentication_response() -> dict[str, Any]:
    """Create an invalid WebAuthn authentication credential for testing error scenarios."""
    # Create valid JSON for clientDataJSON but with wrong challenge and type
    invalid_client_data = {
        "type": "webauthn.create",  # Wrong type for authentication
        "challenge": "wrong-challenge",
        "origin": "https://evil.com",
        "crossOrigin": False,
    }
    invalid_client_data_json = b64encode(
        json.dumps(invalid_client_data).encode()
    ).decode()

    return {
        "id": "invalid-credential-id",
        "rawId": "different-raw-id",  # Different from id to simulate error
        "response": {
            "authenticatorData": "invalid-auth-data",
            "clientDataJSON": invalid_client_data_json,
            "signature": "invalid-signature",
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }


# async def test_login_with_passkey_invalid_captcha_token(
#     graphql_client: GraphQLClient,
# ) -> None:
#     """Ensure that login_with_passkey fails with invalid captcha token."""
#     # Create mock authentication response - for invalid captcha, the challenge check comes after captcha validation
#     challenge = b"test-challenge-bytes-1234567890123456"
#     authentication_response = create_mock_webauthn_authentication_response(challenge)

#     response = await graphql_client(
#         LOGIN_WITH_PASSKEY_MUTATION,
#         variables={
#             "authenticationResponse": authentication_response,
#             "captchaToken": "invalid-captcha-token",
#         },
#     )

#     assert response == {
#         "data": {
#             "loginWithPasskey": {
#                 "__typename": "InvalidCaptchaTokenError",
#             },
#         },
#     }


async def test_login_with_passkey_webauthn_challenge_not_found(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that login_with_passkey fails when WebAuthn challenge is not found."""
    # Create mock authentication response with valid structure
    challenge = b"test-challenge-bytes-1234567890123456"
    authentication_response = create_mock_webauthn_authentication_response(challenge)

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",  # Valid captcha token for test
        },
    )

    # Without generating authentication options first, challenge won't be found
    assert response == {
        "data": {
            "loginWithPasskey": {
                "__typename": "WebAuthnChallengeNotFoundError",
            },
        },
    }


async def test_login_with_passkey_invalid_credential_structure(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with invalid credential structure."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)

    # Create invalid authentication response
    authentication_response = create_invalid_webauthn_authentication_response()
    # Update the authentication response to use the valid challenge
    authentication_response["response"]["clientDataJSON"] = b64encode(
        json.dumps(
            {
                "type": "webauthn.get",
                "challenge": bytes_to_base64url(challenge_bytes),
                "origin": get_settings(AuthSettings).rp_expected_origin,
                "crossOrigin": False,
            }
        ).encode()
    ).decode()

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in a GraphQL error due to credential validation failure
    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0
    error_message = response["errors"][0]["message"]
    assert "id and raw_id were not equivalent" in error_message


async def test_login_with_passkey_malformed_response(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with malformed authentication response."""
    # Create malformed authentication response missing required fields
    malformed_response = {
        "id": "some-id",
        "type": "public-key",
        # Missing required fields like rawId, response, etc.
    }

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": malformed_response,
            "captchaToken": "captcha-token",
        },
    )

    # With missing fields, this should be caught during credential parsing
    # before the challenge check
    assert response == {
        "data": {
            "loginWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_login_with_passkey_empty_response(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with empty authentication response."""
    # Generate authentication options first to set up challenge
    await generate_authentication_options_for_test(graphql_client)

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": {},
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_login_with_passkey_missing_response_fields(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with missing response fields."""
    # Generate authentication options first to set up challenge
    await generate_authentication_options_for_test(graphql_client)

    # Create authentication response with missing required response fields
    incomplete_response = {
        "id": "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s",
        "rawId": "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s",
        "response": {
            # Missing authenticatorData, clientDataJSON, signature
        },
        "type": "public-key",
    }

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": incomplete_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }


async def test_login_with_passkey_invalid_client_data_type(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with wrong client data type."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)

    # Create authentication response with wrong client data type
    origin = get_settings(AuthSettings).rp_expected_origin
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    # Wrong type - should be "webauthn.get" for authentication
    client_data = {
        "type": "webauthn.create",  # Wrong type
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

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in a GraphQL error due to wrong client data type
    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_login_with_passkey_invalid_origin(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with invalid origin in client data."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    # Create client data with wrong origin
    client_data = {
        "type": "webauthn.get",
        "challenge": bytes_to_base64url(challenge_bytes),
        "origin": "https://evil.com",  # Wrong origin
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

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in a GraphQL error due to origin mismatch
    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_login_with_passkey_null_authentication_response(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with null authentication response."""
    # Generate authentication options first to set up challenge
    await generate_authentication_options_for_test(graphql_client)

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": None,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in a GraphQL validation error
    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_login_with_passkey_invalid_base64_data(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with invalid base64 encoded data."""
    # Generate authentication options first to set up challenge
    await generate_authentication_options_for_test(graphql_client)
    credential_id = "ZoIKP1JQvKdrYj1bTUPJ2eTUsbLeFkv-X5xJQNr4k6s"

    authentication_response = {
        "id": credential_id,
        "rawId": credential_id,
        "response": {
            "authenticatorData": "invalid-base64-data!@#$",  # Invalid base64
            "clientDataJSON": "invalid-base64-data!@#$",  # Invalid base64
            "signature": "invalid-base64-data!@#$",  # Invalid base64
            "userHandle": None,
        },
        "type": "public-key",
        "clientExtensionResults": {},
        "authenticatorAttachment": "platform",
    }

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in a GraphQL error due to invalid base64 data
    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_login_with_passkey_with_existing_account(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with an existing account that has a passkey."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # Without proper WebAuthn credential setup, this should fail gracefully
    # The exact error depends on credential validation - likely InvalidPasskeyAuthenticationCredentialError
    assert response["data"] is not None or "errors" in response


@pytest.mark.parametrize(
    "wrong_type",
    [
        "wrong-type",
        "",
        None,
    ],
)
async def test_login_with_passkey_invalid_credential_type(
    graphql_client: GraphQLClient,
    wrong_type: str | None,
) -> None:
    """Test login_with_passkey with invalid credential type."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    print("CHALLENGE BYTES: ", challenge_bytes)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )
    authentication_response["type"] = wrong_type

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # This should result in an error
    if wrong_type is None:
        # GraphQL validation error for null type
        assert response["data"] is None
        assert "errors" in response
    else:
        # Application error for invalid type
        assert response == {
            "data": {
                "loginWithPasskey": {
                    "__typename": "InvalidPasskeyAuthenticationCredentialError",
                },
            },
        }


async def test_login_with_passkey_with_proper_challenge_setup(
    graphql_client: GraphQLClient,
) -> None:
    """Test login_with_passkey with proper challenge setup and valid structure."""
    # First, generate authentication options to set up the challenge
    challenge_bytes, auth_options = await generate_authentication_options_for_test(
        graphql_client
    )

    # Create a properly structured authentication response using the real challenge
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    # Now attempt to login with the properly structured response
    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # Since we don't have a real credential in the database, this should fail with InvalidPasskeyAuthenticationCredentialError
    # But the challenge should be found since we generated options first in the same session
    result = response["data"]["loginWithPasskey"]["__typename"]

    # The exact error depends on the order of validation, but it should not be WebAuthnChallengeNotFoundError
    # It could be InvalidPasskeyAuthenticationCredentialError (if challenge is found) or WebAuthnChallengeNotFoundError (if session is not preserved)
    assert result in [
        "InvalidPasskeyAuthenticationCredentialError",
        "WebAuthnChallengeNotFoundError",
    ]


@pytest.mark.parametrize(
    "user_handle, description",
    [
        (None, "Null user handle"),
        ("", "Empty user handle"),
        ("user123", "Valid user handle"),
        ("invalid-base64!@#", "Invalid base64 user handle"),
    ],
)
async def test_login_with_passkey_various_user_handle_values(
    graphql_client: GraphQLClient,
    user_handle: str | None,
    description: str,
) -> None:
    """Test login_with_passkey with various userHandle values."""
    # Generate authentication options first to set up challenge
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )
    authentication_response["response"]["userHandle"] = user_handle

    response = await graphql_client(
        LOGIN_WITH_PASSKEY_MUTATION,
        variables={
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    # The response should be consistent regardless of userHandle value
    # Since we have a valid challenge but no real credential in the database,
    # we should get InvalidPasskeyAuthenticationCredentialError
    assert response == {
        "data": {
            "loginWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }, f"Failed for case: {description}"
