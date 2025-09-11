import pytest
from aioinject import Container
from app.accounts.repositories import AccountRepo, EmailVerificationTokenRepo
from app.auth.repositories import (
    SessionRepo,
    WebAuthnChallengeRepo,
    WebAuthnCredentialRepo,
)
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo


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
async def organization_repo(
    container: Container,
) -> OrganizationRepo:
    async with container.context() as ctx:
        return await ctx.resolve(OrganizationRepo)


@pytest.fixture(scope="session")
async def organization_member_repo(
    container: Container,
) -> OrganizationMemberRepo:
    async with container.context() as ctx:
        return await ctx.resolve(OrganizationMemberRepo)
