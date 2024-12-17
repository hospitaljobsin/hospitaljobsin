from contextlib import asynccontextmanager

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.accounts.documents import Account, EmailVerification, Profile
from app.auth.documents import Session
from app.companies.documents import Company, Job, SavedJob


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
                EmailVerification,
            ],
        )
        yield
    finally:
        client.close()
