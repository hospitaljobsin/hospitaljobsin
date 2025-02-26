import hashlib
import random
import string
from datetime import date, datetime, timedelta

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2

from app.base.models import Address
from app.lib.constants import (
    EMAIL_VERIFICATION_EXPIRES_IN,
    EMAIL_VERIFICATION_TOKEN_LENGTH,
)

from .documents import (
    Account,
    CurrentJob,
    EmailVerificationToken,
    Language,
    Profile,
)


class AccountRepo:
    async def create(
        self,
        email: str,
        full_name: str,
        email_verified: bool = False,
        password: str | None = None,
        account_id: ObjectId | None = None,
    ) -> Account:
        """Create a new account."""
        account = Account(
            id=account_id,
            full_name=full_name,
            email=email,
            password_hash=self.hash_password(
                password=password,
            )
            if password
            else None,
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

    async def get(
        self,
        account_id: ObjectId,
        *,
        fetch_profile: bool = False,
    ) -> Account | None:
        """Get account by ID."""
        if fetch_profile:
            return await Account.get(
                account_id,
                fetch_links=True,
            )
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

    async def update(self, account: Account, full_name: str) -> Account:
        """Update the given account."""
        account.full_name = full_name
        return await account.save()

    async def update_password(self, account: Account, password: str) -> Account:
        """Update the given account's password."""
        account.password_hash = self.hash_password(password)
        return await account.save()


class EmailVerificationTokenRepo:
    async def create(self, email: str) -> tuple[str, EmailVerificationToken]:
        """Create a new email verification token."""
        verification_token = self.generate_verification_token()
        email_verification = EmailVerificationToken(
            email=email,
            token_hash=self.hash_verification_token(
                token=verification_token,
            ),
            expires_at=datetime.now()
            + timedelta(
                seconds=EMAIL_VERIFICATION_EXPIRES_IN,
            ),
        )

        await email_verification.insert()
        return verification_token, email_verification

    async def get(self, verification_token: str) -> EmailVerificationToken | None:
        """Get an email verification by token."""
        return await EmailVerificationToken.find_one(
            EmailVerificationToken.token_hash
            == self.hash_verification_token(verification_token)
        )

    async def get_by_email(self, email: str) -> EmailVerificationToken | None:
        """Get an email verification by email."""
        return await EmailVerificationToken.find_one(
            EmailVerificationToken.email == email
        )

    async def delete(self, email_verification: EmailVerificationToken) -> None:
        """Delete an email verification by ID."""
        await email_verification.delete()

    @staticmethod
    def generate_verification_token() -> str:
        """Generate a new verification token."""
        return "".join(
            random.choices(
                string.ascii_uppercase + string.digits,
                k=EMAIL_VERIFICATION_TOKEN_LENGTH,
            )
        )

    @staticmethod
    def hash_verification_token(token: str) -> str:
        """Hash verification token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()


class ProfileRepo:
    async def create(self, account: Account) -> Profile:
        """Create a new profile."""
        profile = Profile(
            gender=None,
            date_of_birth=None,
            address=Address(
                city=None,
                state=None,
                country=None,
                pincode=None,
                line1=None,
                line2=None,
            ),
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
        address: Address,
        gender: str | None = None,
        date_of_birth: date | None = None,
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
