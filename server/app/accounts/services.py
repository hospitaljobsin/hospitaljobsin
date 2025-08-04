from typing import Literal
import uuid
from datetime import UTC, date, datetime, timedelta

import phonenumbers
import strawberry
from result import Err, Ok, Result
from strawberry import UNSET
from types_aiobotocore_s3 import S3Client

from app.accounts.agents.profile_parser import ProfileParserAgent
from app.accounts.documents import (
    Account,
    Education,
    Language,
    License,
    PhoneNumberVerificationToken,
    Profile,
    TermsAndPolicy,
    WorkExperience,
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
    ProfileRepo,
)
from app.config import AuthSettings, AWSSettings
from app.core.messages import BaseMessageSender
from app.core.ocr import BaseOCRClient
from app.jobs.repositories import JobApplicantRepo
from app.organizations.repositories import OrganizationMemberRepo
from app.core.constants import TERMS_AND_POLICY_LATEST_VERSION


class AccountService:
    def __init__(
        self,
        account_repo: AccountRepo,
        organization_member_repo: OrganizationMemberRepo,
        phone_number_verification_token_repo: PhoneNumberVerificationTokenRepo,
        job_applicant_repo: JobApplicantRepo,
        s3_client: S3Client,
        aws_settings: AWSSettings,
        settings: AuthSettings,
        message_sender: BaseMessageSender,
    ) -> None:
        self._account_repo = account_repo
        self._organization_member_repo = organization_member_repo
        self._phone_number_verification_token_repo = (
            phone_number_verification_token_repo
        )
        self._job_applicant_repo = job_applicant_repo
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

    async def update(
        self,
        account: Account,
        full_name: str = strawberry.UNSET,
        avatar_url: str | None = strawberry.UNSET,
    ) -> Ok[Account]:
        """Update the given account."""
        await self._account_repo.update(
            account=account, full_name=full_name, avatar_url=avatar_url
        )
        # update denormalized full_name in organization members
        await self._organization_member_repo.update_all(
            account=account, full_name=full_name
        )
        # update denormalized full_name in job applicants
        await self._job_applicant_repo.update_all(account=account, full_name=full_name)
        return Ok(account)

    async def update_terms_and_policy(
        self, account: Account, type: Literal["acceptance", "rejection"]
    ) -> Ok[Account]:
        """Update the terms and policy."""
        await self._account_repo.update(
            account=account,
            terms_and_policy=TermsAndPolicy(
                type=type,
                updated_at=datetime.now(UTC),
                version=TERMS_AND_POLICY_LATEST_VERSION,
            ),
        )
        return Ok(account)

    async def request_phone_number_verification_token(
        self, account: Account, phone_number: str
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
        await self._account_repo.update(account=account, phone_number=None)
        return Ok(account)


class ProfileService:
    def __init__(
        self,
        profile_repo: ProfileRepo,
        account_repo: AccountRepo,
    ) -> None:
        self._profile_repo = profile_repo
        self._account_repo = account_repo

    async def update_personal_details(
        self,
        account: Account,
        gender: str | None,
        date_of_birth: date | None,
        marital_status: str | None,
        category: str | None,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
        )

        return Ok(account)

    async def update_languages(
        self,
        account: Account,
        languages: list[Language],
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            languages=languages,
        )

        return Ok(account)

    async def update_location_preferences(
        self,
        *,
        account: Account,
        locations_open_to_work: list[str],
        open_to_relocation_anywhere: bool,
        address: str | None,
    ) -> Ok[Account]:
        """Update the user's location preferences, including address."""
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            locations_open_to_work=locations_open_to_work,
            open_to_relocation_anywhere=open_to_relocation_anywhere,
            address=address,
        )
        return Ok(account)

    async def update_education(
        self,
        account: Account,
        education: list[Education],
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            education=education,
        )

        return Ok(account)

    async def update_experience(
        self,
        account: Account,
        work_experience: list[WorkExperience],
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            work_experience=work_experience,
        )

        return Ok(account)

    async def update_certifications(
        self,
        account: Account,
        certifications: list,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            certifications=certifications,
        )

        return Ok(account)

    async def update_licenses(
        self,
        account: Account,
        licenses: list,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            licenses=licenses,
        )

        return Ok(account)

    async def update_about_me(
        self,
        account: Account,
        professional_summary: str | None,
        headline: str | None,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(
                account=account, profile=existing_profile
            )

        await self._profile_repo.update(
            profile=existing_profile,
            professional_summary=professional_summary,
            headline=headline,
        )

        return Ok(account)


class ProfileParserService:
    def __init__(
        self,
        profile_parser_agent: ProfileParserAgent,
        ocr_client: BaseOCRClient,
        profile_repo: ProfileRepo,
        s3_client: S3Client,
        aws_settings: AWSSettings,
        account_repo: AccountRepo,
    ) -> None:
        self._profile_parser_agent = profile_parser_agent
        self._ocr_client = ocr_client
        self._profile_repo = profile_repo
        self._s3_client = s3_client
        self._aws_settings = aws_settings
        self._account_repo = account_repo

    async def generate_presigned_url(self, content_type: str) -> Ok[tuple[str, str]]:
        """Generate a presigned URL for a document."""
        file_key = f"autofill-profiles/{uuid.uuid4()}"
        presigned_url = await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._aws_settings.s3_bucket_name,
                "Key": file_key,
                "ContentType": content_type,
            },
            ExpiresIn=3600,
            HttpMethod="PUT",
        )
        return Ok((presigned_url, file_key))

    async def parse_profile_document(
        self,
        *,
        file_key: str,
        account: Account,
        overwrite: bool,
    ) -> Ok[Profile]:
        """Parse a profile document into structured data."""
        ocr_texts = await self._ocr_client(file_key)

        result = await self._profile_parser_agent.run(
            f"OCR text:\n{'\n'.join(ocr_texts)}"
        )

        profile_output = result.output
        profile = await self._profile_repo.get_by_account(account)
        if profile is None:
            profile = await self._profile_repo.create(account)
            await self._account_repo.update_profile(account=account, profile=profile)

        if overwrite:
            profile = await self._profile_repo.update(
                profile=profile,
                address=profile_output.address,
                date_of_birth=profile_output.date_of_birth,
                gender=profile_output.gender,
                marital_status=profile_output.marital_status,
                category=profile_output.category,
                open_to_relocation_anywhere=profile_output.open_to_relocation_anywhere,
                locations_open_to_work=profile_output.locations_open_to_work,
                education=profile_output.education,
                licenses=[
                    License(
                        **partial_license.model_dump(), verification_status="pending"
                    )
                    for partial_license in profile_output.licenses
                ],
                languages=profile_output.languages,
                job_preferences=profile_output.job_preferences,
                work_experience=profile_output.work_experience,
                salary_expectations=profile_output.salary_expectations,
                certifications=profile_output.certifications,
                professional_summary=profile_output.professional_summary,
                headline=profile_output.headline,
            )
        else:
            # add the non null fields to the profile
            profile = await self._profile_repo.update(
                profile=profile,
                address=profile_output.address if profile_output.address else UNSET,
                date_of_birth=profile_output.date_of_birth
                if profile_output.date_of_birth
                else UNSET,
                gender=profile_output.gender if profile_output.gender else UNSET,
                marital_status=profile_output.marital_status
                if profile_output.marital_status
                else UNSET,
                category=profile_output.category if profile_output.category else UNSET,
                open_to_relocation_anywhere=profile_output.open_to_relocation_anywhere
                if profile_output.open_to_relocation_anywhere
                else UNSET,
                locations_open_to_work=profile_output.locations_open_to_work
                if profile_output.locations_open_to_work
                else UNSET,
                education=profile_output.education
                if profile_output.education
                else UNSET,
                licenses=[
                    License(
                        **partial_license.model_dump(), verification_status="pending"
                    )
                    for partial_license in profile_output.licenses
                ]
                if profile_output.licenses
                else UNSET,
                languages=profile_output.languages
                if profile_output.languages
                else UNSET,
                job_preferences=profile_output.job_preferences
                if profile_output.job_preferences
                else UNSET,
                work_experience=profile_output.work_experience
                if profile_output.work_experience
                else UNSET,
                salary_expectations=profile_output.salary_expectations
                if profile_output.salary_expectations
                else UNSET,
                certifications=profile_output.certifications
                if profile_output.certifications
                else UNSET,
                professional_summary=profile_output.professional_summary
                if profile_output.professional_summary
                else UNSET,
                headline=profile_output.headline if profile_output.headline else UNSET,
            )
        return Ok(profile)
