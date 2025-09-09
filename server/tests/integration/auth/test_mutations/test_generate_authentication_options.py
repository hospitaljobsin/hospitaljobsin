import json

from tests.integration.graphql_client import GraphQLClient

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
# async def test_generate_authentication_options_invalid(
#     graphql_client: GraphQLClient,
#     captcha_token: str,
#     expected_typename: str,
#     description: str,
# ) -> None:
#     """Ensure that generate_authentication_options fails with invalid inputs."""
#     response = await graphql_client(
#         GENERATE_AUTHENTICATION_OPTIONS_MUTATION,
#         variables={
#             "captchaToken": captcha_token,
#         },
#     )

#     assert response == {
#         "data": {
#             "generateAuthenticationOptions": {
#                 "__typename": expected_typename,
#             },
#         },
#     }, f"Failed for case: {description}"


async def test_generate_authentication_options_successful(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_authentication_options succeeds with valid inputs."""
    response = await graphql_client(
        GENERATE_AUTHENTICATION_OPTIONS_MUTATION,
        variables={
            "captchaToken": "captcha-token",
        },
    )

    # Check the response structure
    data = response["data"]["generateAuthenticationOptions"]
    assert data["__typename"] == "GenerateAuthenticationOptionsSuccess"
    assert "authenticationOptions" in data  # authenticationOptions should be present

    # Verify the authentication options is a valid JSON string
    auth_options = json.loads(data["authenticationOptions"])
    assert isinstance(auth_options, dict)
    assert "challenge" in auth_options
    assert "timeout" in auth_options
    assert "rpId" in auth_options
