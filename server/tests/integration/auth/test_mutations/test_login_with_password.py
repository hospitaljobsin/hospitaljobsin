import pytest
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient

LOGIN_PASSWORD_MUTATION = """
mutation LoginPasswordMutation($email: String!, $password: String!, $captchaToken: String!) {
    loginWithPassword(email: $email, password: $password, captchaToken: $captchaToken) {
        __typename
        ... on Account {
            __typename
        }
    }
}
"""


@pytest.mark.usefixtures("password_account")
@pytest.mark.parametrize(
    ("email", "password", "description"),
    [
        # Invalid email address format
        ("invalid-email", "somepassword", "Invalid email format - missing @"),
        ("invalid@", "somepassword", "Invalid email format - missing domain"),
        ("@domain.com", "somepassword", "Invalid email format - missing local part"),
        ("invalid.email", "somepassword", "Invalid email format - no @ symbol"),
        ("user@", "somepassword", "Invalid email format - incomplete domain"),
        # Invalid passwords
        ("user@example.com", "", "Empty password"),
        ("user@example.com", "   ", "Whitespace only password"),
        ("user@example.com", "123", "Too short password"),
        ("user@example.com", "password", "Weak password - no uppercase/numbers"),
        ("user@example.com", "PASSWORD123", "Weak password - no lowercase"),
        # Existing email but wrong password
        ("aryan@outlook.com", "wrongpassword", "Existing email with wrong password"),
        (
            "aryan@outlook.com",
            "Password123",
            "Existing email with almost correct password",
        ),
        ("aryan@outlook.com", "password123!", "Existing email with different case"),
        (
            "aryan@outlook.com",
            "Password124!",
            "Existing email with similar but wrong password",
        ),
    ],
)
async def test_invalid_password_login(
    graphql_client: GraphQLClient,
    email: str,
    password: str,
    description: str,
) -> None:
    """Ensure that we cannot log in with invalid credentials."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "email": email,
            "password": password,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPassword": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }, f"Failed for case: {description}"


async def test_successful_password_login(
    graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we can log in with valid credentials."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "email": password_account.email,
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPassword": {
                "__typename": "Account",
            },
        },
    }
