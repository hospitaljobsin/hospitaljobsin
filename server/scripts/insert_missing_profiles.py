import asyncio

from app.accounts.documents import Account
from app.accounts.repositories import ProfileRepo
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database


async def insert_missing_profiles():
    async with initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    ):
        accounts = await Account.find_all().to_list()
        count_created = 0
        for account in accounts:
            if account.profile is None:
                await ProfileRepo().create(account=account)


if __name__ == "__main__":
    asyncio.run(insert_missing_profiles())
