from datetime import date

from bson import ObjectId

from app.accounts.documents import Profile
from app.accounts.repositories import AccountRepo, ProfileRepo


class ProfileService:
    def __init__(self, profile_repo: ProfileRepo, account_repo: AccountRepo):
        self._profile_repo = profile_repo
        self._account_repo = account_repo

    async def update(
        self,
        account_id: ObjectId,
        gender: str | None,
        date_of_birth: date | None,
        address: None,
        marital_status: str | None,
        category: str | None,
        languages: list[str] | None,
    ) -> Profile:
        account = await self._account_repo.get(account_id)
        if account.profile is None:
            print("creating profile")
            existing_profile = await self._profile_repo.create(account)
        else:
            # TODO: this doesn't work, we need account.fetch_links
            print("getting existing profile")
            existing_profile = await self._profile_repo.get_by_account(account)

        await self._profile_repo.update(
            profile=existing_profile,
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            languages=languages,
        )

        return existing_profile
