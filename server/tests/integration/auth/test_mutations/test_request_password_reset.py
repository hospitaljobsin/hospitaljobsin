import pytest
from app.accounts.documents import Account
from app.auth.repositories import PasswordResetTokenRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

REQUEST_PASSWORD_RESET_MUTATION = """
mutation RequestPasswordResetMutation($email: String!, $captchaToken: String!) {
    requestPasswordReset(email: $email, captchaToken: $captchaToken) {
        __typename
        ... on RequestPasswordResetSuccess {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
        ... on PasswordResetTokenCooldownError {
            __typename
            remainingSeconds
        }
    }
}
"""


async def test_request_password_reset_successful(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we can request a password reset successfully."""
    # Cleanup any existing tokens
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    response = await graphql_client(
        REQUEST_PASSWORD_RESET_MUTATION,
        variables={
            "email": password_account.email,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestPasswordReset": {
                "__typename": "RequestPasswordResetSuccess",
            },
        },
    }

    # Cleanup
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_request_password_reset_nonexistent_email(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that requesting password reset for nonexistent email succeeds (security by obscurity)."""
    response = await graphql_client(
        REQUEST_PASSWORD_RESET_MUTATION,
        variables={
            "email": generate_test_email(),
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestPasswordReset": {
                "__typename": "RequestPasswordResetSuccess",
            },
        },
    }


async def test_request_password_reset_case_insensitive(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that password reset request is case insensitive."""
    # Cleanup any existing tokens
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    response = await graphql_client(
        REQUEST_PASSWORD_RESET_MUTATION,
        variables={
            "email": password_account.email.upper(),
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "requestPasswordReset": {
                "__typename": "RequestPasswordResetSuccess",
            },
        },
    }

    # Cleanup
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_request_password_reset_cooldown_error(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we get a cooldown error when requesting password reset tokens too frequently."""
    # Cleanup any existing tokens
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)

    # First request should succeed
    response1 = await graphql_client(
        REQUEST_PASSWORD_RESET_MUTATION,
        variables={
            "email": password_account.email,
            "captchaToken": "captcha-token",
        },
    )

    assert response1 == {
        "data": {
            "requestPasswordReset": {
                "__typename": "RequestPasswordResetSuccess",
            },
        },
    }

    # Second request immediately after should trigger cooldown error
    response2 = await graphql_client(
        REQUEST_PASSWORD_RESET_MUTATION,
        variables={
            "email": password_account.email,
            "captchaToken": "captcha-token",
        },
    )

    assert (
        response2["data"]["requestPasswordReset"]["__typename"]
        == "PasswordResetTokenCooldownError"
    )
    assert "remainingSeconds" in response2["data"]["requestPasswordReset"]
    assert response2["data"]["requestPasswordReset"]["remainingSeconds"] > 0

    # Cleanup
    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)
