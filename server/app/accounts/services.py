import uuid
from datetime import UTC, datetime, timedelta
from typing import Annotated, Literal

import phonenumbers
from fastapi import Response
from pydantic import Field, HttpUrl, StringConstraints, validate_call
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client

from app.accounts.documents import (
    Account,
    AnalyticsPreference,
    PhoneNumberVerificationToken,
    TermsAndPolicy,
)
from app.accounts.exceptions import (
    InvalidPhoneNumberError,
    InvalidPhoneNumberVerificationTokenError,
    PhoneNumberAlreadyExistsError,
    PhoneNumberDoesNotExistError,
    PhoneNumberVerificationTokenCooldownError,
)
from app.accounts.repositories import (
    AccountRepo,
    PhoneNumberVerificationTokenRepo,
)
from app.config import AuthSettings, AWSSettings
from app.core.constants import (
    TERMS_AND_POLICY_LATEST_VERSION,
)
from app.core.messages import BaseMessageSender


class AccountService:
    def __init__(
        self,
        account_repo: AccountRepo,
        phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
        s3_client: S3Client,
        aws_settings: AWSSettings,
        settings: AuthSettings,
        message_sender: BaseMessageSender,
    ) -> None:
        self._account_repo = account_repo
        self._phone_number_verification_token_repo = (
            phone_number_verification_token_repo
        )
        self._s3_client = s3_client
        self._aws_settings = aws_settings
        self._settings = settings
        self._message_sender = message_sender

    async def create_profile_picture_presigned_url(self, content_type: str) -> str:
        """Create a presigned URL for uploading an account's profile picture."""
        return await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._aws_settings.s3_bucket_name,
                "Key": f"profile-pictures/{uuid.uuid4()}",
                "ContentType": content_type,
            },
            ExpiresIn=3600,
            HttpMethod="PUT",
        )

    @validate_call()
    async def update(
        self,
        account: Annotated[Account, Field(exclude=True)],
        full_name: Annotated[
            str,
            StringConstraints(
                max_length=100,
                min_length=1,
                strip_whitespace=True,
            ),
        ],
        avatar_url: HttpUrl | None = None,
    ) -> Ok[Account]:
        """Update the given account."""
        await self._account_repo.update(
            account=account,
            full_name=full_name,
            avatar_url=str(avatar_url),
        )
        return Ok(account)

    async def update_analytics_preference(
        self,
        account: Account | None,
        preference_type: Literal["acceptance", "rejection"],
        response: Response,
    ) -> Ok[Account | None]:
        """Update the analytics preference."""
        if account is not None:
            await self._account_repo.update(
                account=account,
                analytics_preference=AnalyticsPreference(
                    type=preference_type,
                    updated_at=datetime.now(UTC),
                ),
            )
        # Set the consent cookie with appropriate settings
        response.set_cookie(
            self._settings.analytics_preference_cookie_name,
            "yes" if preference_type == "acceptance" else "no",
            max_age=365 * 24 * 60 * 60,  # 1 year
            path="/",
            httponly=False,  # Allow client-side access
            samesite="lax",
            secure=self._settings.session_cookie_secure,  # Secure in production
            domain=self._settings.session_cookie_domain,
        )
        return Ok(account)

    async def update_terms_and_policy(
        self, account: Account, preference_type: Literal["acceptance", "rejection"]
    ) -> Ok[Account]:
        """Update the terms and policy."""
        await self._account_repo.update(
            account=account,
            terms_and_policy=TermsAndPolicy(
                type=preference_type,
                updated_at=datetime.now(UTC),
                version=TERMS_AND_POLICY_LATEST_VERSION,
            ),
        )
        return Ok(account)

    async def request_phone_number_verification_token(
        self, phone_number: str
    ) -> Result[
        int,
        InvalidPhoneNumberError
        | PhoneNumberAlreadyExistsError
        | PhoneNumberVerificationTokenCooldownError,
    ]:
        try:
            valid_phone_number = phonenumbers.parse(phone_number)
        except phonenumbers.NumberParseException:
            return Err(InvalidPhoneNumberError())
        else:
            if not phonenumbers.is_valid_number_for_region(
                valid_phone_number, region_code="IN"
            ):
                # only accept Indian numbers
                return Err(InvalidPhoneNumberError())

        formatted_number = phonenumbers.format_number(
            valid_phone_number, phonenumbers.PhoneNumberFormat.E164
        )
        if (
            await self._account_repo.get_by_phone_number(phone_number=formatted_number)
            is not None
        ):
            return Err(PhoneNumberAlreadyExistsError())

        existing_phone_number_verification = (
            await self._phone_number_verification_token_repo.get_by_phone_number(
                phone_number=formatted_number
            )
        )

        if existing_phone_number_verification is not None:
            if not self._is_phone_number_verification_token_cooled_down(
                existing_phone_number_verification
            ):
                return Err(
                    PhoneNumberVerificationTokenCooldownError(
                        remaining_seconds=self._phone_number_verification_token_cooldown_remaining_seconds(
                            existing_phone_number_verification
                        )
                    )
                )
            await self._phone_number_verification_token_repo.delete(
                existing_phone_number_verification
            )

        (
            verification_token,
            phone_number_verification,
        ) = await self._phone_number_verification_token_repo.create(
            phone_number=formatted_number
        )

        # send phone number verification token to the user
        await self._message_sender.send_otp_message(
            receiver=valid_phone_number,
            otp=verification_token,
        )

        return Ok(
            self._phone_number_verification_token_cooldown_remaining_seconds(
                phone_number_verification
            )
        )

    def _is_phone_number_verification_token_cooled_down(
        self, token: PhoneNumberVerificationToken
    ) -> bool:
        """Check if a phone number verification token is cooled down."""
        current_time = datetime.now(UTC)
        # Ensure generation_time is aware (assuming it's stored in UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.phone_number_verification_token_cooldown
        )
        return current_time >= cooldown_time

    def _phone_number_verification_token_cooldown_remaining_seconds(
        self, token: PhoneNumberVerificationToken
    ) -> int:
        """
        Calculate remaining cooldown seconds for the phone number verification token.

        Returns 0 if cooldown has passed or token is invalid.
        """
        if self._is_phone_number_verification_token_cooled_down(token):
            return 0

        current_time = datetime.now(UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.phone_number_verification_token_cooldown
        )

        remaining = (cooldown_time - current_time).total_seconds()
        return max(0, int(remaining))  # Ensure non-negative integer

    async def update_phone_number(
        self,
        account: Account,
        phone_number: str,
        phone_number_verification_token: str,
    ) -> Result[
        Account, InvalidPhoneNumberVerificationTokenError | InvalidPhoneNumberError
    ]:
        """Update the given account's phone number."""
        try:
            valid_phone_number = phonenumbers.parse(phone_number)
        except phonenumbers.NumberParseException:
            return Err(InvalidPhoneNumberError())
        else:
            if not phonenumbers.is_valid_number_for_region(
                valid_phone_number, region_code="IN"
            ):
                # only accept Indian numbers
                return Err(InvalidPhoneNumberError())

        formatted_number = phonenumbers.format_number(
            valid_phone_number, phonenumbers.PhoneNumberFormat.E164
        )

        existing_verification_token = (
            await self._phone_number_verification_token_repo.get(
                verification_token=phone_number_verification_token
            )
        )

        if (
            existing_verification_token is None
            or existing_verification_token.phone_number != formatted_number
            or existing_verification_token.is_expired
        ):
            # get phone number verification token and ensure phone number matches
            return Err(InvalidPhoneNumberVerificationTokenError())

        await self._account_repo.update(
            account=account,
            phone_number=formatted_number,
        )
        return Ok(account)

    async def remove_phone_number(
        self, account: Account
    ) -> Result[Account, PhoneNumberDoesNotExistError]:
        """Remove the given account's phone number."""
        if account.phone_number is None:
            return Err(PhoneNumberDoesNotExistError())
        await self._account_repo.update(
            account=account,
            phone_number=None,
        )
        return Ok(account)
