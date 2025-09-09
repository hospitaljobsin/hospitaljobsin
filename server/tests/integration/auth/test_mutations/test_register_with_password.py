import pytest
from app.accounts.documents import Account
from app.accounts.repositories import EmailVerificationTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

REGISTER_WITH_PASSWORD_MUTATION = """
mutation RegisterWithPasswordMutation($email: String!, $emailVerificationToken: String!, $password: String!, $fullName: String!, $captchaToken: String!) {
    registerWithPassword(email: $email, emailVerificationToken: $emailVerificationToken, password: $password, fullName: $fullName, captchaToken: $captchaToken) {
        __typename
        ... on Account {
            __typename
            id
            email
            fullName
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
        ... on PasswordNotStrongError {
            __typename
        }
    }
}
"""


@pytest.mark.parametrize(
    (
        "email",
        "email_verification_token",
        "password",
        "full_name",
        "captcha_token",
        "expected_typename",
        "description",
    ),
    [
        # Invalid email verification token
        (
            "test@example.com",
            "invalid-token",
            "StrongPass123!",
            "Test User",
            "captcha-token",
            "InvalidEmailVerificationTokenError",
            "Invalid email verification token",
        ),
    ],
)
async def test_register_with_password_invalid(
    graphql_client: GraphQLClient,
    email: str,
    email_verification_token: str,
    password: str,
    full_name: str,
    captcha_token: str,
    expected_typename: str,
    description: str,
) -> None:
    """Ensure that register_with_password fails with invalid inputs."""
    response = await graphql_client(
        REGISTER_WITH_PASSWORD_MUTATION,
        variables={
            "email": email,
            "emailVerificationToken": email_verification_token,
            "password": password,
            "fullName": full_name,
            "captchaToken": captcha_token,
        },
    )

    assert response == {
        "data": {
            "registerWithPassword": {
                "__typename": expected_typename,
            },
        },
    }, f"Failed for case: {description}"


async def test_register_with_password_email_in_use(
    graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that register_with_password fails when email is already in use."""
    response = await graphql_client(
        REGISTER_WITH_PASSWORD_MUTATION,
        variables={
            "email": password_account.email,
            "emailVerificationToken": "some-token",
            "password": "StrongPass123!",
            "fullName": "Test User",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "registerWithPassword": {
                "__typename": "EmailInUseError",
            },
        },
    }


@pytest.mark.parametrize(
    ("password", "description"),
    [
        ("Short1!", "Password too short"),
        ("STRONGPASS123!", "Password missing lowercase letter"),
        ("strongpass123!", "Password missing uppercase letter"),
        ("StrongPass!", "Password missing digit"),
        ("StrongPass123", "Password missing special character"),
    ],
)
async def test_register_with_password_weak_password(
    graphql_client: GraphQLClient,
    email_verification_token_repo: EmailVerificationTokenRepo,
    password: str,
    description: str,
) -> None:
    """Ensure that register_with_password fails with weak passwords."""
    email = generate_test_email()
    full_name = "Test User"

    # Create a valid email verification token
    email_verification_token, _ = await email_verification_token_repo.create(
        email=email
    )

    response = await graphql_client(
        REGISTER_WITH_PASSWORD_MUTATION,
        variables={
            "email": email,
            "emailVerificationToken": email_verification_token,
            "password": password,
            "fullName": full_name,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "registerWithPassword": {
                "__typename": "PasswordNotStrongError",
            },
        },
    }, f"Failed for case: {description}"


async def test_register_with_password_successful(
    graphql_client: GraphQLClient,
    email_verification_token_repo: EmailVerificationTokenRepo,
) -> None:
    """Ensure that register_with_password succeeds with valid inputs."""
    # Use a unique email address for this test to avoid conflicts
    email = generate_test_email()
    full_name = "Test User"
    password = "StrongPass123!"

    # Create a valid email verification token
    email_verification_token, _ = await email_verification_token_repo.create(
        email=email
    )

    response = await graphql_client(
        REGISTER_WITH_PASSWORD_MUTATION,
        variables={
            "email": email,
            "emailVerificationToken": email_verification_token,
            "password": password,
            "fullName": full_name,
            "captchaToken": "captcha-token",
        },
    )

    # Check the response structure
    data = response["data"]["registerWithPassword"]
    assert data["__typename"] == "Account"
    assert data["email"] == email
    assert data["fullName"] == full_name
    assert "id" in data  # ID should be present
