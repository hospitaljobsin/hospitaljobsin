import urllib
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from urllib.parse import urlparse

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.accounts.documents import Account, EmailVerificationToken, Profile
from app.auth.documents import (
    OAuthCredential,
    PasswordResetToken,
    RecoveryCode,
    Session,
    TemporaryTwoFactorChallenge,
    TwoFactorAuthenticationChallenge,
    WebAuthnChallenge,
    WebAuthnCredential,
)
from app.jobs.documents import (
    Job,
    JobApplicant,
    JobApplicationForm,
    JobMetric,
    SavedJob,
)
from app.organizations.documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)


def rebuild_models() -> None:
    """Rebuild models to update forward references."""
    from app.accounts.documents import Account
    from app.auth.documents import (
        OAuthCredential,
        RecoveryCode,
        TemporaryTwoFactorChallenge,
        WebAuthnCredential,
    )

    Account.model_rebuild()

    WebAuthnCredential.model_rebuild()

    OAuthCredential.model_rebuild()

    RecoveryCode.model_rebuild()

    TemporaryTwoFactorChallenge.model_rebuild()


@asynccontextmanager
async def initialize_database(
    database_url: str, default_database_name: str
) -> AsyncGenerator[None, None]:
    """Initialize the database."""
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        urlparse(database_url),
        connectTimeoutMS=1000,
        socketTimeoutMS=1000,
        serverSelectionTimeoutMS=1000,
    )
    try:
        rebuild_models()
        await init_beanie(
            database=client.get_default_database(default=default_database_name),
            document_models=[
                Job,
                JobApplicant,
                JobApplicationForm,
                JobMetric,
                Account,
                Profile,
                SavedJob,
                Session,
                EmailVerificationToken,
                PasswordResetToken,
                Organization,
                OrganizationMember,
                WebAuthnCredential,
                WebAuthnChallenge,
                OAuthCredential,
                TwoFactorAuthenticationChallenge,
                RecoveryCode,
                TemporaryTwoFactorChallenge,
                OrganizationInvite,
            ],
        )
        yield
    finally:
        client.close()
