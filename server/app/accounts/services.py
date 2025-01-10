from datetime import date

from bson import ObjectId

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo, ProfileRepo
from app.base.models import Address


class ProfileService:
    def __init__(self, profile_repo: ProfileRepo, account_repo: AccountRepo):
        self._profile_repo = profile_repo
        self._account_repo = account_repo

    async def update(
        self,
        account_id: ObjectId,
        gender: str | None,
        date_of_birth: date | None,
        address: Address,
        marital_status: str | None,
        category: str | None,
        languages: list[str] | None,
    ) -> Account:
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
            languages=languages,
            address=address,
        )

        return account
