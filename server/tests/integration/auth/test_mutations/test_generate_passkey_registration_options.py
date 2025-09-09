import json

import pytest
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

GENERATE_PASSKEY_REGISTRATION_OPTIONS_MUTATION = """
mutation GeneratePasskeyRegistrationOptionsMutation($email: String!, $fullName: String!, $captchaToken: String!) {
    generatePasskeyRegistrationOptions(email: $email, fullName: $fullName, captchaToken: $captchaToken) {
        __typename
        ... on GeneratePasskeyRegistrationOptionsSuccess {
            __typename
            registrationOptions
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
        ... on EmailInUseError {
            __typename
        }
    }
}
"""


@pytest.mark.parametrize(
    ("full_name", "captcha_token", "expected_typename", "description"),
    [
        # Email already in use
        (
            "Test User",
            "captcha-token",
            "EmailInUseError",
            "Email already in use",
        ),
        (
            "Test User",
            "captcha-token",
            "EmailInUseError",
            "Email already in use (case insensitive)",
        ),
    ],
)
async def test_generate_passkey_registration_options_invalid(
    graphql_client: GraphQLClient,
    password_account: Account,
    full_name: str,
    captcha_token: str,
    expected_typename: str,
    description: str,
) -> None:
    """Ensure that generate_passkey_registration_options fails with invalid inputs."""
    # Use the email from the fixture for the first test case (exact match)
    # For the second test case, convert to uppercase for case insensitive testing
    email = password_account.email
    if "case insensitive" in description:
        email = email.upper()

    response = await graphql_client(
        GENERATE_PASSKEY_REGISTRATION_OPTIONS_MUTATION,
        variables={
            "email": email,
            "fullName": full_name,
            "captchaToken": captcha_token,
        },
    )

    assert response == {
        "data": {
            "generatePasskeyRegistrationOptions": {
                "__typename": expected_typename,
            },
        },
    }, f"Failed for case: {description}"


async def test_generate_passkey_registration_options_successful(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_passkey_registration_options succeeds with valid inputs."""
    # Use a unique email address for this test to avoid conflicts
    email = generate_test_email()
    full_name = "Test User"

    response = await graphql_client(
        GENERATE_PASSKEY_REGISTRATION_OPTIONS_MUTATION,
        variables={
            "email": email,
            "fullName": full_name,
            "captchaToken": "captcha-token",
        },
    )

    # Check the response structure
    data = response["data"]["generatePasskeyRegistrationOptions"]
    assert data["__typename"] == "GeneratePasskeyRegistrationOptionsSuccess"
    assert "registrationOptions" in data  # registrationOptions should be present

    # Additional assertions for registrationOptions
    registration_options = data["registrationOptions"]
    assert isinstance(registration_options, str), (
        "registrationOptions should be a string"
    )
    assert len(registration_options) > 0, "registrationOptions should not be empty"

    # Parse the JSON string to verify it's valid JSON
    parsed_options = json.loads(registration_options)
    assert isinstance(parsed_options, dict), (
        "registrationOptions should be a valid JSON object"
    )

    # Verify expected WebAuthn registration options structure
    assert "challenge" in parsed_options, (
        "registrationOptions should contain a challenge"
    )
    assert "rp" in parsed_options, (
        "registrationOptions should contain relying party info"
    )
    assert "user" in parsed_options, "registrationOptions should contain user info"
    assert "pubKeyCredParams" in parsed_options, (
        "registrationOptions should contain public key credential parameters"
    )

    # Verify user info matches input
    user_info = parsed_options["user"]
    assert user_info["name"] == email, "User name should match the provided email"
    assert user_info["displayName"] == full_name, (
        "User display name should match the provided full name"
    )
    assert "id" in user_info, "User should have an ID"
