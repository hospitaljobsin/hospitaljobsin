from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2

from .documents import Account


class AccountRepo:
    async def create(
        self,
        username: str,
        email: str,
        password: str,
    ) -> Account:
        """Create a new account."""
        account = Account(
            username=username,
            email=email,
            password_hash=self.hash_password(password),
        )

        return await account.insert()

    @staticmethod
    def hash_password(password: str) -> str:
        return argon2.hash(password)

    async def get(self, account_id: ObjectId) -> Account | None:
        """Get account by ID."""
        return await Account.get(account_id)

    async def get_by_login(self, login: str) -> Account | None:
        """Get account by login."""
        if "@" in login:
            return await Account.find_one(
                Account.email == login,
            )
        return await Account.find_one(
            Account.username == login,
        )

    async def get_many_by_ids(
        self, account_ids: list[ObjectId]
    ) -> list[Account | None]:
        """Get multiple accounts by IDs."""
        accounts = await Account.find(In(Account.id, account_ids)).to_list()
        account_by_id = {account.id: account for account in accounts}

        return [
            account_by_id.get(PydanticObjectId(account_id))
            for account_id in account_ids
        ]

    async def delete(self, account: Account) -> None:
        """Delete a account by ID."""
        await account.delete()
