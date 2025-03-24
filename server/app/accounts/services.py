from datetime import date

from result import Ok

from app.accounts.documents import Account, Language
from app.accounts.repositories import AccountRepo, ProfileRepo
from app.base.models import Address


class AccountService:
    def __init__(self, account_repo: AccountRepo) -> None:
        self._account_repo = account_repo

    async def update(self, account: Account, full_name: str) -> Ok[Account]:
        await self._account_repo.update(account=account, full_name=full_name)
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
        address: Address,
        marital_status: str | None,
        category: str | None,
    ) -> Ok[Account]:
        existing_profile = await self._profile_repo.get_by_account(account)
        if existing_profile is None:
            existing_profile = await self._profile_repo.create(account)

        await self._profile_repo.update(
            profile=existing_profile,
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            languages=existing_profile.languages,
            address=address,
        )

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

        await self._profile_repo.update(
            profile=existing_profile,
            gender=existing_profile.gender,
            date_of_birth=existing_profile.date_of_birth,
            marital_status=existing_profile.marital_status,
            category=existing_profile.category,
            languages=languages,
            address=existing_profile.address,
        )

        return Ok(account)
