from result import Err, Ok, Result

from app.accounts.documents import Account
from app.base.models import Address
from app.organizations.documents import Organization
from app.organizations.exceptions import OrganizationSlugInUseError
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo


class OrganizationService:
    def __init__(
        self,
        organization_repo: OrganizationRepo,
        organization_member_repo: OrganizationMemberRepo,
    ):
        self._organization_repo = organization_repo
        self._organization_member_repo = organization_member_repo

    async def create(
        self,
        admin: Account,
        name: str,
        slug: str,
        description: str,
        address: Address,
        phone: int,
        website: str,
        logo_url: str | None = None,
    ) -> Result[Organization, OrganizationSlugInUseError]:
        existing_organization = await self._organization_repo.get_by_slug(
            organization_slug=slug,
        )

        if existing_organization is not None:
            return Err(OrganizationSlugInUseError())

        organization = await self._organization_repo.create(
            name=name,
            description=description,
            address=address,
            phone=phone,
            website=website,
            logo_url=logo_url,
        )

        # create initial admin member
        await self._organization_member_repo.create(
            organization=organization,
            account=admin,
            role="admin",
        )

        return Ok(organization)
