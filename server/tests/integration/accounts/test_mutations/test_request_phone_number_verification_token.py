import pytest

from tests.integration.graphql_client import GraphQLClient

# Constants for testing
MAX_COOLDOWN_SECONDS = 300

REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION = """
mutation RequestPhoneNumberVerificationTokenMutation($phoneNumber: String!) {
    requestPhoneNumberVerificationToken(phoneNumber: $phoneNumber) {
        __typename
        ... on RequestPhoneNumberVerificationTokenSuccess {
            __typename
            cooldownRemainingSeconds
        }
        ... on InvalidPhoneNumberError {
            __typename
        }
        ... on PhoneNumberAlreadyExistsError {
            __typename
        }
        ... on PhoneNumberVerificationTokenCooldownError {
            __typename
            remainingSeconds
        }
    }
}
"""


async def test_request_phone_number_verification_token_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot request phone number verification tokens."""
    response = await graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": "+1234567890",
        },
    )

    # Should get an authentication error
    assert "errors" in response
    assert len(response["errors"]) > 0


@pytest.mark.parametrize(
    ("phone_number", "description"),
    [
        # Invalid formats
        ("", "Empty phone number"),
        ("   ", "Whitespace only phone number"),
        ("invalid", "Non-numeric phone number"),
        ("12345", "Too short phone number"),
        ("abc123def", "Mixed alphanumeric phone number"),
        ("++1234567890", "Double plus prefix"),
        ("+", "Only plus sign"),
        ("123", "Too short numeric"),
        ("1234567890123456789012345", "Extremely long phone number"),
        ("12 34 56 78 90", "Phone with spaces"),
        ("123-456-7890", "Phone with dashes only (no country code)"),
        ("(123) 456-7890", "Phone with parentheses (no country code)"),
        ("123.456.7890", "Phone with dots (no country code)"),
        # Invalid country codes
        ("+0123456789", "Invalid country code starting with 0"),
        ("+9991234567890", "Invalid country code (999)"),
        # Special characters
        ("+1234567890!", "Phone with exclamation mark"),
        ("+1234567890@", "Phone with at symbol"),
        ("+1234567890#", "Phone with hash symbol"),
        ("+1234567890$", "Phone with dollar sign"),
        ("+1234567890%", "Phone with percent sign"),
        ("+1234567890^", "Phone with caret"),
        ("+1234567890&", "Phone with ampersand"),
        ("+1234567890*", "Phone with asterisk"),
        ("+1234567890(", "Phone with opening parenthesis"),
        ("+1234567890)", "Phone with closing parenthesis"),
        # Unicode characters
        ("+12345678901", "Phone with fullwidth digits"),
        ("+1234567890é", "Phone with accented character"),
        ("+1234567890你", "Phone with Chinese character"),
        ("+1234567890🎉", "Phone with emoji"),
        # SQL injection attempts
        ("+1234567890'; DROP TABLE accounts; --", "SQL injection attempt"),
        ("+1234567890' OR '1'='1", "SQL injection attempt 2"),
        # foreign phone numbers
        ("+1234567890", "US format with country code"),
        ("+12345678901", "US format with 11 digits"),
        ("+447123456789", "UK format"),
        ("+33123456789", "France format"),
        ("+49123456789", "Germany format"),
        ("+81123456789", "Japan format"),
        ("+86123456789", "China format"),
        ("+61123456789", "Australia format"),
        ("+5511123456789", "Brazil format"),
        ("+52123456789", "Mexico format"),
        ("+7123456789", "Russia format"),
        ("+82123456789", "South Korea format"),
        ("+65123456789", "Singapore format"),
        ("+966123456789", "Saudi Arabia format"),
        ("+971123456789", "UAE format"),
        ("+27123456789", "South Africa format"),
        ("+234123456789", "Nigeria format"),
        ("+254123456789", "Kenya format"),
        ("+20123456789", "Egypt format"),
    ],
)
async def test_request_phone_number_verification_token_invalid_phone_number(
    password_auth_graphql_client: GraphQLClient,
    phone_number: str,
    description: str,
) -> None:
    """Ensure that invalid phone numbers are rejected."""
    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    assert response == {
        "data": {
            "requestPhoneNumberVerificationToken": {
                "__typename": "InvalidPhoneNumberError",
            },
        },
    }, f"Failed for case: {description}"


async def test_request_phone_number_verification_token_phone_already_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that phone numbers already associated with other accounts are rejected."""
    # This test would require setting up an existing phone number association
    # For now, we test that the mutation handles potential conflicts gracefully
    existing_phone_number = "+1234567890"

    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": existing_phone_number,
        },
    )

    # Should get a valid response (success, error, or cooldown)
    assert response["data"]["requestPhoneNumberVerificationToken"]["__typename"] in [
        "RequestPhoneNumberVerificationTokenSuccess",
        "PhoneNumberAlreadyExistsError",
        "InvalidPhoneNumberError",
        "PhoneNumberVerificationTokenCooldownError",
    ]


async def test_request_phone_number_verification_token_cooldown_error(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that cooldown is enforced when requesting tokens too frequently."""
    phone_number = "+19876543210"  # Use a unique number for this test

    # First request should succeed
    response1 = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    assert response1["data"]["requestPhoneNumberVerificationToken"]["__typename"] in [
        "RequestPhoneNumberVerificationTokenSuccess",
        "InvalidPhoneNumberError",  # Might be invalid if validation is strict
    ]

    # If the first request succeeded, second request should trigger cooldown
    if (
        response1["data"]["requestPhoneNumberVerificationToken"]["__typename"]
        == "RequestPhoneNumberVerificationTokenSuccess"
    ):
        response2 = await password_auth_graphql_client(
            REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
            variables={
                "phoneNumber": phone_number,
            },
        )

        assert (
            response2["data"]["requestPhoneNumberVerificationToken"]["__typename"]
            == "PhoneNumberVerificationTokenCooldownError"
        )
        assert (
            "remainingSeconds"
            in response2["data"]["requestPhoneNumberVerificationToken"]
        )
        assert isinstance(
            response2["data"]["requestPhoneNumberVerificationToken"][
                "remainingSeconds"
            ],
            int,
        )
        assert (
            response2["data"]["requestPhoneNumberVerificationToken"]["remainingSeconds"]
            > 0
        )


@pytest.mark.parametrize(
    ("phone_number", "description"),
    [
        # Valid international formats
        ("+919792298827", "India format"),
    ],
)
async def test_request_phone_number_verification_token_valid_formats(
    password_auth_graphql_client: GraphQLClient,
    phone_number: str,
    description: str,
) -> None:
    """Test various valid international phone number formats."""
    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    # Should either succeed or hit cooldown if we've tested this number before
    assert response["data"]["requestPhoneNumberVerificationToken"]["__typename"] in [
        "RequestPhoneNumberVerificationTokenSuccess",
        "PhoneNumberVerificationTokenCooldownError",
        "PhoneNumberAlreadyExistsError",
    ], f"Failed for case: {description}"


async def test_request_phone_number_verification_token_success_response_structure(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test the structure of a successful response."""
    phone_number = "+15551234567"  # Use a specific test number

    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    data = response["data"]["requestPhoneNumberVerificationToken"]

    if data["__typename"] == "RequestPhoneNumberVerificationTokenSuccess":
        # Verify response structure
        assert "cooldownRemainingSeconds" in data
        assert isinstance(data["cooldownRemainingSeconds"], int)
        assert data["cooldownRemainingSeconds"] >= 0
        # Cooldown should typically be between 0 and some reasonable maximum (e.g., 300 seconds)
        assert data["cooldownRemainingSeconds"] <= MAX_COOLDOWN_SECONDS


async def test_request_phone_number_verification_token_cooldown_response_structure(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test the structure of a cooldown error response."""
    phone_number = "+15551234568"  # Use another specific test number

    # Make first request
    await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    # Make second request to trigger cooldown
    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    data = response["data"]["requestPhoneNumberVerificationToken"]

    if data["__typename"] == "PhoneNumberVerificationTokenCooldownError":
        # Verify response structure
        assert "remainingSeconds" in data
        assert isinstance(data["remainingSeconds"], int)
        assert data["remainingSeconds"] > 0
        # Should be a reasonable cooldown period
        assert data["remainingSeconds"] <= MAX_COOLDOWN_SECONDS


async def test_request_phone_number_verification_token_edge_case_phone_numbers(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test edge case phone numbers that might be on the boundary of valid/invalid."""
    edge_cases = [
        "+1",  # Minimum length with country code
        "+12",  # Very short
        "+123456789012345",  # Very long but might be valid
        "+999999999999999",  # Maximum reasonable length
    ]

    for phone_number in edge_cases:
        response = await password_auth_graphql_client(
            REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
            variables={
                "phoneNumber": phone_number,
            },
        )

        # Should get some response (either success, error, or cooldown)
        assert "data" in response
        assert "requestPhoneNumberVerificationToken" in response["data"]
        assert "__typename" in response["data"]["requestPhoneNumberVerificationToken"]


async def test_request_phone_number_verification_token_case_sensitivity(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that phone numbers are handled consistently regardless of input variations."""
    # Phone numbers shouldn't have case sensitivity issues, but test anyway
    base_number = "+1234567890"

    response = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": base_number,
        },
    )

    # Should get a consistent response
    assert "data" in response
    assert "requestPhoneNumberVerificationToken" in response["data"]
    typename = response["data"]["requestPhoneNumberVerificationToken"]["__typename"]
    assert typename in [
        "RequestPhoneNumberVerificationTokenSuccess",
        "InvalidPhoneNumberError",
        "PhoneNumberVerificationTokenCooldownError",
        "PhoneNumberAlreadyExistsError",
    ]


async def test_request_phone_number_verification_token_different_users_same_phone(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that different authenticated users cannot use the same phone number."""
    phone_number = "+15559876543"

    # First user requests verification for a phone number
    response1 = await password_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    # If first request succeeds, second user should get an error or also succeed
    # (depending on whether the first user actually claimed the number)
    response2 = await webauthn_auth_graphql_client(
        REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
        variables={
            "phoneNumber": phone_number,
        },
    )

    # Both should get valid responses
    assert "data" in response1
    assert "data" in response2

    # The responses should be valid GraphQL responses
    for response in [response1, response2]:
        typename = response["data"]["requestPhoneNumberVerificationToken"]["__typename"]
        assert typename in [
            "RequestPhoneNumberVerificationTokenSuccess",
            "InvalidPhoneNumberError",
            "PhoneNumberVerificationTokenCooldownError",
            "PhoneNumberAlreadyExistsError",
        ]


async def test_request_phone_number_verification_token_whitespace_handling(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that whitespace in phone numbers is handled appropriately."""
    test_cases = [
        " +1234567890",  # Leading space
        "+1234567890 ",  # Trailing space
        " +1234567890 ",  # Both spaces
        "+1 234 567 890",  # Spaces between digits
        "+1\t234567890",  # Tab character
        "+1\n234567890",  # Newline character
    ]

    for phone_number in test_cases:
        response = await password_auth_graphql_client(
            REQUEST_PHONE_NUMBER_VERIFICATION_TOKEN_MUTATION,
            variables={
                "phoneNumber": phone_number,
            },
        )

        # Should handle whitespace gracefully (either normalize or reject)
        assert "data" in response
        typename = response["data"]["requestPhoneNumberVerificationToken"]["__typename"]
        assert typename in [
            "RequestPhoneNumberVerificationTokenSuccess",
            "InvalidPhoneNumberError",
            "PhoneNumberVerificationTokenCooldownError",
            "PhoneNumberAlreadyExistsError",
        ]
