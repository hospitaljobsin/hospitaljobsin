import hashlib
import secrets
import string
from datetime import UTC, date, datetime, timedelta
from typing import Literal

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId
from passlib.hash import argon2
from strawberry import UNSET

from app.core.constants import (
    EMAIL_VERIFICATION_EXPIRES_IN,
    EMAIL_VERIFICATION_TOKEN_LENGTH,
    PHONE_NUMBER_VERIFICATION_EXPIRES_IN,
    TERMS_AND_POLICY_LATEST_VERSION,
    AuthProvider,
    JobKindType,
    WorkModeType,
)
from app.geocoding.repositories import RegionRepo

from .documents import (
    Account,
    AnalyticsPreference,
    CareerProfile,
    Certification,
    Education,
    EmailVerificationToken,
    Gender,
    Language,
    License,
    MaritalStatus,
    PhoneNumberVerificationToken,
    Profile,
    TermsAndPolicy,
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
        analytics_preference: Literal[
            "acceptance", "rejection", "undecided"
        ] = "undecided",
        phone_number: str | None = None,
    ) -> Account:
        """Create a new account."""
        account = Account(
            id=account_id,
            full_name=full_name,
            email=email,
            phone_number=phone_number,
            password_hash=self.hash_password(
                password=password,
            )
            if password is not None
            else None,
            updated_at=None,
            profile=None,
            auth_providers=auth_providers,
            terms_and_policy=TermsAndPolicy(
                type="acceptance",
                updated_at=datetime.now(UTC),
                version=TERMS_AND_POLICY_LATEST_VERSION,
            ),
            analytics_preference=AnalyticsPreference(
                type=analytics_preference,
                updated_at=datetime.now(UTC),
            ),
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

    async def get_by_phone_number(self, phone_number: str) -> Account | None:
        """Get account by phone number."""
        return await Account.find_one(
            Account.phone_number == phone_number,
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

    async def update(
        self,
        account: Account,
        full_name: str = UNSET,
        avatar_url: str | None = UNSET,
        phone_number: str | None = UNSET,
        terms_and_policy: TermsAndPolicy = UNSET,
        analytics_preference: AnalyticsPreference = UNSET,
        whatsapp_job_alerts_enabled: bool = UNSET,
    ) -> Account:
        """Update the given account."""
        if full_name is not UNSET:
            account.full_name = full_name
        if avatar_url is not UNSET:
            account.avatar_url = avatar_url
        if phone_number is not UNSET:
            account.phone_number = phone_number
        if terms_and_policy is not UNSET:
            account.terms_and_policy = terms_and_policy
        if analytics_preference is not UNSET:
            account.analytics_preference = analytics_preference
        if whatsapp_job_alerts_enabled is not UNSET:
            account.whatsapp_job_alerts_enabled = whatsapp_job_alerts_enabled
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
        if "password" not in account.auth_providers:
            # account initially had no password
            new_providers = account.auth_providers.copy()
            new_providers.append("password")
            account.auth_providers = new_providers
        account.password_hash = self.hash_password(password)
        return await account.save()

    async def delete_password(self, account: Account) -> Account:
        """Delete the given account's password."""
        account.password_hash = None
        if "password" in account.auth_providers:
            account.auth_providers.remove("password")
        return await account.save()

    async def delete_avatar(self, account: Account) -> Account:
        """Delete the given account's avatar."""
        account.avatar_url = None
        return await account.save()

    async def delete(self, account: Account) -> None:
        """Delete an account by ID."""
        await account.delete()


class PhoneNumberVerificationTokenRepo:
    async def create(
        self, phone_number: str
    ) -> tuple[str, PhoneNumberVerificationToken]:
        """Create a new phone number verification token."""
        verification_token = self.generate_verification_token()
        phone_number_verification = PhoneNumberVerificationToken(
            phone_number=phone_number,
            token_hash=self.hash_verification_token(
                token=verification_token,
            ),
            expires_at=datetime.now(UTC)
            + timedelta(
                seconds=PHONE_NUMBER_VERIFICATION_EXPIRES_IN,
            ),
        )

        await phone_number_verification.insert()
        return verification_token, phone_number_verification

    async def get(self, verification_token: str) -> PhoneNumberVerificationToken | None:
        """Get a phone number verification by token."""
        return await PhoneNumberVerificationToken.find_one(
            PhoneNumberVerificationToken.token_hash
            == self.hash_verification_token(verification_token)
        )

    async def get_by_phone_number(
        self, phone_number: str
    ) -> PhoneNumberVerificationToken | None:
        """Get a phone number verification by phone number."""
        return await PhoneNumberVerificationToken.find_one(
            PhoneNumberVerificationToken.phone_number == phone_number
        )

    async def delete(
        self, phone_number_verification: PhoneNumberVerificationToken
    ) -> None:
        """Delete a phone number verification."""
        await phone_number_verification.delete()

    @staticmethod
    def generate_verification_token() -> str:
        """Generate a new verification token."""
        # FastSMS requires all characters to be digits
        return "".join(
            secrets.choice(string.digits)
            for _ in range(EMAIL_VERIFICATION_TOKEN_LENGTH)
        )

    @staticmethod
    def hash_verification_token(token: str) -> str:
        """Hash verification token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()  # noqa: S324


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
        """Delete an email verification."""
        await email_verification.delete()

    @staticmethod
    def generate_verification_token() -> str:
        """Generate a new verification token."""
        return "".join(
            secrets.choice(string.digits)
            for _ in range(EMAIL_VERIFICATION_TOKEN_LENGTH)
        )

    @staticmethod
    def hash_verification_token(token: str) -> str:
        """Hash verification token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()  # noqa: S324


class ProfileRepo:
    def __init__(self, region_repo: RegionRepo) -> None:
        self._region_repo = region_repo

    async def create(
        self,
        account: Account,
        gender: Gender | None = None,
        date_of_birth: date | None = None,
        address: str | None = None,
        marital_status: MaritalStatus | None = None,
        category: str | None = None,
        education: list[Education] = [],
        licenses: list[License] = [],
        languages: list[Language] = [],
        job_preferences: list[str] = [],
        work_experience: list[WorkExperience] = [],
        career_profile: CareerProfile | None = None,
        certifications: list[Certification] = [],
        professional_summary: str | None = None,
        headline: str | None = None,
        resume_url: str | None = None,
    ) -> Profile:
        """Create a new profile."""
        profile = Profile(
            gender=gender,
            date_of_birth=date_of_birth,
            address=address,
            marital_status=marital_status,
            category=category,
            education=education,
            licenses=licenses,
            languages=languages,
            job_preferences=job_preferences,
            work_experience=work_experience,
            career_profile=career_profile,
            certifications=certifications,
            professional_summary=professional_summary,
            headline=headline,
            resume_url=resume_url,
        )
        await profile.insert()
        account.profile = profile
        await account.save()
        return profile

    def _calculate_total_work_experience(
        self, work_experience: list[WorkExperience]
    ) -> float:
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
                for work_experience in work_experience
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
        education: list[Education] = UNSET,
        licenses: list[License] = UNSET,
        languages: list[Language] = UNSET,
        job_preferences: list[str] = UNSET,
        work_experience: list[WorkExperience] = UNSET,
        career_profile: CareerProfile | None = UNSET,
        certifications: list[Certification] = UNSET,
        professional_summary: str | None = UNSET,
        headline: str | None = UNSET,
        resume_url: str | None = UNSET,
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
                work_experience
            )
        if career_profile is not UNSET:
            profile.career_profile = career_profile
        if certifications is not UNSET:
            profile.certifications = certifications
        if professional_summary is not UNSET:
            profile.professional_summary = professional_summary
        if headline is not UNSET:
            profile.headline = headline
        if resume_url is not UNSET:
            profile.resume_url = resume_url
        profile.updated_at = datetime.now(UTC)
        return await profile.save(link_rule=WriteRules.WRITE)

    async def update_career_profile(
        self,
        profile: Profile,
        current_industry: str | None = UNSET,
        desired_job_types: list[JobKindType] = UNSET,
        desired_work_modes: list[WorkModeType] = UNSET,
        expected_salary: float | None = UNSET,
        locations_open_to_work: list[str] = UNSET,
        open_to_relocation_anywhere: bool = UNSET,
    ) -> Profile:
        career_profile = profile.career_profile or CareerProfile()

        if current_industry is not UNSET:
            career_profile.current_industry = current_industry
        if desired_job_types is not UNSET:
            career_profile.desired_job_types = desired_job_types
        if desired_work_modes is not UNSET:
            career_profile.desired_work_modes = desired_work_modes
        if expected_salary is not UNSET:
            career_profile.expected_salary = expected_salary
        if locations_open_to_work is not UNSET:
            career_profile.locations_open_to_work = locations_open_to_work
        if open_to_relocation_anywhere is not UNSET:
            career_profile.open_to_relocation_anywhere = open_to_relocation_anywhere

        return await self.update(profile, career_profile=career_profile)

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
