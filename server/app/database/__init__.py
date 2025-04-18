import urllib
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from shlex import quote
from urllib.parse import urlparse, urlunparse

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from structlog import get_logger

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

logger = get_logger()


def percent_encode_uri(uri: str) -> str:
    # Separate the URI into components
    parsed_uri = urlparse(uri)

    logger.info(f"Original URI: {uri}")
    logger.info(f"Parsed URI: {parsed_uri}")

    # Percent-encode the username and password if they exist
    username = quote(parsed_uri.username) if parsed_uri.username else ""
    password = quote(parsed_uri.password) if parsed_uri.password else ""

    # Rebuild the URI with percent-encoded username and password
    encoded_uri = parsed_uri._replace(
        netloc=f"{username}:{password}@{parsed_uri.hostname}",
        path=parsed_uri.path,
        query=parsed_uri.query,
        fragment=parsed_uri.fragment,
    )

    logger.info(f"Encoded URI: {encoded_uri}")

    # Rebuild the URI string
    return urlunparse(encoded_uri)


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
        urllib.parse.urlparse(database_url),
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
