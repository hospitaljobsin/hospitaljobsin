import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.phone_numbers import generate_test_phonenumber

REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION = """
mutation RemoveAccountPhoneNumberMutation {
    removeAccountPhoneNumber {
        __typename
        ... on Account {
            __typename
            id
            phoneNumber
            whatsappJobAlertsEnabled
        }
        ... on PhoneNumberDoesNotExistError {
            __typename
        }
    }
}
"""


async def test_remove_account_phone_number_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_account_phone_number fails when user is not authenticated."""
    response = await graphql_client(REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION)

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_remove_account_phone_number_missing_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_account_phone_number fails when sudo mode is not enabled."""
    response = await password_auth_graphql_client(REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION)

    assert "errors" in response
    assert any(
        "sudo" in error.get("message", "").lower()
        or "permission" in error.get("message", "").lower()
        for error in response["errors"]
    )


async def test_remove_account_phone_number_no_phone_number(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_account_phone_number fails when account has no phone number."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )

    assert response == {
        "data": {
            "removeAccountPhoneNumber": {
                "__typename": "PhoneNumberDoesNotExistError",
            },
        },
    }


async def test_remove_account_phone_number_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_phone_number succeeds when account has a phone number."""
    # Set up account with phone number
    phone_number = generate_test_phonenumber()
    await account_repo.update(account=password_account, phone_number=phone_number)

    response = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )

    assert response["data"]["removeAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["removeAccountPhoneNumber"]["phoneNumber"] is None
    assert "id" in response["data"]["removeAccountPhoneNumber"]


async def test_remove_account_phone_number_updates_account(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_phone_number actually removes the phone number from account."""
    # Set up account with phone number
    phone_number = generate_test_phonenumber()
    await account_repo.update(account=password_account, phone_number=phone_number)
    await password_account.sync()
    assert password_account.phone_number == phone_number

    response = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )

    assert response["data"]["removeAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["removeAccountPhoneNumber"]["phoneNumber"] is None

    # Verify the account was actually updated by refreshing from database
    await password_account.sync()
    assert password_account.phone_number is None


async def test_remove_account_phone_number_disables_whatsapp_alerts(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_phone_number disables WhatsApp job alerts."""
    # Set up account with phone number and WhatsApp alerts enabled
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=True,
    )
    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled is True

    response = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )

    assert response["data"]["removeAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["removeAccountPhoneNumber"]["phoneNumber"] is None
    assert (
        response["data"]["removeAccountPhoneNumber"]["whatsappJobAlertsEnabled"]
        is False
    )

    # Verify the account was actually updated
    await password_account.sync()
    assert password_account.phone_number is None
    assert password_account.whatsapp_job_alerts_enabled is False


async def test_remove_account_phone_number_idempotent(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that calling remove_account_phone_number twice fails on second call."""
    # Set up account with phone number
    phone_number = generate_test_phonenumber()
    await account_repo.update(account=password_account, phone_number=phone_number)

    # First call should succeed
    response1 = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )
    assert response1["data"]["removeAccountPhoneNumber"]["__typename"] == "Account"
    assert response1["data"]["removeAccountPhoneNumber"]["phoneNumber"] is None

    # Second call should fail with PhoneNumberDoesNotExistError
    response2 = await password_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )
    assert response2 == {
        "data": {
            "removeAccountPhoneNumber": {
                "__typename": "PhoneNumberDoesNotExistError",
            },
        },
    }


async def test_remove_account_phone_number_webauthn_account(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    webauthn_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_phone_number works for webauthn-only accounts."""
    # Set up webauthn account with phone number
    phone_number = generate_test_phonenumber()
    await account_repo.update(account=webauthn_account, phone_number=phone_number)

    response = await webauthn_auth_sudo_graphql_client(
        REMOVE_ACCOUNT_PHONE_NUMBER_MUTATION
    )

    assert response["data"]["removeAccountPhoneNumber"]["__typename"] == "Account"
    assert response["data"]["removeAccountPhoneNumber"]["phoneNumber"] is None

    # Verify the account was actually updated
    await webauthn_account.sync()
    assert webauthn_account.phone_number is None
