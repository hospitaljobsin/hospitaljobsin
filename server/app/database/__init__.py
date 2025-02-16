from contextlib import asynccontextmanager

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.accounts.documents import Account, EmailVerificationToken, Profile
from app.auth.documents import PasswordResetToken, Session
from app.companies.documents import Company, Job, SavedJob
from app.organizations.documents import Organization, OrganizationMember


@asynccontextmanager
async def initialize_database(database_url: str):
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        database_url,
        connectTimeoutMS=1000,
        socketTimeoutMS=1000,
        serverSelectionTimeoutMS=1000,
    )
    try:
        await init_beanie(
            database=client.get_default_database(),
            document_models=[
                Company,
                Job,
                Account,
                Profile,
                SavedJob,
                Session,
                EmailVerificationToken,
                PasswordResetToken,
                Organization,
                OrganizationMember,
            ],
        )
        yield
    finally:
        client.close()
