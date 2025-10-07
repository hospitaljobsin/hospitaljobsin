import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import PasswordResetTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

RESET_PASSWORD_MUTATION = """
mutation ResetPasswordMutation(
    $email: String!
    $passwordResetToken: String!
    $newPassword: String!
) {
    resetPassword(
        email: $email
        passwordResetToken: $passwordResetToken
        newPassword: $newPassword
    ) {
        __typename
        ... on Account {
            __typename
        }
        ... on InvalidPasswordResetTokenError {
            __typename
        }
        ... on PasswordNotStrongError {
            __typename
        }
        ... on TwoFactorAuthenticationChallengeNotFoundError {
            __typename
        }
    }
}
"""


async def test_reset_password_successful(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we can reset password successfully."""
    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": password_account.email,
            "passwordResetToken": reset_token,
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "Account",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_reset_password_with_invalid_token(
    graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we cannot reset password with invalid token."""
    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": password_account.email,
            "passwordResetToken": "invalid-token",
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }


async def test_reset_password_with_wrong_email(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot reset password with wrong email."""
    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": generate_test_email(),
            "passwordResetToken": reset_token,
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


@pytest.mark.parametrize(
    ("new_password", "description"),
    [
        ("weak", "Too short password"),
        ("password", "No uppercase or numbers"),
        ("PASSWORD", "No lowercase or numbers"),
        ("Password", "No numbers or special chars"),
        ("12345678", "Only numbers"),
        ("", "Empty password"),
        ("   ", "Whitespace only password"),
    ],
)
async def test_reset_password_with_weak_password(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
    new_password: str,
    description: str,
) -> None:
    """Ensure that we cannot reset password with weak password."""
    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": password_account.email,
            "passwordResetToken": reset_token,
            "newPassword": new_password,
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "PasswordNotStrongError",
            },
        },
    }, f"Failed for case: {description}"

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_reset_password_case_insensitive_email(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that email is case insensitive."""
    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": password_account.email.upper(),
            "passwordResetToken": reset_token,
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "Account",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


@pytest.fixture(scope="module")
async def account_with_2fa(account_repo: AccountRepo) -> Account:
    """Create an account with 2FA enabled."""
    totp_secret = pyotp.random_base32()
    account = await account_repo.create(
        full_name="Test User 2FA",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    await account_repo.set_two_factor_secret(account=account, totp_secret=totp_secret)
    yield account
    await account_repo.delete(account)


async def test_reset_password_with_2fa_without_challenge(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot reset password for 2FA account without completing challenge."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)

    response = await graphql_client(
        RESET_PASSWORD_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": reset_token,
            "newPassword": "NewPassword123!",
        },
    )

    assert response == {
        "data": {
            "resetPassword": {
                "__typename": "TwoFactorAuthenticationChallengeNotFoundError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)
