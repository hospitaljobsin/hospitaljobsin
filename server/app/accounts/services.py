from datetime import date

from bson import ObjectId
from result import Err, Ok, Result

from app.accounts.documents import Account, Language
from app.accounts.exceptions import AccountNotFoundError
from app.accounts.repositories import AccountRepo, ProfileRepo
from app.base.models import Address


class AccountService:
    def __init__(self, account_repo: AccountRepo) -> None:
        self._account_repo = account_repo

    async def update(
        self, account_id: ObjectId, full_name: str
    ) -> Result[Account, AccountNotFoundError]:
        account = await self._account_repo.get(account_id)
        if account is None:
            return Err(AccountNotFoundError())
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
        account_id: ObjectId,
        gender: str | None,
        date_of_birth: date | None,
        address: Address,
        marital_status: str | None,
        category: str | None,
    ) -> Result[Account, None]:
        account = await self._account_repo.get(account_id, fetch_profile=True)
        existing_profile = account.profile
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
        account_id: ObjectId,
        languages: list[Language],
    ) -> Result[Account, None]:
        account = await self._account_repo.get(account_id, fetch_profile=True)
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
