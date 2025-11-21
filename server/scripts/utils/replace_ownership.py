import asyncio

from app.accounts.documents import Account
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.organizations.documents import OrganizationMember
from beanie.operators import In
from bson import ObjectId
from pymongo import AsyncMongoClient
from pymongo.errors import DuplicateKeyError

USER_IDS_TO_REMOVE = [
    ObjectId("68de28fcf2391d61b9df6832"),
    ObjectId("688ee181278cfe4ca18c4f8d"),
]

USER_ID_TO_REPLACE_WITH = ObjectId("68524327bfd216ca00d64d99")


async def replace_ownership() -> None:
    await initialize_database(
        get_settings(DatabaseSettings).default_database_name,
        db_client=AsyncMongoClient(str(get_settings(DatabaseSettings).database_url)),
    )

    members = await OrganizationMember.find(
        In(OrganizationMember.account.id, USER_IDS_TO_REMOVE)
    ).to_list()

    replacement_account = await Account.find_one(Account.id == USER_ID_TO_REPLACE_WITH)

    for member in members:
        existing_replacement_user = await OrganizationMember.find_one(
            OrganizationMember.account.ref.id == USER_ID_TO_REPLACE_WITH,
            OrganizationMember.organization.ref.id == member.organization.ref.id,
        )

        if existing_replacement_user is None:
            try:
                await OrganizationMember(
                    account=USER_ID_TO_REPLACE_WITH,
                    organization=member.organization.ref.id,
                    account_full_name=replacement_account.full_name,
                    role="admin",
                ).insert()
                print(f"Added replacement user to org {member.organization.ref.id}")
            except DuplicateKeyError:
                print(
                    f"Replacement user already exists in org {member.organization.ref.id}"
                )
        else:
            if existing_replacement_user.role != "admin":
                existing_replacement_user.role = "admin"
                await existing_replacement_user.save()
                print(
                    f"Updated replacement user to admin in org {member.organization.ref.id}"
                )

        await member.delete()
        print(f"Removed {member.account.ref.id} from org {member.organization.ref.id}")


# Run the async function
if __name__ == "__main__":
    asyncio.run(replace_ownership())
