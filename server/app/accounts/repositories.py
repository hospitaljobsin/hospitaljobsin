import secrets
from datetime import date, datetime, timedelta

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2, sha256_crypt

from app.lib.constants import EMAIL_VERIFICATION_EXPIRES_IN

from .documents import (
    Account,
    Address,
    CurrentJob,
    EmailVerification,
    Language,
    Profile,
)


class AccountRepo:
    async def create(self, email: str, password: str, full_name: str) -> Account:
        """Create a new account."""
        account = Account(
            full_name=full_name,
            email=email,
            email_verified=False,
            password_hash=self.hash_password(
                password=password,
            ),
            has_onboarded=False,
            updated_at=None,
            profile=None,
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
        """Get multiple profiles by IDs."""
        profiles = await Account.find(In(Account.id, account_ids)).to_list()
        account_by_id = {account.id: account for account in profiles}

        return [
            account_by_id.get(PydanticObjectId(account_id))
            for account_id in account_ids
        ]


class EmailVerificationRepo:
    async def create(self, account_id: ObjectId) -> str:
        """Create a new email verification."""
        verification_token = self.generate_verification_token()
        email_verification = EmailVerification(
            account=account_id,
            verification_token_hash=self.hash_verification_token(
                token=verification_token,
            ),
            expires_at=datetime.now()
            + timedelta(
                seconds=EMAIL_VERIFICATION_EXPIRES_IN,
            ),
        )

        await email_verification.insert()
        return verification_token

    async def get(self, verification_token: str) -> EmailVerification | None:
        """Get an email verification by token."""
        return await EmailVerification.find_one(
            EmailVerification.verification_token_hash
            == self.hash_verification_token(verification_token)
        )

    @staticmethod
    def generate_verification_token() -> str:
        """Generate a new verification token."""
        return secrets.token_hex(8)

    @staticmethod
    def hash_verification_token(token: str) -> str:
        """Hash verification token."""
        return sha256_crypt.hash(token)


class ProfileRepo:
    async def create(self, account: Account) -> Profile:
        """Create a new profile."""
        profile = Profile(
            gender=None,
            date_of_birth=None,
            address=None,
            marital_status=None,
            category=None,
            languages=[],
            current_job=None,
            total_job_experience=None,
        )

        account.profile = profile

        await account.save(
            link_rule=WriteRules.WRITE,
        )

        return profile

    async def update(
        self,
        profile: Profile,
        gender: str | None = None,
        date_of_birth: date | None = None,
        address: Address | None = None,
        marital_status: str | None = None,
        languages: list[Language] = [],
        category: str | None = None,
        current_job: CurrentJob | None = None,
        total_job_experience: float | None = None,
    ) -> Profile:
        """update a profile."""
        profile.gender = gender
        profile.date_of_birth = date_of_birth
        profile.address = address
        profile.marital_status = marital_status
        profile.languages = languages
        profile.category = category
        profile.current_job = current_job
        profile.total_job_experience = total_job_experience

        return await profile.save(
            link_rule=WriteRules.WRITE,
        )

    async def get(self, profile_id: str) -> Profile | None:
        """Get profile by ID."""
        return await Profile.get(profile_id)

    async def get_many_by_ids(
        self, profile_ids: list[ObjectId]
    ) -> list[Profile | None]:
        """Get multiple profiles by IDs."""
        profiles = await Profile.find(In(Profile.id, profile_ids)).to_list()
        profile_by_id = {profile.id: profile for profile in profiles}

        return [
            profile_by_id.get(PydanticObjectId(profile_id))
            for profile_id in profile_ids
        ]

    async def get_by_account(self, account: Account) -> Profile | None:
        """Get profile by account ID."""
        await account.fetch_link(Account.profile)
        return account.profile

    async def delete(self, profile: Profile) -> None:
        """Delete a profile by ID."""
        await profile.delete()
