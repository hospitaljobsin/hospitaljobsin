import sentry_sdk
from beanie import init_beanie
from pymongo import AsyncMongoClient
from structlog import get_logger

from app.accounts.documents import (
    Account,
    EmailVerificationToken,
    PhoneNumberVerificationToken,
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

logger = get_logger()


async def initialize_database(
    default_database_name: str, db_client: AsyncMongoClient
) -> None:
    """Initialize the database."""
    with sentry_sdk.start_span(op="db.init", name="Initialize Database"):
        await init_beanie(
            database=db_client.get_database(name=default_database_name),
            document_models=[
                Account,
                Session,
                EmailVerificationToken,
                PhoneNumberVerificationToken,
                PasswordResetToken,
                WebAuthnCredential,
                WebAuthnChallenge,
                OAuthCredential,
                TwoFactorAuthenticationChallenge,
                RecoveryCode,
                TemporaryTwoFactorChallenge,
            ],
        )
