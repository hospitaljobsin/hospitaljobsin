import pytest
from app.accounts.documents import Account
from httpx import AsyncClient

from tests.integration.graphql_client import GraphQLClient

UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION = """
mutation UpdateAccountAnalyticsPreference($analyticsPreference: AnalyticsPreferenceInputType!) {
    updateAccountAnalyticsPreference(analyticsPreference: $analyticsPreference) {
        __typename
        ... on Account {
            id
            analyticsPreference {
                type
                updatedAt
            }
        }
    }
}
"""


async def test_update_analytics_preference_acceptance_authenticated(
    password_auth_graphql_client: GraphQLClient,
    password_auth_http_client: AsyncClient,
) -> None:
    """Ensure authenticated user can set analytics preference to acceptance."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "ACCEPTANCE"},
    )

    assert (
        response["data"]["updateAccountAnalyticsPreference"]["__typename"] == "Account"
    )
    assert (
        response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "ACCEPTANCE"
    )
    assert (
        "updatedAt"
        in response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"]
    )

    # Verify cookie is set
    cookies = password_auth_http_client.cookies
    assert "analytics_preference" in cookies
    assert cookies["analytics_preference"] == "yes"


async def test_update_analytics_preference_rejection_authenticated(
    password_auth_graphql_client: GraphQLClient,
    password_auth_http_client: AsyncClient,
) -> None:
    """Ensure authenticated user can set analytics preference to rejection."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )

    assert (
        response["data"]["updateAccountAnalyticsPreference"]["__typename"] == "Account"
    )
    assert (
        response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "REJECTION"
    )

    # Verify cookie is set
    cookies = password_auth_http_client.cookies
    assert "analytics_preference" in cookies
    assert cookies["analytics_preference"] == "no"


async def test_update_analytics_preference_unauthenticated(
    graphql_client: GraphQLClient,
    http_client: AsyncClient,
) -> None:
    """Ensure unauthenticated user can set analytics preference via cookie only."""
    response = await graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "ACCEPTANCE"},
    )

    # Should return null for unauthenticated users but still set cookie
    assert response["data"]["updateAccountAnalyticsPreference"] is None

    # Verify cookie is set even for unauthenticated users
    cookies = http_client.cookies
    assert "analytics_preference" in cookies
    assert cookies["analytics_preference"] == "yes"


async def test_update_analytics_preference_persists_changes(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure analytics preference changes persist to database."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )

    assert (
        response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "REJECTION"
    )

    # Verify the account was actually updated
    await password_account.sync()
    assert password_account.analytics_preference.type == "rejection"


async def test_update_analytics_preference_multiple_times(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure analytics preference can be updated multiple times."""
    # First update to acceptance
    response1 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "ACCEPTANCE"},
    )
    assert (
        response1["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "ACCEPTANCE"
    )

    # Then update to rejection
    response2 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )
    assert (
        response2["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "REJECTION"
    )

    # Verify final state
    await password_account.sync()
    assert password_account.analytics_preference.type == "rejection"


async def test_update_analytics_preference_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
    webauthn_account: Account,
) -> None:
    """Ensure webauthn accounts can update analytics preference."""
    response = await webauthn_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )

    assert (
        response["data"]["updateAccountAnalyticsPreference"]["__typename"] == "Account"
    )
    assert (
        response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == "REJECTION"
    )

    await webauthn_account.sync()
    assert webauthn_account.analytics_preference.type == "rejection"


async def test_update_analytics_preference_does_not_affect_other_accounts(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Ensure updating one account's preference doesn't affect other accounts."""
    original_preference = foreign_password_account.analytics_preference.type

    # Update the authenticated account
    await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )

    # Verify the foreign account was not affected
    await foreign_password_account.sync()
    assert foreign_password_account.analytics_preference.type == original_preference


async def test_update_analytics_preference_updates_timestamp(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure updating analytics preference updates the timestamp."""
    original_updated_at = password_account.analytics_preference.updated_at

    # Update preference
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "REJECTION"},
    )

    assert (
        "updatedAt"
        in response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"]
    )

    # Verify timestamp was updated
    await password_account.sync()
    assert password_account.analytics_preference.updated_at > original_updated_at


@pytest.mark.parametrize(
    "preference_value",
    ["ACCEPTANCE", "REJECTION"],
)
async def test_update_analytics_preference_valid_values(
    password_auth_graphql_client: GraphQLClient,
    preference_value: str,
) -> None:
    """Test both valid analytics preference values."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": preference_value},
    )

    assert (
        response["data"]["updateAccountAnalyticsPreference"]["__typename"] == "Account"
    )
    assert (
        response["data"]["updateAccountAnalyticsPreference"]["analyticsPreference"][
            "type"
        ]
        == preference_value
    )


async def test_update_analytics_preference_cookie_attributes(
    password_auth_graphql_client: GraphQLClient,
    password_auth_http_client: AsyncClient,
) -> None:
    """Ensure analytics preference cookie has correct attributes."""
    await password_auth_graphql_client(
        UPDATE_ACCOUNT_ANALYTICS_PREFERENCE_MUTATION,
        variables={"analyticsPreference": "ACCEPTANCE"},
    )

    cookies = password_auth_http_client.cookies
    assert "analytics_preference" in cookies

    # Cookie should be accessible (not httponly for client-side access)
    cookie = cookies.get("analytics_preference")
    assert cookie == "yes"
