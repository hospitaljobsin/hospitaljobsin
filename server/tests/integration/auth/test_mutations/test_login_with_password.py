import pytest
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient

LOGIN_PASSWORD_MUTATION = """
mutation LoginPasswordMutation($login: String!, $password: String!, $captchaToken: String!) {
    loginWithPassword(login: $login, password: $password, captchaToken: $captchaToken) {
        __typename
        ... on Account {
            __typename
        }
    }
}
"""


@pytest.mark.parametrize(
    ("login", "password", "description"),
    [
        # Invalid email address format
        ("invalid-email", "somepassword", "Invalid email format - missing @"),
        ("invalid@", "somepassword", "Invalid email format - missing domain"),
        ("@domain.com", "somepassword", "Invalid email format - missing local part"),
        ("invalid.email", "somepassword", "Invalid email format - no @ symbol"),
        ("user@", "somepassword", "Invalid email format - incomplete domain"),
        # Invalid phone number format
        ("123", "somepassword", "Invalid phone number - too short"),
        ("invalid", "somepassword", "Invalid phone number - non-numeric"),
        ("12345", "somepassword", "Invalid phone number - incomplete"),
        # Invalid passwords with email
        ("user@example.com", "", "Empty password with email"),
        ("user@example.com", "   ", "Whitespace only password with email"),
        ("user@example.com", "123", "Too short password with email"),
        (
            "user@example.com",
            "password",
            "Weak password with email - no uppercase/numbers",
        ),
        ("user@example.com", "PASSWORD123", "Weak password with email - no lowercase"),
        # Invalid passwords with phone number
        ("+919876543210", "", "Empty password with phone"),
        ("+919876543210", "   ", "Whitespace only password with phone"),
        ("+919876543210", "123", "Too short password with phone"),
    ],
)
async def test_invalid_password_login(
    graphql_client: GraphQLClient,
    login: str,
    password: str,
    description: str,
) -> None:
    """Ensure that we cannot log in with invalid credentials."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": login,
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


@pytest.mark.parametrize(
    ("password", "description"),
    [
        ("wrongpassword", "Existing email with wrong password"),
        ("Password123", "Existing email with almost correct password"),
        ("password123!", "Existing email with different case"),
        ("Password124!", "Existing email with similar but wrong password"),
    ],
)
async def test_existing_email_wrong_password_login(
    graphql_client: GraphQLClient,
    password_account: Account,
    password: str,
    description: str,
) -> None:
    """Ensure that we cannot log in with existing email but wrong password."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": password_account.email,
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


@pytest.mark.parametrize(
    ("password", "description"),
    [
        ("wrongpassword", "Existing phone with wrong password"),
        ("Password123", "Existing phone with almost correct password"),
        ("password123!", "Existing phone with different case"),
        ("Password124!", "Existing phone with similar but wrong password"),
    ],
)
async def test_existing_phone_wrong_password_login(
    graphql_client: GraphQLClient,
    phone_password_account: Account,
    password: str,
    description: str,
) -> None:
    """Ensure that we cannot log in with existing phone number but wrong password."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": phone_password_account.phone_number,
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


async def test_successful_password_login_with_email(
    graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we can log in with valid email and password."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": password_account.email,
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


async def test_successful_password_login_with_phone(
    graphql_client: GraphQLClient,
    phone_password_account: Account,
) -> None:
    """Ensure that we can log in with valid phone number and password."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": phone_password_account.phone_number,
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


async def test_nonexistent_email_login(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot log in with non-existent email."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": "nonexistent@example.com",
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPassword": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }


async def test_nonexistent_phone_login(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot log in with non-existent phone number."""
    response = await graphql_client(
        LOGIN_PASSWORD_MUTATION,
        variables={
            "login": "+919999999999",
            "password": "Password123!",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "loginWithPassword": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }
