from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId

from app.base.models import Address
from app.database.paginator import PaginatedResult, Paginator

from .documents import Organization


class OrganizationRepo:
    async def create(
        self,
        name: str,
        description: str,
        address: Address,
        phone: int,
        website: str,
        logo_url: str | None = None,
    ) -> Organization:
        """Create a new organization."""
        organization = Organization(
            name=name,
            description=description,
            address=address,
            phone=phone,
            website=website,
            logo_url=logo_url,
        )

        return await organization.insert()

    async def get(self, organization_id: ObjectId) -> Organization | None:
        """Get organization by ID."""
        return await Organization.get(organization_id)

    async def update(
        self,
        organization: Organization,
        *,
        name: str,
        description: str,
        address: Address,
        phone: str,
        website: str,
        email: str,
        logo_url: str | None = None,
    ) -> Organization:
        """Update the given organization."""
        organization.name = name
        organization.description = description
        organization.address = address
        organization.phone = phone
        organization.website = website
        organization.email = email
        organization.logo_url = logo_url
        return await organization.save()

    async def get_many_by_ids(
        self, organization_ids: list[ObjectId]
    ) -> list[Organization | None]:
        """Get multiple organizations by IDs."""
        organizations = await Organization.find(
            In(Organization.id, organization_ids)
        ).to_list()
        organization_by_id = {
            organization.id: organization for organization in organizations
        }

        return [
            organization_by_id.get(PydanticObjectId(organization_id))
            for organization_id in organization_ids
        ]

    async def get_all(
        self,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Organization, ObjectId]:
        """Get a paginated result of organizations."""

        paginator: Paginator[Organization, ObjectId] = Paginator(
            reverse=True,
            document_cls=Organization,
            paginate_by="id",
        )

        return await paginator.paginate(
            search_criteria=Organization.find(),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, organization: Organization) -> None:
        """Delete a organization by ID."""
        await organization.delete()


class OrganizationMemberRepo:
    pass
