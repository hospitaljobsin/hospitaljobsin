from datetime import UTC, datetime, timedelta

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import PhoneNumberVerificationTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.phone_numbers import generate_test_phonenumber

UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION = """
mutation UpdateAccountPhoneNumberMutation($phoneNumber: String!, $phoneNumberVerificationToken: String!) {
    updateAccountPhoneNumber(phoneNumber: $phoneNumber, phoneNumberVerificationToken: $phoneNumberVerificationToken) {
        __typename
        ... on Account {
            __typename
            id
            phoneNumber
        }
        ... on InvalidPhoneNumberVerificationTokenError {
            __typename
        }
        ... on InvalidPhoneNumberError {
            __typename
        }
    }
}
"""


async def test_update_account_phone_number_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account_phone_number fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": generate_test_phonenumber(),
            "phoneNumberVerificationToken": "123456",
        },
    )

    # Should return an authentication error
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_account_phone_number_missing_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account_phone_number fails when sudo mode is not enabled."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": generate_test_phonenumber(),
            "phoneNumberVerificationToken": "123456",
        },
    )

    # Should return a permission error for missing sudo mode
    assert "errors" in response
    assert any(
        "sudo" in error.get("message", "").lower()
        or "permission" in error.get("message", "").lower()
        for error in response["errors"]
    )


@pytest.mark.parametrize(
    ("phone_number", "description"),
    [
        # Invalid phone number formats (non-Indian numbers)
        (
            "+1234567890",
            "US phone number (not Indian)",
        ),
        (
            "+447123456789",
            "UK phone number (not Indian)",
        ),
        (
            "+33123456789",
            "French phone number (not Indian)",
        ),
        # Invalid phone number format - malformed
        (
            "invalid-phone",
            "Malformed phone number",
        ),
        # Invalid phone number format - empty
        (
            "",
            "Empty phone number",
        ),
        # Invalid phone number format - no country code
        (
            "2",
            "Phone number without country code",
        ),
    ],
)
async def test_update_account_phone_number_invalid_phone_numbers(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
    phone_number: str,
    description: str,
) -> None:
    """Ensure that update_account_phone_number fails with invalid phone numbers."""
    # Create a valid token for a valid Indian phone number
    valid_phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(
        phone_number=valid_phone_number
    )

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response == {
        "data": {
            "updateAccountPhoneNumber": {
                "__typename": "InvalidPhoneNumberError",
            },
        },
    }, f"Failed for case: {description}"


@pytest.mark.parametrize(
    ("phone_number_verification_token", "description"),
    [
        # Invalid phone number verification token
        (
            "invalid-token",
            "Invalid phone number verification token",
        ),
        # Non-existent token
        (
            "000000",
            "Non-existent verification token",
        ),
        # Random string token
        (
            "randomstring",
            "Random string token",
        ),
        # Empty token
        (
            "",
            "Empty verification token",
        ),
    ],
)
async def test_update_account_phone_number_invalid_verification_tokens(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token: str,
    description: str,
) -> None:
    """Ensure that update_account_phone_number fails with invalid verification tokens."""
    # Use a valid Indian phone number
    phone_number = generate_test_phonenumber()

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response == {
        "data": {
            "updateAccountPhoneNumber": {
                "__typename": "InvalidPhoneNumberVerificationTokenError",
            },
        },
    }, f"Failed for case: {description}"


async def test_update_account_phone_number_token_mismatch(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
) -> None:
    """Ensure that update_account_phone_number fails when token doesn't match phone number."""
    # Create token for one phone number
    token_phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(
        phone_number=token_phone_number
    )

    # Try to use it with a different phone number
    different_phone_number = generate_test_phonenumber()

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": different_phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response == {
        "data": {
            "updateAccountPhoneNumber": {
                "__typename": "InvalidPhoneNumberVerificationTokenError",
            },
        },
    }


async def test_update_account_phone_number_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
) -> None:
    """Ensure that update_account_phone_number succeeds with valid inputs."""
    # Create a valid phone number verification token for an Indian number
    phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(phone_number=phone_number)

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["updateAccountPhoneNumber"]["phoneNumber"] == phone_number
    assert "id" in response["data"]["updateAccountPhoneNumber"]


async def test_update_account_phone_number_successful_different_format(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
) -> None:
    """Ensure that update_account_phone_number works with different valid Indian phone formats."""
    # Test with another valid Indian phone number format
    phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(phone_number=phone_number)

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["updateAccountPhoneNumber"]["phoneNumber"] == phone_number
    assert "id" in response["data"]["updateAccountPhoneNumber"]


async def test_update_account_phone_number_updates_account(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
    password_account: Account,
) -> None:
    """Ensure that update_account_phone_number actually updates the account's phone number."""
    # Store original phone number
    original_phone_number = password_account.phone_number

    # Create a valid phone number verification token
    new_phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(phone_number=new_phone_number)

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": new_phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountPhoneNumber"]["phoneNumber"] == new_phone_number
    )

    # Verify the account was actually updated by refreshing from database
    await password_account.sync()
    assert password_account.phone_number == new_phone_number
    assert password_account.phone_number != original_phone_number


@pytest.mark.parametrize(
    ("phone_number", "description"),
    [
        ("+919876543211", "Standard Indian mobile number"),
        ("+919123456788", "Another Indian mobile number"),
        ("+919988776655", "Different Indian mobile number"),
    ],
)
async def test_update_account_phone_number_valid_indian_numbers(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
    phone_number: str,
    description: str,
) -> None:
    """Test various valid Indian phone number formats."""
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(phone_number=phone_number)

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountPhoneNumber"]["phoneNumber"] == phone_number
    ), f"Failed for case: {description}"


async def test_update_account_phone_number_expired_token(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
) -> None:
    """Ensure that update_account_phone_number fails with expired token."""
    # Create a token and then manually expire it
    phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        token_doc,
    ) = await phone_number_verification_token_repo.create(phone_number=phone_number)

    # Manually expire the token by setting expires_at to past
    token_doc.expires_at = datetime.now(UTC) - timedelta(hours=1)
    await token_doc.save()

    response = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    # The service should handle expired tokens by not finding them
    assert response == {
        "data": {
            "updateAccountPhoneNumber": {
                "__typename": "InvalidPhoneNumberVerificationTokenError",
            },
        },
    }


async def test_update_account_phone_number_token_used_twice(
    password_auth_sudo_graphql_client: GraphQLClient,
    phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
) -> None:
    """Ensure that a verification token works and updates account correctly on first use."""
    phone_number = generate_test_phonenumber()
    (
        phone_number_verification_token,
        _,
    ) = await phone_number_verification_token_repo.create(phone_number=phone_number)

    # First use should succeed
    response1 = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    assert response1["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
    assert response1["data"]["updateAccountPhoneNumber"]["phoneNumber"] == phone_number

    # Second use of same token should fail (token should still exist but account should have updated phone)
    response2 = await password_auth_sudo_graphql_client(
        UPDATE_ACCOUNT_PHONE_NUMBER_MUTATION,
        variables={
            "phoneNumber": phone_number,
            "phoneNumberVerificationToken": phone_number_verification_token,
        },
    )

    # Should still work since the token exists and matches the phone number
    assert response2["data"]["updateAccountPhoneNumber"]["__typename"] == "Account"
