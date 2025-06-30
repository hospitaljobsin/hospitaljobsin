import hashlib
import secrets
import string
from datetime import UTC, date, datetime, timedelta

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2
from strawberry import UNSET

from app.base.models import GeoObject
from app.core.constants import (
    EMAIL_VERIFICATION_EXPIRES_IN,
    EMAIL_VERIFICATION_TOKEN_LENGTH,
    AuthProvider,
)
from app.core.geocoding import BaseLocationService

from .documents import (
    Account,
    Certification,
    Education,
    EmailVerificationToken,
    Gender,
    Language,
    License,
    Location,
    MaritalStatus,
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
    def __init__(self, location_service: BaseLocationService) -> None:
        self._location_service = location_service

    async def create(self, account: Account) -> Profile:
        """Create a new profile."""
        profile = Profile(
            account=account,
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
            headline=None,
        )
        await profile.insert()
        account.profile = profile
        await account.save()
        return profile

    def _calculate_total_work_experience(self, profile: Profile) -> float:
        return sum(
            [
                (
                    (
                        work_experience.completed_at - work_experience.started_at
                    ).total_seconds()
                    if work_experience.completed_at
                    else (
                        datetime.now(UTC).date() - work_experience.started_at
                    ).total_seconds()
                )
                / (365 * 24 * 60 * 60)
                for work_experience in profile.work_experience
            ]
        )

    async def update(
        self,
        profile: Profile,
        *,
        gender: Gender | None = UNSET,
        date_of_birth: date | None = UNSET,
        address: str | None = UNSET,
        marital_status: MaritalStatus | None = UNSET,
        category: str | None = UNSET,
        locations_open_to_work: list[str] = UNSET,
        open_to_relocation_anywhere: bool = UNSET,
        education: list[Education] = UNSET,
        licenses: list[License] = UNSET,
        languages: list[Language] = UNSET,
        job_preferences: list[str] = UNSET,
        work_experience: list[WorkExperience] = UNSET,
        salary_expectations: SalaryExpectations = UNSET,
        certifications: list[Certification] = UNSET,
        professional_summary: str | None = UNSET,
        headline: str | None = UNSET,
    ) -> Profile:
        """Update a profile with new fields."""
        if gender is not UNSET:
            profile.gender = gender
        if date_of_birth is not UNSET:
            profile.date_of_birth = date_of_birth
        if address is not UNSET:
            profile.address = address
        if marital_status is not UNSET:
            profile.marital_status = marital_status
        if category is not UNSET:
            profile.category = category
        if locations_open_to_work is not UNSET:
            # Build a lookup for existing locations by name for O(1) access
            existing_locations_by_name = {
                loc.name: loc for loc in profile.locations_open_to_work
            }
            updated_locations: list[Location] = []
            for location_name in locations_open_to_work:
                if location_name in existing_locations_by_name:
                    # Reuse the existing geocoded Location object
                    updated_locations.append(existing_locations_by_name[location_name])
                else:
                    # Geocode and add if successful
                    result = await self._location_service.geocode(location_name)
                    if result is not None:
                        updated_locations.append(
                            Location(
                                name=location_name,
                                geo=GeoObject(
                                    type="Point",
                                    coordinates=(result.longitude, result.latitude),
                                ),
                            )
                        )
            profile.locations_open_to_work = updated_locations
        if open_to_relocation_anywhere is not UNSET:
            profile.open_to_relocation_anywhere = open_to_relocation_anywhere
        if education is not UNSET:
            profile.education = education
        if licenses is not UNSET:
            profile.licenses = licenses
        if languages is not UNSET:
            profile.languages = languages
        if job_preferences is not UNSET:
            profile.job_preferences = job_preferences
        if work_experience is not UNSET:
            profile.work_experience = work_experience
            profile.total_work_experience_years = self._calculate_total_work_experience(
                profile
            )
        if salary_expectations is not UNSET:
            profile.salary_expectations = salary_expectations
        if certifications is not UNSET:
            profile.certifications = certifications
        if professional_summary is not UNSET:
            profile.professional_summary = professional_summary
        if headline is not UNSET:
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

    async def get_profiles_by_ids(self, profile_ids: list[ObjectId]) -> list[Profile]:
        """Get multiple profiles by IDs."""
        return await Profile.find(In(Profile.id, profile_ids)).to_list()
