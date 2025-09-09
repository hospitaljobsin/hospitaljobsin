import pytest
from app.accounts.repositories import EmailVerificationTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

VERIFY_EMAIL_MUTATION = """
mutation VerifyEmailMutation($email: String!, $emailVerificationToken: String!, $captchaToken: String!) {
    verifyEmail(email: $email, emailVerificationToken: $emailVerificationToken, captchaToken: $captchaToken) {
        __typename
        ... on VerifyEmailSuccess {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
        ... on EmailInUseError {
            __typename
        }
        ... on InvalidEmailVerificationTokenError {
            __typename
        }
    }
}
"""


@pytest.mark.parametrize(
    (
        "email",
        "email_verification_token",
        "captcha_token",
        "expected_typename",
        "description",
    ),
    [
        # Email already in use
        (
            "aryan@outlook.com",
            "some-token",
            "captcha-token",
            "EmailInUseError",
            "Email already in use",
        ),
        # Email case sensitivity- already in use
        (
            "ARYAN@OUTLOOK.COM",
            "some-token",
            "captcha-token",
            "EmailInUseError",
            "Email already in use",
        ),
        # Invalid email verification token
        (
            "test@example.com",
            "invalid-token",
            "captcha-token",
            "InvalidEmailVerificationTokenError",
            "Invalid email verification token",
        ),
        # Expired or non-existent token
        (
            "test@example.com",
            "expired-token",
            "captcha-token",
            "InvalidEmailVerificationTokenError",
            "Expired or non-existent token",
        ),
        # Token for different email
        (
            "different@example.com",
            "token-for-other-email",
            "captcha-token",
            "InvalidEmailVerificationTokenError",
            "Token does not match email",
        ),
    ],
)
async def test_verify_email_invalid(
    graphql_client: GraphQLClient,
    email: str,
    email_verification_token: str,
    captcha_token: str,
    expected_typename: str,
    description: str,
) -> None:
    """Ensure that verify_email fails with invalid inputs."""
    response = await graphql_client(
        VERIFY_EMAIL_MUTATION,
        variables={
            "email": email,
            "emailVerificationToken": email_verification_token,
            "captchaToken": captcha_token,
        },
    )

    assert response == {
        "data": {
            "verifyEmail": {
                "__typename": expected_typename,
            },
        },
    }, f"Failed for case: {description}"


async def test_verify_email_successful(
    graphql_client: GraphQLClient,
    email_verification_token_repo: EmailVerificationTokenRepo,
) -> None:
    """Ensure that verify_email succeeds with valid inputs."""
    # Use a unique email address for this test
    email = generate_test_email()
    email_verification_token, _ = await email_verification_token_repo.create(
        email=generate_test_email()
    )

    # Now verify the email
    response = await graphql_client(
        VERIFY_EMAIL_MUTATION,
        variables={
            "email": email,
            "emailVerificationToken": email_verification_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verifyEmail": {
                "__typename": "VerifyEmailSuccess",
            },
        },
    }
