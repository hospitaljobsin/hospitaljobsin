import uuid
from datetime import date

import fitz
from PIL.Image import Image
from result import Ok
from types_aiobotocore_s3 import S3Client

from app.accounts.agents.profile_parser import ProfileParserAgent
from app.accounts.documents import (
    Account,
    BaseProfile,
    Education,
    Language,
    WorkExperience,
)
from app.accounts.repositories import AccountRepo, ProfileRepo
from app.config import AWSSettings
from app.core.ocr import BaseOCRClient
from app.jobs.repositories import JobApplicantRepo
from app.organizations.repositories import OrganizationMemberRepo


class AccountService:
    def __init__(
        self,
        account_repo: AccountRepo,
        organization_member_repo: OrganizationMemberRepo,
        job_applicant_repo: JobApplicantRepo,
        s3_client: S3Client,
        aws_settings: AWSSettings,
    ) -> None:
        self._account_repo = account_repo
        self._organization_member_repo = organization_member_repo
        self._job_applicant_repo = job_applicant_repo
        self._s3_client = s3_client
        self._aws_settings = aws_settings

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
        self, account: Account, full_name: str, avatar_url: str | None
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
        self, profile_parser_agent: ProfileParserAgent, ocr_client: BaseOCRClient
    ) -> None:
        self._profile_parser_agent = profile_parser_agent
        self._ocr_client = ocr_client

    async def parse_profile_document(self, document: bytes) -> Ok[BaseProfile]:
        """Parse a profile document into structured data."""
        pdf_document = fitz.open(stream=document, filetype="pdf")

        # Render pages and collect PIL Images
        images = []
        for page in pdf_document:
            pix = page.get_pixmap()
            img = Image.frombytes(
                "RGB", [pix.width, pix.height], pix.samples
            )  # Create a PIL Image
            images.append(img)

        pdf_document.close()
        ocr_texts = await self._ocr_client(
            ordered_images=[(image, index) for index, image in enumerate(images)]
        )
        result = await self._profile_parser_agent.run(
            f"OCR text:\n{'\n'.join(ocr_texts)}"
        )

        profile_output = result.output
        return Ok(
            BaseProfile(
                address=profile_output.address,
                date_of_birth=profile_output.date_of_birth,
                gender=profile_output.gender,
                marital_status=profile_output.marital_status,
                category=profile_output.category,
                # TODO: geocode the locations correctly here (or maybe, crazy idea, just let the LLM output it??)
                # locations_open_to_work=profile_output.locations_open_to_work,
                open_to_relocation_anywhere=profile_output.open_to_relocation_anywhere,
                education=profile_output.education,
                licenses=profile_output.licenses,
                languages=profile_output.languages,
                job_preferences=profile_output.job_preferences,
                work_experience=profile_output.work_experience,
                total_work_experience_years=profile_output.total_work_experience_years,
                salary_expectations=profile_output.salary_expectations,
                certifications=profile_output.certifications,
                professional_summary=profile_output.professional_summary,
                headline=profile_output.headline,
            )
        )
