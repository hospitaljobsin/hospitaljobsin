import json

from tests.integration.graphql_client import GraphQLClient

GENERATE_REAUTHENTICATION_OPTIONS_MUTATION = """
mutation GenerateReauthenticationOptionsMutation($captchaToken: String!) {
    generateReauthenticationOptions(captchaToken: $captchaToken) {
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


# @pytest.mark.parametrize(
#     ("captcha_token", "expected_typename", "description"),
#     [
#         (
#             "invalid-captcha",
#             "InvalidCaptchaTokenError",
#             "Invalid captcha token",
#         ),
#     ],
# )
# async def test_generate_reauthentication_options_invalid(
#     password_auth_graphql_client: GraphQLClient,
#     captcha_token: str,
#     expected_typename: str,
#     description: str,
# ) -> None:
#     """Ensure that generate_reauthentication_options fails with invalid inputs."""
#     response = await password_auth_graphql_client(
#         GENERATE_REAUTHENTICATION_OPTIONS_MUTATION,
#         variables={
#             "captchaToken": captcha_token,
#         },
#     )

#     assert response == {
#         "data": {
#             "generateReauthenticationOptions": {
#                 "__typename": expected_typename,
#             },
#         },
#     }, f"Failed for case: {description}"


async def test_generate_reauthentication_options_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_reauthentication_options fails when user is not authenticated."""
    response = await graphql_client(
        GENERATE_REAUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    # Should return an authentication error since IsAuthenticated permission is required
    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_generate_reauthentication_options_successful(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_reauthentication_options succeeds with valid inputs for authenticated user."""
    response = await password_auth_graphql_client(
        GENERATE_REAUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    # Check the response structure
    data = response["data"]["generateReauthenticationOptions"]
    assert data["__typename"] == "GenerateAuthenticationOptionsSuccess"
    assert "authenticationOptions" in data  # authenticationOptions should be present

    # Verify the authentication options is a valid JSON string
    auth_options = json.loads(data["authenticationOptions"])
    assert isinstance(auth_options, dict)
    assert "challenge" in auth_options
    assert "timeout" in auth_options
    assert "rpId" in auth_options


async def test_generate_reauthentication_options_with_webauthn_credentials(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_reauthentication_options works for users with WebAuthn credentials."""
    response = await webauthn_auth_graphql_client(
        GENERATE_REAUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    # Check the response structure
    data = response["data"]["generateReauthenticationOptions"]
    assert data["__typename"] == "GenerateAuthenticationOptionsSuccess"
    assert "authenticationOptions" in data

    # Verify the authentication options is a valid JSON string
    auth_options = json.loads(data["authenticationOptions"])
    assert isinstance(auth_options, dict)
    assert "challenge" in auth_options
    assert "timeout" in auth_options
    assert "rpId" in auth_options
    # Should include allowCredentials for existing user with WebAuthn credentials
    assert "allowCredentials" in auth_options
    assert isinstance(auth_options["allowCredentials"], list)
