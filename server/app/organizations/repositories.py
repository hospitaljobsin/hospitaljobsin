import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId

from app.accounts.documents import Account
from app.base.models import Address
from app.core.constants import (
    ORGANIZATION_INVITE_EXPIRES_IN,
)
from app.database.paginator import PaginatedResult, Paginator

from .documents import Organization, OrganizationInvite, OrganizationMember


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
        slug: str,
        address: Address,
        email: str | None = None,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Organization:
        """Update the given organization."""
        organization.name = name
        organization.slug = slug
        organization.description = description
        organization.address = address
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
        search_term: str | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[OrganizationMember, ObjectId]:
        """Get all organization members by organization ID."""
        # TODO: get search by account name working
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

        if search_term:
            search_criteria = search_criteria.find({"$text": {"$search": search_term}})

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


class OrganizationInviteRepo:
    @classmethod
    def generate_token(cls) -> str:
        """Generate a new invite token."""
        return secrets.token_urlsafe(16)

    @classmethod
    def hash_token(cls, token: str) -> str:
        """Hash the given invite token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()  # noqa: S324

    async def create(
        self,
        organization: Organization,
        account: Account,
        email: str,
    ) -> tuple[OrganizationInvite, str]:
        """Create a new organization invite."""
        invite_token = self.generate_token()
        while await self.get_by_token(invite_token) is not None:
            invite_token = self.generate_token()

        invite = OrganizationInvite(
            organization=organization,
            created_by=account,
            email=email,
            token_hash=self.hash_token(invite_token),
            status="pending",
            expires_at=datetime.now(UTC)
            + timedelta(
                seconds=ORGANIZATION_INVITE_EXPIRES_IN,
            ),
        )

        await invite.insert()

        await invite.fetch_all_links()

        return invite, invite_token

    async def delete(self, invite: OrganizationInvite) -> None:
        """Delete an organization invite."""
        await invite.delete()

    async def get_by_token(self, token: str) -> OrganizationInvite | None:
        """Get invite by token."""
        return await OrganizationInvite.find_one(
            OrganizationInvite.token_hash == self.hash_token(token),
            fetch_links=True,
            nesting_depth=1,
        )

    async def get(
        self, organization_id: ObjectId, invite_id: ObjectId
    ) -> OrganizationInvite | None:
        """Get invite by organization ID and invite ID."""
        return await OrganizationInvite.find_one(
            OrganizationInvite.organization.id == organization_id,
            OrganizationInvite.id == invite_id,
            fetch_links=True,
            nesting_depth=1,
        )

    async def get_all_by_organization_id(
        self,
        organization_id: ObjectId,
        search_term: str | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[OrganizationInvite, ObjectId]:
        """Get all invites by organization ID."""
        paginator: Paginator[OrganizationInvite, ObjectId] = Paginator(
            reverse=True,
            document_cls=OrganizationInvite,
            paginate_by="id",
        )

        search_criteria = OrganizationInvite.find(
            OrganizationInvite.organization.id == organization_id,
            fetch_links=True,
            nesting_depth=1,
        )

        if search_term:
            search_criteria = search_criteria.find(
                {"$text": {"$search": search_term}},
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
