import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo

from tests.integration.graphql_client import GraphQLClient


@pytest.fixture
async def password_account(account_repo: AccountRepo) -> Account:
    return await account_repo.create(
        full_name="Aryan Iyappan",
        email="aryan@outlook.com",
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )


LOGIN_MUTATION = """
mutation LoginMutation($email: String!, $password: String!, $captchaToken: String!) {
    loginWithPassword(email: $email, password: $password, captchaToken: $captchaToken) {
        __typename
        ... on Account {
            __typename
        }
    }
}
"""


async def test_invalid_password_login(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot log in with invalid credentials."""
    response = await graphql_client(
        LOGIN_MUTATION,
        variables={
            "email": "invalid@user.com",
            "password": "wrongpassword",
            "captchaToken": "invalid-captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPassword": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }
