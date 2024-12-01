from app.companies.documents import Company
from app.jobs.documents import Job
from motor.motor_asyncio import AsyncIOMotorClient

from beanie import init_beanie


async def intialize_database(database_url: str) -> None:
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        database_url,
        connectTimeoutMS=1000,
        socketTimeoutMS=1000,
        serverSelectionTimeoutMS=1000,
    )
    await init_beanie(
        database=client.get_default_database(),
        document_models=[
            Company,
            Job,
        ],
    )
