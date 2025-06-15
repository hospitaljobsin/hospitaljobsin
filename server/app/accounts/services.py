from datetime import date

from result import Ok

from app.accounts.documents import Account, Contact, Language
from app.accounts.repositories import AccountRepo, ProfileRepo
from app.jobs.repositories import JobApplicantRepo
from app.organizations.repositories import OrganizationMemberRepo


class AccountService:
    def __init__(
        self,
        account_repo: AccountRepo,
        organization_member_repo: OrganizationMemberRepo,
        job_applicant_repo: JobApplicantRepo,
    ) -> None:
        self._account_repo = account_repo
        self._organization_member_repo = organization_member_repo
        self._job_applicant_repo = job_applicant_repo

    async def update(self, account: Account, full_name: str) -> Ok[Account]:
        """Update the given account."""
        await self._account_repo.update(account=account, full_name=full_name)
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
        contact: Contact,
        gender: str | None,
        date_of_birth: date | None,
        address: str,
        marital_status: str | None,
        category: str | None,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            await self._profile_repo.create(account)
            existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            raise Exception("Failed to create or fetch Profile for account.")

        profile = await self._profile_repo.update(
            profile=existing_profile,
            contact=contact,
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            address=address,
        )

        account.profile = profile

        return Ok(account)

    async def update_languages(
        self,
        account: Account,
        languages: list[Language],
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        existing_profile = account.profile
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)

        profile = await self._profile_repo.update(
            profile=existing_profile,
            languages=languages,
        )

        account.profile = profile

        return Ok(account)

    async def update_location_preferences(
        self,
        *,
        account: Account,
        locations_open_to_work: list[str],
        open_to_relocation_anywhere: bool,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)

        profile = await self._profile_repo.update(
            profile=existing_profile,
            locations_open_to_work=locations_open_to_work,
            open_to_relocation_anywhere=open_to_relocation_anywhere,
        )
        account.profile = profile
        return Ok(account)
