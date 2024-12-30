from datetime import date

from bson import ObjectId

from app.accounts.repositories import ProfileRepo


class ProfileService:
    def __init__(self, profile_repo: ProfileRepo):
        self._profile_repo = profile_repo

    async def update(
        self,
        account_id: ObjectId,
        gender: str | None,
        date_of_birth: date | None,
        address: None,
        marital_status: str | None,
        category: str | None,
        languages: list[str] | None,
    ) -> None:
        pass
