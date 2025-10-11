import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.phone_numbers import generate_test_phonenumber

UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION = """
mutation UpdateAccountWhatsappJobAlertsMutation($enabled: Boolean!) {
    updateAccountWhatsappJobAlerts(enabled: $enabled) {
        __typename
        ... on Account {
            __typename
            id
            whatsappJobAlertsEnabled
        }
        ... on PhoneNumberMissingError {
            __typename
        }
    }
}
"""


async def test_update_account_whatsapp_job_alerts_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account_whatsapp_job_alerts fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": True},
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_account_whatsapp_job_alerts_enable_without_phone_number(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that enabling WhatsApp job alerts fails when account has no phone number."""
    # Ensure account has no phone number
    await account_repo.update(account=password_account, phone_number=None)

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": True},
    )

    assert response == {
        "data": {
            "updateAccountWhatsappJobAlerts": {
                "__typename": "PhoneNumberMissingError",
            },
        },
    }


async def test_update_account_whatsapp_job_alerts_enable_with_phone_number(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that enabling WhatsApp job alerts succeeds when account has a phone number."""
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=False,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": True},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        is True
    )

    # Verify the account was actually updated
    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled is True


async def test_update_account_whatsapp_job_alerts_disable_without_phone_number(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that disabling WhatsApp job alerts succeeds even without a phone number."""
    await account_repo.update(
        account=password_account,
        phone_number=None,
        whatsapp_job_alerts_enabled=False,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": False},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        is False
    )


async def test_update_account_whatsapp_job_alerts_disable_with_phone_number(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that disabling WhatsApp job alerts succeeds when account has a phone number."""
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=True,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": False},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        is False
    )

    # Verify the account was actually updated
    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled is False


async def test_update_account_whatsapp_job_alerts_toggle_enabled_to_disabled(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that toggling from enabled to disabled works correctly."""
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=True,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": False},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        is False
    )

    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled is False


async def test_update_account_whatsapp_job_alerts_toggle_disabled_to_enabled(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that toggling from disabled to enabled works correctly."""
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=False,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": True},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        is True
    )

    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled is True


@pytest.mark.parametrize(
    ("initial_state", "target_state"),
    [
        (True, True),
        (False, False),
    ],
)
async def test_update_account_whatsapp_job_alerts_idempotent(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
    initial_state: bool,
    target_state: bool,
) -> None:
    """Ensure that setting the same state multiple times is idempotent."""
    phone_number = generate_test_phonenumber()
    await account_repo.update(
        account=password_account,
        phone_number=phone_number,
        whatsapp_job_alerts_enabled=initial_state,
    )

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_WHATSAPP_JOB_ALERTS_MUTATION,
        variables={"enabled": target_state},
    )

    assert response["data"]["updateAccountWhatsappJobAlerts"]["__typename"] == "Account"
    assert (
        response["data"]["updateAccountWhatsappJobAlerts"]["whatsappJobAlertsEnabled"]
        == target_state
    )

    await password_account.sync()
    assert password_account.whatsapp_job_alerts_enabled == target_state
