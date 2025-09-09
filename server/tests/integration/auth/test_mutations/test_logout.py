from tests.integration.graphql_client import GraphQLClient

LOGOUT_MUTATION = """
mutation LogoutMutation {
    logout {
        __typename
        message
    }
}
"""


async def test_logout_success_authenticated_user(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful logout for authenticated user."""
    response = await password_auth_graphql_client(
        LOGOUT_MUTATION,
    )

    assert response == {
        "data": {
            "logout": {
                "__typename": "LogoutPayload",
                "message": "Successfully logged out.",
            }
        }
    }


async def test_logout_success_webauthn_authenticated_user(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful logout for WebAuthn authenticated user."""
    response = await webauthn_auth_graphql_client(
        LOGOUT_MUTATION,
    )

    assert response == {
        "data": {
            "logout": {
                "__typename": "LogoutPayload",
                "message": "Successfully logged out.",
            }
        }
    }


async def test_logout_unauthenticated_user(
    graphql_client: GraphQLClient,
) -> None:
    """Test logout fails for unauthenticated user."""
    response = await graphql_client(
        LOGOUT_MUTATION,
    )

    # Should return permission error since IsAuthenticated permission is required
    assert "errors" in response
    assert len(response["errors"]) > 0
