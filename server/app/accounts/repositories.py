import hashlib
import secrets
import string
from datetime import UTC, datetime, timedelta
from typing import Literal

from beanie import PydanticObjectId
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
)

from .documents import (
    Account,
    AnalyticsPreference,
    EmailVerificationToken,
    PhoneNumberVerificationToken,
    TermsAndPolicy,
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
