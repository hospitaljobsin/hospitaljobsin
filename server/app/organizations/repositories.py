import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Literal

from beanie import PydanticObjectId
from beanie.operators import And, In, Set
from bson import ObjectId
from strawberry import UNSET

from app.accounts.documents import Account
from app.base.models import Address
from app.core.constants import (
    ORGANIZATION_INVITE_EXPIRES_IN,
)
from app.core.formatting import slugify
from app.database.paginator import PaginatedResult, Paginator
from app.jobs.documents import Job, JobApplicant, SavedJob

from .documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
    OrganizationVerificationRequest,
)


class OrganizationRepo:
    async def create(
        self,
        slug: str,
        name: str,
        location: str | None = None,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Organization:
        """Create a new organization."""
        organization = Organization(
            slug=slugify(slug),
            name=name,
            description=description,
            location=location,
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
        location: str | None = UNSET,
        email: str | None = UNSET,
        description: str | None = UNSET,
        website: str | None = UNSET,
        logo_url: str | None = UNSET,
        banner_url: str | None = UNSET,
    ) -> Organization:
        """Update the given organization."""
        if name is not UNSET:
            organization.name = name
        if slug is not UNSET:
            organization.slug = slugify(slug)
        if description is not UNSET:
            organization.description = description
        if location is not UNSET:
            organization.location = location
        if website is not UNSET:
            organization.website = website
        if email is not UNSET:
            organization.email = email
        if logo_url is not UNSET:
            organization.logo_url = logo_url
        if banner_url is not UNSET:
            organization.banner_url = banner_url
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
        """Delete an organization."""
        await OrganizationMember.find(
            OrganizationMember.organization.id == organization.id
        ).delete()
        await OrganizationInvite.find(
            OrganizationInvite.organization.id == organization.id
        ).delete()
        await Job.find(Job.organization.id == organization.id).delete()
        await SavedJob.find(SavedJob.organization.id == organization.id).delete()
        await JobApplicant.find(
            JobApplicant.organization.id == organization.id
        ).delete()
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
            {"$sort": {"_id": -1}},
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

    async def create_verification_request(
        self,
        organization: Organization,
        account: Account,
        registered_organization_name: str,
        contact_email: str,
        phone_number: str,
        address: Address,
        business_proof_type: str,
        business_proof_url: str,
        address_proof_type: str,
        address_proof_url: str,
    ) -> OrganizationVerificationRequest:
        """Create a new organization verification request."""
        organization.verification_request = OrganizationVerificationRequest(
            created_by=account.id,
            registered_organization_name=registered_organization_name,
            contact_email=contact_email,
            phone_number=phone_number,
            address=address,
            business_proof_type=business_proof_type,
            business_proof_url=business_proof_url,
            address_proof_type=address_proof_type,
            address_proof_url=address_proof_url,
            status="pending",
        )
        await organization.save()
        return organization.verification_request


class OrganizationMemberRepo:
    async def get(
        self, organization_id: ObjectId, account_id: ObjectId
    ) -> OrganizationMember | None:
        """Get organization member by account ID and organization ID."""
        return await OrganizationMember.find_one(
            OrganizationMember.organization.id == organization_id,
            OrganizationMember.account.id == account_id,
            fetch_links=True,
            nesting_depth=1,
        )

    async def create(
        self,
        organization_id: ObjectId,
        account: Account,
        role: str,
    ) -> OrganizationMember:
        """Create a new organization member."""
        organization_member = OrganizationMember(
            organization=organization_id,
            role=role,
            account_full_name=account.full_name,
            account=account,
        )

        return await organization_member.insert()

    async def get_admin_count(self, organization_id: ObjectId) -> int:
        """Get the number of admins in an organization."""
        return await OrganizationMember.find(
            OrganizationMember.organization.id == organization_id,
            OrganizationMember.role == "admin",
        ).count()

    async def delete(self, organization_member: OrganizationMember) -> None:
        """Delete an organization member."""
        await organization_member.delete()

    async def update(
        self,
        organization_member: OrganizationMember,
        *,
        role: str,
    ) -> OrganizationMember:
        """Update the given organization member."""
        organization_member.role = role
        return await organization_member.save()

    async def update_all(self, account: Account, *, full_name: str) -> None:
        """Update all organization members for the given account."""
        await OrganizationMember.find(
            OrganizationMember.account.id == account.id
        ).update(Set({OrganizationMember.account_full_name: full_name}))

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

    async def get_many_by_ids(
        self, member_ids: list[tuple[ObjectId, ObjectId]]
    ) -> list[OrganizationMember | None]:
        """Get multiple members by account_id and organization_id pairs."""
        # Construct filters based on actual schema paths
        filters = [
            And({"account.$id": account_id}, {"organization.$id": organization_id})
            for account_id, organization_id in member_ids
        ]

        # Use the Or operator to combine all conditions
        members = await OrganizationMember.find({"$or": filters}).to_list()

        # Map members by (account_id, member_id) for easy lookup
        member_by_id = {
            (member.account.ref.id, member.organization.ref.id): member
            for member in members
        }

        # Return members in the same order as member_ids
        return [
            member_by_id.get((account_id, member_id))
            for account_id, member_id in member_ids
        ]


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

    async def mark_other_as_hidden(self, organization_id: ObjectId, email: str) -> None:
        """Mark other invites as hidden for a given email in an organization."""
        await OrganizationInvite.find(
            OrganizationInvite.organization.id == organization_id,
            OrganizationInvite.email == email,
            OrganizationInvite.status == "pending",
        ).update(Set({OrganizationInvite.is_hidden: True}))

    async def delete(self, invite: OrganizationInvite) -> None:
        """Delete an organization invite."""
        await invite.delete()

    async def update(
        self,
        invite: OrganizationInvite,
        *,
        expires_at: datetime | None,
        status: Literal["pending", "accepted", "declined"],
    ) -> OrganizationInvite:
        """Update the given organization invite."""
        invite.status = status
        invite.expires_at = expires_at
        return await invite.save()

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
            OrganizationInvite.is_hidden == False,
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

    async def get_many_active_invites(
        self, invite_tokens: list[tuple[str, str]]
    ) -> list[OrganizationInvite | None]:
        """Get multiple active organization invites by emails and tokens."""
        filters = [
            And(
                {"email": email},
                {"token_hash": self.hash_token(token)},
                # select only pending invites
                {"status": "pending"},
                {"is_hidden": False},
            )
            for email, token in invite_tokens
        ]

        # Use the Or operator to combine all conditions
        organization_invites = await OrganizationInvite.find(
            {"$or": filters}, fetch_links=True, nesting_depth=1
        ).to_list()

        organization_invite_by_token = {
            (
                organization_invite.email,
                organization_invite.token_hash,
            ): organization_invite
            for organization_invite in organization_invites
        }

        return [
            organization_invite_by_token.get(
                (invite_token[0], self.hash_token(invite_token[1]))
            )
            for invite_token in invite_tokens
        ]
