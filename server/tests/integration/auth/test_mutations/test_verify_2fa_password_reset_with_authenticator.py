import pyotp
import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import PasswordResetTokenRepo, RecoveryCodeRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION = """
mutation Verify2FAPasswordResetWithAuthenticatorMutation(
    $email: String!
    $passwordResetToken: String!
    $twoFactorToken: String!
    $captchaToken: String!
) {
    verify2faPasswordResetWithAuthenticator(
        email: $email
        passwordResetToken: $passwordResetToken
        twoFactorToken: $twoFactorToken
        captchaToken: $captchaToken
    ) {
        __typename
        ... on PasswordResetToken {
            __typename
        }
        ... on InvalidPasswordResetTokenError {
            __typename
        }
        ... on InvalidCredentialsError {
            __typename
        }
        ... on AuthenticatorNotEnabledError {
            __typename
        }
        ... on InvalidCaptchaTokenError {
            __typename
        }
    }
}
"""


@pytest.fixture(scope="function")
async def account_with_2fa(account_repo: AccountRepo) -> Account:
    """Create an account with 2FA enabled."""
    totp_secret = pyotp.random_base32()
    account = await account_repo.create(
        full_name="Test User",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    await account_repo.set_two_factor_secret(account=account, totp_secret=totp_secret)
    yield account
    await account_repo.delete(account)


async def test_verify_2fa_password_reset_with_valid_totp(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we can verify 2FA password reset with a valid TOTP token."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": reset_token,
            "twoFactorToken": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "PasswordResetToken",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_valid_recovery_code(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
    recovery_code_repo: RecoveryCodeRepo,
) -> None:
    """Ensure that we can verify 2FA password reset with a valid recovery code."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)
    recovery_code = await recovery_code_repo.create(account_id=account_with_2fa.id)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": reset_token,
            "twoFactorToken": recovery_code,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "PasswordResetToken",
            },
        },
    }

    existing_code = await recovery_code_repo.get(
        account_id=account_with_2fa.id, code=recovery_code
    )
    assert existing_code is None

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_invalid_totp(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with an invalid TOTP token."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": reset_token,
            "twoFactorToken": "000000",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_invalid_password_reset_token(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
) -> None:
    """Ensure that we cannot verify 2FA password reset with an invalid password reset token."""
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": "invalid-token",
            "twoFactorToken": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }


async def test_verify_2fa_password_reset_with_wrong_email(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with wrong email."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": generate_test_email(),
            "passwordResetToken": reset_token,
            "twoFactorToken": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "InvalidPasswordResetTokenError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_without_authenticator_enabled(
    graphql_client: GraphQLClient,
    password_account: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset when authenticator is not enabled."""
    reset_token = await password_reset_token_repo.create(account=password_account)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": password_account.email,
            "passwordResetToken": reset_token,
            "twoFactorToken": "123456",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "AuthenticatorNotEnabledError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=password_account.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_case_insensitive_email(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that email verification is case insensitive."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)
    totp = pyotp.TOTP(account_with_2fa.two_factor_secret)
    valid_token = totp.now()

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email.upper(),
            "passwordResetToken": reset_token,
            "twoFactorToken": valid_token,
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "PasswordResetToken",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)


async def test_verify_2fa_password_reset_with_invalid_recovery_code(
    graphql_client: GraphQLClient,
    account_with_2fa: Account,
    password_reset_token_repo: PasswordResetTokenRepo,
) -> None:
    """Ensure that we cannot verify 2FA password reset with an invalid recovery code."""
    reset_token = await password_reset_token_repo.create(account=account_with_2fa)

    response = await graphql_client(
        VERIFY_2FA_PASSWORD_RESET_WITH_AUTHENTICATOR_MUTATION,
        variables={
            "email": account_with_2fa.email,
            "passwordResetToken": reset_token,
            "twoFactorToken": "INVALIDCODE",
            "captchaToken": "captcha-token",
        },
    )

    assert response == {
        "data": {
            "verify2faPasswordResetWithAuthenticator": {
                "__typename": "InvalidCredentialsError",
            },
        },
    }

    existing_token = await password_reset_token_repo.get_by_account(
        account_id=account_with_2fa.id
    )
    if existing_token:
        await password_reset_token_repo.delete(existing_token)
