import hashlib
import secrets
import string
from datetime import UTC, date, datetime, timedelta

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2

from app.core.constants import (
    EMAIL_VERIFICATION_EXPIRES_IN,
    EMAIL_VERIFICATION_TOKEN_LENGTH,
    AuthProvider,
)

from .documents import (
    Account,
    Certification,
    Education,
    EmailVerificationToken,
    Language,
    License,
    Profile,
    SalaryExpectations,
    WorkExperience,
)


class AccountRepo:
    async def create(
        self,
        email: str,
        full_name: str,
        auth_providers: list[AuthProvider],
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
            if password is not None
            else None,
            updated_at=None,
            profile=None,
            auth_providers=auth_providers,
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
        """Get multiple accounts by IDs."""
        accounts = await Account.find(In(Account.id, account_ids)).to_list()
        account_by_id = {account.id: account for account in accounts}

        return [
            account_by_id.get(PydanticObjectId(account_id))
            for account_id in account_ids
        ]

    async def update(self, account: Account, full_name: str) -> Account:
        """Update the given account."""
        account.full_name = full_name
        return await account.save()

    async def update_profile(self, account: Account, profile: Profile) -> Account:
        """Update the given account's profile."""
        account.profile = profile  # type: ignore[assignment]
        return await account.save()

    async def update_auth_providers(
        self,
        account: Account,
        auth_providers: list[AuthProvider],
    ) -> Account:
        """Update the given account."""
        account.auth_providers = auth_providers
        return await account.save()

    async def set_two_factor_secret(
        self, account: Account, totp_secret: str
    ) -> Account:
        """Set 2fa secret for the given account."""
        account.two_factor_secret = totp_secret
        return await account.save()

    async def delete_two_factor_secret(self, account: Account) -> Account:
        """Delete 2fa secret for the given account."""
        account.two_factor_secret = None
        return await account.save()

    async def update_password(self, account: Account, password: str) -> Account:
        """Update the given account's password."""
        if account.password_hash is None:
            # account initially had no password
            account.auth_providers.append("password")
        account.password_hash = self.hash_password(password)
        return await account.save()

    async def delete_password(self, account: Account) -> Account:
        """Delete the given account's password."""
        account.password_hash = None
        account.auth_providers.remove("password")
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
            expires_at=datetime.now(UTC)
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
            secrets.choice(string.ascii_uppercase + string.digits)
            for _ in range(EMAIL_VERIFICATION_TOKEN_LENGTH)
        )

    @staticmethod
    def hash_verification_token(token: str) -> str:
        """Hash verification token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()  # noqa: S324


class ProfileRepo:
    async def create(self, account: Account) -> Profile:
        """Create a new profile."""
        profile = Profile(
            gender=None,
            date_of_birth=None,
            address="",
            marital_status=None,
            category=None,
            locations_open_to_work=[],
            open_to_relocation_anywhere=False,
            education=[],
            licenses=[],
            languages=[],
            job_preferences=[],
            work_experience=[],
            salary_expectations=None,
            certifications=[],
            professional_summary=None,
        )
        await profile.insert()
        account.profile = profile
        await account.save()
        return profile

    async def update(
        self,
        profile: Profile,
        *,
        gender: str | None = None,
        date_of_birth: date | None = None,
        address: str | None = None,
        marital_status: str | None = None,
        category: str | None = None,
        locations_open_to_work: list[str] | None = None,
        open_to_relocation_anywhere: bool | None = None,
        education: list[Education] | None = None,
        licenses: list[License] | None = None,
        languages: list[Language] | None = None,
        job_preferences: list[str] | None = None,
        work_experience: list[WorkExperience] | None = None,
        salary_expectations: SalaryExpectations | None = None,
        certifications: list[Certification] | None = None,
        professional_summary: str | None = None,
        headline: str | None = None,
    ) -> Profile:
        """Update a profile with new fields."""
        if gender is not None:
            profile.gender = gender
        if date_of_birth is not None:
            profile.date_of_birth = date_of_birth
        if address is not None:
            profile.address = address
        if marital_status is not None:
            profile.marital_status = marital_status
        if category is not None:
            profile.category = category
        if locations_open_to_work is not None:
            profile.locations_open_to_work = locations_open_to_work
        if open_to_relocation_anywhere is not None:
            profile.open_to_relocation_anywhere = open_to_relocation_anywhere
        if education is not None:
            profile.education = education
        if licenses is not None:
            profile.licenses = licenses
        if languages is not None:
            profile.languages = languages
        if job_preferences is not None:
            profile.job_preferences = job_preferences
        if work_experience is not None:
            profile.work_experience = work_experience
        if salary_expectations is not None:
            profile.salary_expectations = salary_expectations
        if certifications is not None:
            profile.certifications = certifications
        if professional_summary is not None:
            profile.professional_summary = professional_summary
        if headline is not None:
            profile.headline = headline
        profile.updated_at = datetime.now(UTC)
        return await profile.save(link_rule=WriteRules.WRITE)

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
        if account.profile is None:
            return None
        # If already loaded as a Profile instance
        if isinstance(account.profile, Profile):
            return account.profile
        # If it's a Link, fetch the Profile document
        await account.fetch_link(Account.profile)
        if isinstance(account.profile, Profile):
            return account.profile
        return None

    async def delete(self, profile: Profile) -> None:
        """Delete a profile by ID."""
        await profile.delete()

    async def filter_profiles(
        self,
        *,
        gender: str | None = None,
        marital_status: str | None = None,
        category: str | None = None,
        min_age: int | None = None,
        max_age: int | None = None,
        locations: list[str] | None = None,
        open_to_relocation: bool | None = None,
        min_experience_years: int | None = None,
        languages: list[str] | None = None,
        min_salary: int | None = None,
        max_salary: int | None = None,
        job_preferences: list[str] | None = None,
        limit: int = 10,
    ) -> list[Profile]:
        """Filter profiles based on given criteria."""
        query = {}

        # Basic filters
        if gender:
            query["gender"] = gender
        if marital_status:
            query["marital_status"] = marital_status
        if category:
            query["category"] = category

        # Age filter
        if min_age or max_age:
            age_query = {}
            if min_age:
                max_date = date.today().replace(year=date.today().year - min_age)
                age_query["$lte"] = max_date
            if max_age:
                min_date = date.today().replace(year=date.today().year - max_age - 1)
                age_query["$gte"] = min_date
            if age_query:
                query["date_of_birth"] = age_query

        # Location filters
        if locations:
            query["locations_open_to_work"] = {"$in": locations}
        if open_to_relocation is not None:
            query["open_to_relocation_anywhere"] = open_to_relocation

        # Experience filter
        if min_experience_years:
            min_date = date.today().replace(
                year=date.today().year - min_experience_years
            )
            query["work_experience.started_at"] = {"$lte": min_date}

        # Language filter
        if languages:
            query["languages.name"] = {"$in": languages}

        # Salary filter
        if min_salary or max_salary:
            salary_query = {}
            if min_salary:
                salary_query["$gte"] = min_salary
            if max_salary:
                salary_query["$lte"] = max_salary
            if salary_query:
                query["salary_expectations.preferred_monthly_salary_inr"] = salary_query

        # Job preferences filter
        if job_preferences:
            query["job_preferences"] = {"$in": job_preferences}

        # Execute query with limit
        return await Profile.find(query).limit(limit).to_list()

    async def get_profiles_by_ids(self, profile_ids: list[ObjectId]) -> list[Profile]:
        """Get multiple profiles by IDs."""
        return await Profile.find(In(Profile.id, profile_ids)).to_list()
