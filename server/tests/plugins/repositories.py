import pytest
from aioinject import Container
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    PhoneNumberVerificationTokenRepo,
)
from app.auth.repositories import (
    PasswordResetTokenRepo,
    RecoveryCodeRepo,
    SessionRepo,
    TemporaryTwoFactorChallengeRepo,
    TwoFactorAuthenticationChallengeRepo,
    WebAuthnChallengeRepo,
    WebAuthnCredentialRepo,
)


@pytest.fixture(scope="session")
async def account_repo(container: Container) -> AccountRepo:
    async with container.context() as ctx:
        return await ctx.resolve(AccountRepo)


@pytest.fixture(scope="session")
async def email_verification_token_repo(
    container: Container,
) -> EmailVerificationTokenRepo:
    async with container.context() as ctx:
        return await ctx.resolve(EmailVerificationTokenRepo)


@pytest.fixture(scope="session")
async def webauthn_credential_repo(
    container: Container,
) -> WebAuthnCredentialRepo:
    async with container.context() as ctx:
        return await ctx.resolve(WebAuthnCredentialRepo)


@pytest.fixture(scope="session")
async def webauthn_challenge_repo(
    container: Container,
) -> WebAuthnChallengeRepo:
    async with container.context() as ctx:
        return await ctx.resolve(WebAuthnChallengeRepo)


@pytest.fixture(scope="session")
async def session_repo(
    container: Container,
) -> SessionRepo:
    async with container.context() as ctx:
        return await ctx.resolve(SessionRepo)


@pytest.fixture(scope="session")
async def recovery_code_repo(
    container: Container,
) -> RecoveryCodeRepo:
    async with container.context() as ctx:
        return await ctx.resolve(RecoveryCodeRepo)


@pytest.fixture(scope="session")
async def phone_number_verification_token_repo(
    container: Container,
) -> PhoneNumberVerificationTokenRepo:
    async with container.context() as ctx:
        return await ctx.resolve(PhoneNumberVerificationTokenRepo)


@pytest.fixture(scope="session")
async def password_reset_token_repo(
    container: Container,
) -> PasswordResetTokenRepo:
    async with container.context() as ctx:
        return await ctx.resolve(PasswordResetTokenRepo)


@pytest.fixture(scope="session")
async def temp_two_factor_challenge_repo(
    container: Container,
) -> TemporaryTwoFactorChallengeRepo:
    async with container.context() as ctx:
        return await ctx.resolve(TemporaryTwoFactorChallengeRepo)


@pytest.fixture(scope="session")
async def two_factor_authentication_challenge_repo(
    container: Container,
) -> TwoFactorAuthenticationChallengeRepo:
    async with container.context() as ctx:
        return await ctx.resolve(TwoFactorAuthenticationChallengeRepo)
