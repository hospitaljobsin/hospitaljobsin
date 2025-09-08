import time

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo

from tests.integration.graphql_client import GraphQLClient


@pytest.fixture(scope="session")
async def password_account(account_repo: AccountRepo) -> Account:
    return await account_repo.create(
        full_name="Aryan Iyappan",
        email="aryan@outlook.com",
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )


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
    password_account: Account,
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


REQUEST_EMAIL_VERIFICATION_TOKEN_MUTATION = """
mutation RequestEmailVerificationTokenMutation($email: String!, $captchaToken: String!) {
    requestEmailVerificationToken(email: $email, captchaToken: $captchaToken) {
        __typename
        ... on RequestEmailVerificationSuccess {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
        ... on EmailVerificationTokenCooldownError {
            __typename
        }
        ... on InvalidEmailError {
            __typename
        }
        ... on EmailInUseError {
            __typename
        }
    }
}
"""


@pytest.mark.parametrize(
    ("email", "captcha_token", "expected_typename", "description"),
    [
        # Invalid email formats
        (
            "invalid-email",
            "captcha-token",
            "InvalidEmailError",
            "Invalid email format - missing @",
        ),
        (
            "invalid@",
            "captcha-token",
            "InvalidEmailError",
            "Invalid email format - missing domain",
        ),
        (
            "@domain.com",
            "captcha-token",
            "InvalidEmailError",
            "Invalid email format - missing local part",
        ),
        (
            "invalid.email",
            "captcha-token",
            "InvalidEmailError",
            "Invalid email format - no @ symbol",
        ),
        (
            "user@",
            "captcha-token",
            "InvalidEmailError",
            "Invalid email format - incomplete domain",
        ),
        ("", "captcha-token", "InvalidEmailError", "Empty email"),
        ("   ", "captcha-token", "InvalidEmailError", "Whitespace only email"),
        # Disposable email domains
        (
            "user@10minutemail.com",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - 10minutemail.com",
        ),
        (
            "user@tempmail.org",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - tempmail.org",
        ),
        (
            "user@guerrillamail.com",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - guerrillamail.com",
        ),
        (
            "user@mailinator.com",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - mailinator.com",
        ),
        (
            "user@throwaway.email",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - throwaway.email",
        ),
        (
            "user@temp-mail.org",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - temp-mail.org",
        ),
        (
            "user@yopmail.com",
            "captcha-token",
            "InvalidEmailError",
            "Disposable email domain - yopmail.com",
        ),
        # Existing email (email already in use)
        (
            "aryan@outlook.com",
            "captcha-token",
            "EmailInUseError",
            "Email already in use",
        ),
        (
            "ARYAN@OUTLOOK.COM",
            "captcha-token",
            "EmailInUseError",
            "Email already in use (case insensitive)",
        ),
    ],
)
async def test_request_email_verification_token_invalid(
    graphql_client: GraphQLClient,
    password_account: Account,  # Needed to ensure the account exists for EmailInUseError tests
    email: str,
    captcha_token: str,
    expected_typename: str,
    description: str,
) -> None:
    """Ensure that we cannot request an email verification token with invalid parameters."""
    response = await graphql_client(
        REQUEST_EMAIL_VERIFICATION_TOKEN_MUTATION,
        variables={
            "email": email,
            "captchaToken": captcha_token,
        },
    )

    assert response == {
        "data": {
            "requestEmailVerificationToken": {
                "__typename": expected_typename,
            },
        },
    }, f"Failed for case: {description}"


async def test_request_email_verification_token_cooldown_error(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we get a cooldown error when requesting email verification tokens too frequently."""
    # Use a unique email address for this test to avoid conflicts
    email = f"cooldown-test-{int(time.time())}-{id(test_request_email_verification_token_cooldown_error)}@outlook.com"

    # First request should succeed
    response1 = await graphql_client(
        REQUEST_EMAIL_VERIFICATION_TOKEN_MUTATION,
        variables={
            "email": email,
            "captchaToken": "captcha-token",
        },
    )

    assert response1 == {
        "data": {
            "requestEmailVerificationToken": {
                "__typename": "RequestEmailVerificationSuccess",
            },
        },
    }

    # Second request immediately after should trigger cooldown error
    response2 = await graphql_client(
        REQUEST_EMAIL_VERIFICATION_TOKEN_MUTATION,
        variables={
            "email": email,
            "captchaToken": "captcha-token",
        },
    )

    assert response2 == {
        "data": {
            "requestEmailVerificationToken": {
                "__typename": "EmailVerificationTokenCooldownError",
            },
        },
    }


async def test_request_email_verification_token_successful(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we can request an email verification token successfully."""
    # Use a unique email address for this test to avoid conflicts
    email = f"newaryan-{int(time.time())}-{id(test_request_email_verification_token_successful)}@outlook.com"

    response = await graphql_client(
        REQUEST_EMAIL_VERIFICATION_TOKEN_MUTATION,
        variables={
            "email": email,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestEmailVerificationToken": {
                "__typename": "RequestEmailVerificationSuccess",
            },
        },
    }
