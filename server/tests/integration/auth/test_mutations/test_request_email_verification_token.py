import pytest
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

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
    ],
)
async def test_request_email_verification_token_invalid(
    graphql_client: GraphQLClient,
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


@pytest.mark.parametrize(
    ("email_case", "description"),
    [
        ("normal", "Email already in use"),
        ("uppercase", "Email already in use (case insensitive)"),
    ],
)
async def test_request_email_verification_token_existing_email(
    graphql_client: GraphQLClient,
    password_account: Account,
    email_case: str,
    description: str,
) -> None:
    """Ensure that we cannot request an email verification token for an email already in use."""
    email = (
        password_account.email.upper()
        if email_case == "uppercase"
        else password_account.email
    )

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
                "__typename": "EmailInUseError",
            },
        },
    }, f"Failed for case: {description}"


async def test_request_email_verification_token_cooldown_error(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that we get a cooldown error when requesting email verification tokens too frequently."""
    # Use a unique email address for this test to avoid conflicts
    email = generate_test_email()

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
    email = generate_test_email()

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
