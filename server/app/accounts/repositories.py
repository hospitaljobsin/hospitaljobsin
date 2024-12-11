from datetime import date

from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2

from .documents import (
    Account,
    Address,
    CurrentJob,
    Education,
    Links,
    Preferences,
    Profile,
)


class AccountRepo:
    async def create(
        self,
        email: str,
        password: str,
    ) -> Account:
        """Create a new account."""
        account = Account(
            email=email,
            password_hash=self.hash_password(
                password=password,
            ),
        )

        return await account.insert()

    @staticmethod
    def hash_password(password: str) -> str:
        return argon2.hash(password)

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        return argon2.verify(password, password_hash)

    async def get(self, account_id: ObjectId) -> Account | None:
        """Get account by ID."""
        return await Account.get(account_id)

    async def get_by_email(self, email: str) -> Account | None:
        """Get account by email."""
        return await Account.find_one(
            Account.email == email,
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


class ProfileRepo:
    async def create(
        self,
        user_id: str,
        gender: str,
        date_of_birth: date,
        address: Address | None,
        is_differently_abled: bool,
        category: str | None,
        education: list[Education] | None,
        current_job: CurrentJob | None,
        total_job_experience: float | None,
        preferences: Preferences | None,
        links: Links | None,
    ) -> Profile:
        """Create a new profile."""
        profile = Profile(
            user_id=user_id,
            gender=gender,
            date_of_birth=date_of_birth,
            address=address,
            is_differently_abled=is_differently_abled,
            category=category,
            education=education,
            current_job=current_job,
            total_job_experience=total_job_experience,
            preferences=preferences,
            links=links,
        )

        return await profile.insert()

    async def get(self, profile_id: str) -> Profile | None:
        """Get profile by ID."""
        return await Profile.get(profile_id)

    async def get_by_user_id(self, user_id: str) -> Profile | None:
        """Get profile by user ID."""
        return await Profile.find_one(Profile.user_id == user_id)

    async def delete(self, profile: Profile) -> None:
        """Delete a profile by ID."""
        await profile.delete()
