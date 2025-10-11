import base64
import json
import secrets
from base64 import b64encode
from typing import Any

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import (
    PasswordResetTokenRepo,
    WebAuthnCredentialRepo,
)
from app.config import AuthSettings, get_settings
from webauthn.helpers.base64url_to_bytes import base64url_to_bytes
from webauthn.helpers.bytes_to_base64url import bytes_to_base64url
from webauthn.helpers.structs import AuthenticatorTransport

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION = """
mutation Verify2FAPasswordResetWithPasskeyMutation(
    $email: String!
    $passwordResetToken: String!
    $authenticationResponse: JSON!
    $captchaToken: String!
) {
    verify2faPasswordResetWithPasskey(
        email: $email
        passwordResetToken: $passwordResetToken
        authenticationResponse: $authenticationResponse
        captchaToken: $captchaToken
    ) {
        __typename
        ... on PasswordResetToken {
            __typename
        }
        ... on InvalidPasswordResetTokenError {
            __typename
        }
        ... on InvalidPasskeyAuthenticationCredentialError {
            __typename
        }
        ... on TwoFactorAuthenticationNotEnabledError {
            __typename
        }
        ... on InvalidCaptchaTokenError {
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


@pytest.fixture(scope="function")
async def account_with_passkey(
    account_repo: AccountRepo,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> Account:
    """Create an account with a passkey enabled."""
    account = await account_repo.create(
        full_name="Test User",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password", "webauthn_credential"],
    )
    await webauthn_credential_repo.create(
        account_id=account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="Test Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )
    yield account
    await account_repo.delete(account)


async def generate_authentication_options_for_test(
    graphql_client: GraphQLClient,
) -> tuple[bytes, dict[str, Any]]:
    """Generate authentication options and return the challenge bytes and full options."""
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


async def test_verify_2fa_password_reset_with_passkey_no_challenge(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset without generating authentication options first."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge = b"test-challenge-bytes-1234567890123456"
    authentication_response = create_mock_webauthn_authentication_response(challenge)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "WebAuthnChallengeNotFoundError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_invalid_password_reset_token(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
) -> None:
    """Ensure that we cannot verify 2FA password reset with an invalid password reset token."""
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": "invalid-token",
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }


async def test_verify_2fa_password_reset_with_passkey_wrong_email(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with wrong email."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": generate_test_email(),
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_without_passkey_credential(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset when account has no passkey credential."""
    reset_token = await password_reset_token_repo.create(account=password_account)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": password_account.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_case_insensitive_email(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that email verification is case insensitive."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email.upper(),
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_invalid_credential(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with an invalid passkey credential."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_malformed_response(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with malformed authentication response."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    await generate_authentication_options_for_test(graphql_client)

    malformed_response = {
        "id": "some-id",
        "type": "public-key",
    }

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": malformed_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_empty_response(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with empty authentication response."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    await generate_authentication_options_for_test(graphql_client)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": {},
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_invalid_origin(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with invalid origin in client data."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
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

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_invalid_client_data_type(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with wrong client data type."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
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

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_invalid_base64_data(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with invalid base64 encoded data."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    await generate_authentication_options_for_test(graphql_client)
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

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


@pytest.mark.parametrize(
    "wrong_type",
    [
        "wrong-type",
        "",
        None,
    ],
)
async def test_verify_2fa_password_reset_with_passkey_invalid_credential_type(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
    wrong_type: str | None,
) -> None:
    """Ensure that we cannot verify 2FA password reset with invalid credential type."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    challenge_bytes, _ = await generate_authentication_options_for_test(graphql_client)
    authentication_response = create_mock_webauthn_authentication_response(
        challenge_bytes
    )
    authentication_response["type"] = wrong_type

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": authentication_response,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithPasskey": {
                "__typename": "InvalidPasskeyAuthenticationCredentialError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_passkey_null_authentication_response(
    graphql_client: GraphQLClient,
    account_with_passkey: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with null authentication response."""
    reset_token = await password_reset_token_repo.create(account=account_with_passkey)
    await generate_authentication_options_for_test(graphql_client)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_PASSKEY_MUTATION,
        variables={
            "email": account_with_passkey.email,
            "passwordResetToken": reset_token,
            "authenticationResponse": None,
            "captchaToken": "captcha-token",
        },
    )

    assert response["data"] is None
    assert "errors" in response
    assert len(response["errors"]) > 0

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_passkey.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)
