import pytest
from aioinject import Container
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    PhoneNumberVerificationTokenRepo,
    ProfileRepo,
)
from app.auth.repositories import (
    SessionRepo,
    WebAuthnChallengeRepo,
    WebAuthnCredentialRepo,
)
from app.job_alerts.repositories import JobAlertRepo
from app.jobs.repositories import JobApplicantRepo, JobApplicationFormRepo, JobRepo
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
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


@pytest.fixture(scope="session")
async def organization_invite_repo(
    container: Container,
) -> OrganizationInviteRepo:
    async with container.context() as ctx:
        return await ctx.resolve(OrganizationInviteRepo)


@pytest.fixture(scope="session")
async def job_alert_repo(
    container: Container,
) -> JobAlertRepo:
    async with container.context() as ctx:
        return await ctx.resolve(JobAlertRepo)


@pytest.fixture(scope="session")
async def job_repo(
    container: Container,
) -> JobRepo:
    async with container.context() as ctx:
        return await ctx.resolve(JobRepo)


@pytest.fixture(scope="session")
async def phone_number_verification_token_repo(
    container: Container,
) -> PhoneNumberVerificationTokenRepo:
    async with container.context() as ctx:
        return await ctx.resolve(PhoneNumberVerificationTokenRepo)


@pytest.fixture(scope="session")
async def job_application_form_repo(
    container: Container,
) -> JobApplicationFormRepo:
    async with container.context() as ctx:
        return await ctx.resolve(JobApplicationFormRepo)


@pytest.fixture(scope="session")
async def profile_repo(
    container: Container,
) -> ProfileRepo:
    async with container.context() as ctx:
        return await ctx.resolve(ProfileRepo)


@pytest.fixture(scope="session")
async def job_applicant_repo(
    container: Container,
) -> JobApplicantRepo:
    async with container.context() as ctx:
        return await ctx.resolve(JobApplicantRepo)
