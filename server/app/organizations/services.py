from app.base.models import Address
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationRepo


class OrganizationService:
    def __init__(self, organization_repo: OrganizationRepo):
        self._organization_repo = organization_repo

    async def create(
        self,
        name: str,
        description: str,
        address: Address,
        phone: int,
        website: str,
        logo_url: str | None = None,
    ) -> Organization:
        return await self._organization_repo.create(
            name=name,
            description=description,
            address=address,
            phone=phone,
            website=website,
            logo_url=logo_url,
        )
