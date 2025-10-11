from app.accounts.documents import Account
from app.auth.repositories import PasswordResetTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

PASSWORD_RESET_TOKEN_QUERY = """
query PasswordResetTokenQuery($resetToken: String!, $email: String!) {
    passwordResetToken(resetToken: $resetToken, email: $email) {
        __typename
        ... on PasswordResetToken {
            id
            email
            authProviders
            twoFactorProviders
            needs2fa
        }
        ... on PasswordResetTokenNotFoundError {
            message
        }
    }
}
"""


async def test_password_reset_token_valid(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that valid password reset token returns PasswordResetToken."""
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": reset_token,
            "email": password_account.email,
        },
    )

    assert response["data"]["passwordResetToken"]["__typename"] == "PasswordResetToken"
    assert response["data"]["passwordResetToken"]["email"] == password_account.email
    assert "PASSWORD" in response["data"]["passwordResetToken"]["authProviders"]
    assert response["data"]["passwordResetToken"]["needs2fa"] is False

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_password_reset_token_invalid_token(
    graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that invalid token returns PasswordResetTokenNotFoundError."""
    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": "invalid-token",
            "email": password_account.email,
        },
    )

    assert (
        response["data"]["passwordResetToken"]["__typename"]
        == "PasswordResetTokenNotFoundError"
    )
    assert "message" in response["data"]["passwordResetToken"]


async def test_password_reset_token_invalid_email(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that valid token with wrong email returns PasswordResetTokenNotFoundError."""
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": reset_token,
            "email": generate_test_email(),
        },
    )

    assert (
        response["data"]["passwordResetToken"]["__typename"]
        == "PasswordResetTokenNotFoundError"
    )

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_password_reset_token_nonexistent_email(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that nonexistent email returns PasswordResetTokenNotFoundError."""
    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": "some-token",
            "email": generate_test_email(),
        },
    )

    assert (
        response["data"]["passwordResetToken"]["__typename"]
        == "PasswordResetTokenNotFoundError"
    )


async def test_password_reset_token_case_insensitive_email(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that email matching is case insensitive."""
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": reset_token,
            "email": password_account.email.upper(),
        },
    )

    assert response["data"]["passwordResetToken"]["__typename"] == "PasswordResetToken"
    assert response["data"]["passwordResetToken"]["email"] == password_account.email

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_password_reset_token_returns_all_fields(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that password reset token returns all expected fields."""
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        PASSWORD_RESET_TOKEN_QUERY,
        variables={
            "resetToken": reset_token,
            "email": password_account.email,
        },
    )

    token_data = response["data"]["passwordResetToken"]
    assert token_data["__typename"] == "PasswordResetToken"
    assert "id" in token_data
    assert "email" in token_data
    assert "authProviders" in token_data
    assert "twoFactorProviders" in token_data
    assert "needs2fa" in token_data

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)
