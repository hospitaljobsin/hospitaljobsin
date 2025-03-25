from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId

from app.base.models import Address
from app.database.paginator import PaginatedResult, Paginator

from .documents import Organization, OrganizationMember


class OrganizationRepo:
    async def create(
        self,
        slug: str,
        name: str,
        address: Address,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Organization:
        """Create a new organization."""
        organization = Organization(
            slug=slug,
            name=name,
            description=description,
            address=address,
            website=website,
            logo_url=logo_url,
        )

        return await organization.insert()

    async def get(self, organization_id: ObjectId) -> Organization | None:
        """Get organization by ID."""
        return await Organization.get(organization_id)

    async def get_by_slug(self, organization_slug: str) -> Organization | None:
        """Get organization by slug."""
        return await Organization.find_one(Organization.slug == organization_slug)

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

    async def get_many_by_slugs(
        self, organization_slugs: list[str]
    ) -> list[Organization | None]:
        """Get multiple organizations by slugs."""
        organizations = await Organization.find(
            In(Organization.slug, organization_slugs)
        ).to_list()
        organization_by_slug = {
            organization.slug: organization for organization in organizations
        }

        return [
            organization_by_slug.get(organization_slug)
            for organization_slug in organization_slugs
        ]

    async def delete(self, organization: Organization) -> None:
        """Delete a organization by ID."""
        await organization.delete()

    async def get_all_by_account_id(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Organization, ObjectId]:
        """Get all organizations by account ID."""
        paginator: Paginator[Organization, ObjectId] = Paginator(
            reverse=True,
            document_cls=Organization,
            paginate_by="id",
        )

        pipeline = [
            {"$match": {"account.$id": account_id}},
            {"$sort": {"_id": -1}},
            {
                "$lookup": {
                    "from": "organizations",
                    "localField": "organization.$id",
                    "foreignField": "_id",
                    "as": "organization_data",
                }
            },
            {"$unwind": "$organization_data"},
            {"$replaceRoot": {"newRoot": "$organization_data"}},
        ]

        return await paginator.paginate(
            search_criteria=OrganizationMember.aggregate(
                aggregation_pipeline=pipeline,
                projection_model=Organization,
            ),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )


class OrganizationMemberRepo:
    async def get(
        self, organization_id: ObjectId, account_id: ObjectId
    ) -> OrganizationMember | None:
        """Get organization member by account ID and organization ID."""
        return await OrganizationMember.find_one(
            OrganizationMember.organization.id == organization_id,
            OrganizationMember.account.id == account_id,
        )

    async def create(
        self,
        organization_id: ObjectId,
        account_id: ObjectId,
        role: str,
    ) -> OrganizationMember:
        """Create a new organization member."""
        organization_member = OrganizationMember(
            organization=organization_id,
            role=role,
            account=account_id,
        )

        return await organization_member.insert()

    async def get_all_by_organization_id(
        self,
        organization_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[OrganizationMember, ObjectId]:
        """Get all organization members by organization ID."""
        paginator: Paginator[OrganizationMember, ObjectId] = Paginator(
            reverse=True,
            document_cls=OrganizationMember,
            paginate_by="account.id",
        )

        search_criteria = OrganizationMember.find(
            OrganizationMember.organization.id == organization_id,
            fetch_links=True,
            nesting_depth=1,
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_by_account_id(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Organization, ObjectId]:
        """Get all organization members by account ID."""
        paginator: Paginator[Organization, ObjectId] = Paginator(
            reverse=True,
            document_cls=Organization,
            paginate_by="organization.id",
        )

        return await paginator.paginate(
            search_criteria=Organization.find(
                OrganizationMember.account.id == account_id,
                fetch_links=True,
                nesting_depth=1,
            ),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )
