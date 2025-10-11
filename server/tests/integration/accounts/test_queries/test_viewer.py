from app.accounts.documents import Account
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient

VIEWER_QUERY = """
query ViewerQuery {
    viewer {
        __typename
        ... on Account {
            id
            fullName
            email
            avatarUrl
            phoneNumber
            authProviders
            twoFactorProviders
            has2faEnabled
            whatsappJobAlertsEnabled
            termsAndPolicy {
                type
                updatedAt
                isLatest
            }
            analyticsPreference {
                type
                updatedAt
            }
        }
        ... on NotAuthenticatedError {
            message
        }
    }
}
"""


async def test_viewer_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that viewer returns NotAuthenticatedError when user is not authenticated."""
    response = await graphql_client(VIEWER_QUERY)

    assert response["data"]["viewer"]["__typename"] == "NotAuthenticatedError"
    assert "message" in response["data"]["viewer"]


async def test_viewer_password_authenticated(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that viewer returns Account when user is authenticated with password."""
    response = await password_auth_graphql_client(VIEWER_QUERY)

    assert response["data"]["viewer"]["__typename"] == "Account"
    assert response["data"]["viewer"]["id"] == relay.to_base64(
        "Account", password_account.id
    )
    assert response["data"]["viewer"]["fullName"] == password_account.full_name
    assert response["data"]["viewer"]["email"] == password_account.email


async def test_viewer_webauthn_authenticated(
    webauthn_auth_graphql_client: GraphQLClient,
    webauthn_account: Account,
) -> None:
    """Ensure that viewer returns Account when user is authenticated with webauthn."""
    response = await webauthn_auth_graphql_client(VIEWER_QUERY)

    assert response["data"]["viewer"]["__typename"] == "Account"
    assert response["data"]["viewer"]["id"] == relay.to_base64(
        "Account", webauthn_account.id
    )
    assert response["data"]["viewer"]["fullName"] == webauthn_account.full_name
    assert response["data"]["viewer"]["email"] == webauthn_account.email


async def test_viewer_returns_all_fields(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that viewer returns all expected fields."""
    response = await password_auth_graphql_client(VIEWER_QUERY)

    viewer = response["data"]["viewer"]
    assert viewer["__typename"] == "Account"
    assert "id" in viewer
    assert "fullName" in viewer
    assert "email" in viewer
    assert "avatarUrl" in viewer
    assert "phoneNumber" in viewer
    assert "authProviders" in viewer
    assert "twoFactorProviders" in viewer
    assert "has2faEnabled" in viewer
    assert "whatsappJobAlertsEnabled" in viewer
    assert "termsAndPolicy" in viewer
    assert "analyticsPreference" in viewer


async def test_viewer_auth_providers(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that viewer returns correct auth providers."""
    response = await password_auth_graphql_client(VIEWER_QUERY)

    assert response["data"]["viewer"]["__typename"] == "Account"
    assert "PASSWORD" in response["data"]["viewer"]["authProviders"]


async def test_viewer_terms_and_policy(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that viewer returns terms and policy information."""
    response = await password_auth_graphql_client(VIEWER_QUERY)

    viewer = response["data"]["viewer"]
    assert viewer["__typename"] == "Account"
    assert "termsAndPolicy" in viewer
    assert "type" in viewer["termsAndPolicy"]
    assert "updatedAt" in viewer["termsAndPolicy"]
    assert "isLatest" in viewer["termsAndPolicy"]


async def test_viewer_analytics_preference(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that viewer returns analytics preference information."""
    response = await password_auth_graphql_client(VIEWER_QUERY)

    viewer = response["data"]["viewer"]
    assert viewer["__typename"] == "Account"
    assert "analyticsPreference" in viewer
    assert "type" in viewer["analyticsPreference"]
    assert "updatedAt" in viewer["analyticsPreference"]


async def test_viewer_different_accounts(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    foreign_password_account: Account,
) -> None:
    """Ensure that viewer returns correct account for different authenticated users."""
    response1 = await password_auth_graphql_client(VIEWER_QUERY)
    response2 = await foreign_password_auth_graphql_client(VIEWER_QUERY)

    assert response1["data"]["viewer"]["__typename"] == "Account"
    assert response2["data"]["viewer"]["__typename"] == "Account"
    assert response1["data"]["viewer"]["id"] == relay.to_base64(
        "Account", password_account.id
    )
    assert response2["data"]["viewer"]["id"] == relay.to_base64(
        "Account", foreign_password_account.id
    )
    assert response1["data"]["viewer"]["id"] != response2["data"]["viewer"]["id"]
