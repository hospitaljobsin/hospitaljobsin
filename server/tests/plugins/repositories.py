import pytest
from aioinject import Container
from app.accounts.repositories import AccountRepo, EmailVerificationTokenRepo
from app.auth.repositories import SessionRepo, WebAuthnCredentialRepo


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
async def session_repo(
    container: Container,
) -> SessionRepo:
    async with container.context() as ctx:
        return await ctx.resolve(SessionRepo)
