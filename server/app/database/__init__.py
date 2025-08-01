import sentry_sdk
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.operations import SearchIndexModel
from structlog import get_logger

from app.accounts.documents import (
    Account,
    EmailVerificationToken,
    PhoneNumberVerificationToken,
    Profile,
)
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
from app.core.constants import (
    JOB_APPLICANT_EMBEDDING_DIMENSIONS,
    JOB_APPLICANT_EMBEDDING_INDEX_NAME,
    JOB_EMBEDDING_DIMENSIONS,
    JOB_EMBEDDING_INDEX_NAME,
)
from app.jobs.documents import (
    BaseJobMetric,
    CoreJobMetric,
    ImpressionJobMetric,
    Job,
    JobApplicant,
    JobApplicationForm,
    SavedJob,
)
from app.organizations.documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
    OrganizationVerificationRequest,
)

logger = get_logger()


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


async def create_search_indexes(
    client: AsyncIOMotorClient, default_database_name: str
) -> None:
    """Create search indexes for the database."""
    # TODO: only create indexes if they don't exist
    await (
        client.get_default_database(default=default_database_name)
        .get_collection(str(Job.get_settings().name))
        .create_search_index(
            model=SearchIndexModel(
                definition={
                    "fields": [
                        {
                            "type": "vector",
                            "path": "embedding",
                            "similarity": "dotProduct",
                            "numDimensions": JOB_EMBEDDING_DIMENSIONS,
                        },
                    ]
                },
                name=JOB_EMBEDDING_INDEX_NAME,
                type="vectorSearch",
            )
        )
    )
    await (
        client.get_default_database(default=default_database_name)
        .get_collection(str(JobApplicant.get_settings().name))
        .create_search_index(
            model=SearchIndexModel(
                definition={
                    "fields": [
                        {
                            "type": "vector",
                            "path": "profile_embedding",
                            "similarity": "dotProduct",
                            "numDimensions": JOB_APPLICANT_EMBEDDING_DIMENSIONS,
                        },
                    ]
                },
                name=JOB_APPLICANT_EMBEDDING_INDEX_NAME,
                type="vectorSearch",
            )
        )
    )


async def initialize_database(database_url: str, default_database_name: str) -> None:
    """Initialize the database."""
    with sentry_sdk.start_span(op="db.init", name="Initialize Database"):
        client: AsyncIOMotorClient = AsyncIOMotorClient(
            database_url,
            connectTimeoutMS=1000,
            socketTimeoutMS=1000,
            serverSelectionTimeoutMS=1000,
        )
        rebuild_models()
        await init_beanie(
            database=client.get_default_database(default=default_database_name),
            document_models=[
                Job,
                JobApplicant,
                JobApplicationForm,
                CoreJobMetric,
                ImpressionJobMetric,
                BaseJobMetric,
                Account,
                Profile,
                SavedJob,
                Session,
                EmailVerificationToken,
                PhoneNumberVerificationToken,
                PasswordResetToken,
                Organization,
                OrganizationMember,
                OrganizationVerificationRequest,
                WebAuthnCredential,
                WebAuthnChallenge,
                OAuthCredential,
                TwoFactorAuthenticationChallenge,
                RecoveryCode,
                TemporaryTwoFactorChallenge,
                OrganizationInvite,
            ],
        )
        await create_search_indexes(client, default_database_name)
