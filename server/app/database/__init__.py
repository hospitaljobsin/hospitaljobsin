from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.accounts.documents import Account, EmailVerificationToken, Profile
from app.auth.documents import (
    OAuthCredential,
    PasswordResetToken,
    Session,
    WebAuthnChallenge,
    WebAuthnCredential,
)
from app.jobs.documents import Job, SavedJob
from app.organizations.documents import Organization, OrganizationMember


def rebuild_models() -> None:
    """Rebuild models to update forward references."""
    from app.accounts.documents import Account
    from app.auth.documents import (
        OAuthCredential,
        WebAuthnCredential,
    )
    from app.organizations.documents import OrganizationMember

    Account.model_rebuild()

    WebAuthnCredential.model_rebuild()

    OAuthCredential.model_rebuild()

    OrganizationMember.model_rebuild()


@asynccontextmanager
async def initialize_database(database_url: str) -> AsyncGenerator[None, None]:
    """Initialize the database."""
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        database_url,
        connectTimeoutMS=1000,
        socketTimeoutMS=1000,
        serverSelectionTimeoutMS=1000,
    )
    try:
        rebuild_models()
        await init_beanie(
            database=client.get_default_database(),
            document_models=[
                Job,
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
            ],
        )
        yield
    finally:
        client.close()
