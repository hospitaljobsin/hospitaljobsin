import uuid
from datetime import timedelta

from bson import ObjectId
from email_validator import EmailNotValidError, validate_email
from fastapi import BackgroundTasks
from humanize import naturaldelta
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.exceptions import InvalidEmailError
from app.base.models import Address
from app.config import Settings
from app.core.constants import ORGANIZATION_INVITE_EXPIRES_IN
from app.core.emails import EmailSender
from app.jobs.exceptions import OrganizationNotFoundError
from app.organizations.documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from app.organizations.exceptions import (
    InsufficientOrganizationAdminsError,
    MemberAlreadyExistsError,
    OrganizationInviteNotFoundError,
    OrganizationMemberNotFoundError,
    OrganizationSlugInUseError,
)
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)


class OrganizationService:
    def __init__(
        self,
        organization_repo: OrganizationRepo,
        organization_member_repo: OrganizationMemberRepo,
        s3_client: S3Client,
        settings: Settings,
    ) -> None:
        self._organization_repo = organization_repo
        self._organization_member_repo = organization_member_repo
        self._s3_client = s3_client
        self._settings = settings

    async def create(
        self,
        admin_id: ObjectId,
        name: str,
        slug: str,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Result[Organization, OrganizationSlugInUseError]:
        existing_organization = await self._organization_repo.get_by_slug(
            organization_slug=slug,
        )

        if existing_organization is not None:
            return Err(OrganizationSlugInUseError())

        organization = await self._organization_repo.create(
            name=name,
            slug=slug,
            description=description,
            address=Address(),
            website=website,
            logo_url=logo_url,
        )

        # create initial admin member
        await self._organization_member_repo.create(
            organization_id=organization.id,
            account_id=admin_id,
            role="admin",
        )

        return Ok(organization)

    async def create_logo_presigned_url(self) -> str:
        """Create a presigned URL for uploading an organization logo."""
        return await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._settings.s3_avatar_bucket_name,
                "Key": f"org-logos/{uuid.uuid4()}",
            },
            ExpiresIn=3600,
            HttpMethod="PUT",
        )

    async def update(
        self,
        account: Account,
        organization_id: ObjectId,
        name: str,
        slug: str,
        address: Address,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Result[Organization, OrganizationSlugInUseError | OrganizationNotFoundError]:
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if (
            slug != existing_organization.slug
            and await self._organization_repo.get_by_slug(
                organization_slug=slug,
            )
            is not None
        ):
            return Err(OrganizationSlugInUseError())

        organization = await self._organization_repo.update(
            existing_organization,
            name=name,
            slug=slug,
            description=description,
            address=address,
            website=website,
            logo_url=logo_url,
        )

        return Ok(organization)


class OrganizationMemberService:
    def __init__(
        self,
        organization_member_repo: OrganizationMemberRepo,
        organization_repo: OrganizationRepo,
    ) -> None:
        self._organization_member_repo = organization_member_repo
        self._organization_repo = organization_repo

    async def is_admin(self, account_id: ObjectId, organization_id: ObjectId) -> bool:
        member = await self._organization_member_repo.get(
            account_id=account_id,
            organization_id=organization_id,
        )

        return member is not None and member.role == "admin"

    async def is_member(self, account_id: ObjectId, organization_id: ObjectId) -> bool:
        return (
            await self._organization_member_repo.get(
                account_id=account_id, organization_id=organization_id
            )
            is not None
        )

    async def remove_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        OrganizationMember, OrganizationNotFoundError | OrganizationMemberNotFoundError
    ]:
        """Kick a member from an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        existing_organization_member = await self._organization_member_repo.get(
            account_id=member_account_id,
            organization_id=organization_id,
        )

        if existing_organization_member is None:
            return Err(OrganizationMemberNotFoundError())

        if existing_organization_member.role == "admin":
            # we cannot kick other admins
            return Err(OrganizationMemberNotFoundError())

        await self._organization_member_repo.delete(existing_organization_member)

        return Ok(existing_organization_member)

    async def promote_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        OrganizationMember, OrganizationNotFoundError | OrganizationMemberNotFoundError
    ]:
        """Promote a member in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        existing_organization_member = await self._organization_member_repo.get(
            account_id=member_account_id,
            organization_id=organization_id,
        )

        if existing_organization_member is None:
            return Err(OrganizationMemberNotFoundError())

        existing_organization_member = await self._organization_member_repo.update(
            existing_organization_member,
            role="admin",
        )

        return Ok(existing_organization_member)

    async def demote_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        OrganizationMember,
        OrganizationNotFoundError
        | OrganizationMemberNotFoundError
        | InsufficientOrganizationAdminsError,
    ]:
        """Demote a member in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        existing_organization_member = await self._organization_member_repo.get(
            account_id=member_account_id,
            organization_id=organization_id,
        )

        if existing_organization_member is None:
            return Err(OrganizationMemberNotFoundError())

        if (
            await self._organization_member_repo.get_admin_count(
                organization_id=organization_id,
            )
            <= 1
        ):
            # we need at least one admin in the organization
            return Err(InsufficientOrganizationAdminsError())

        existing_organization_member = await self._organization_member_repo.update(
            existing_organization_member,
            role="member",
        )

        return Ok(existing_organization_member)


class OrganizationInviteService:
    def __init__(
        self,
        invite_repo: OrganizationInviteRepo,
        organization_repo: OrganizationRepo,
        organization_member_repo: OrganizationMemberRepo,
        account_repo: AccountRepo,
        email_sender: EmailSender,
        settings: Settings,
    ) -> None:
        self._invite_repo = invite_repo
        self._organization_repo = organization_repo
        self._organization_member_repo = organization_member_repo
        self._account_repo = account_repo
        self._email_sender = email_sender
        self._settings = settings

    async def create(
        self,
        organization_id: ObjectId,
        account: Account,
        email: str,
        background_tasks: BackgroundTasks,
    ) -> Result[
        OrganizationInvite,
        InvalidEmailError | OrganizationNotFoundError | MemberAlreadyExistsError,
    ]:
        """Create a new invite for an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        try:
            email_info = validate_email(
                email,
                check_deliverability=True,
            )
            email = email_info.normalized
        except EmailNotValidError as err:
            return Err(InvalidEmailError(message=str(err)))

        existing_account = await self._account_repo.get_by_email(email=email)

        if existing_account is not None and await self._organization_member_repo.get(
            account_id=existing_account.id,
            organization_id=organization_id,
        ):
            return Err(MemberAlreadyExistsError())

        invite, invite_token = await self._invite_repo.create(
            organization=existing_organization,
            account=account,
            email=email,
        )

        background_tasks.add_task(
            self._email_sender.send_template_email,
            template="organization-invite",
            receiver=email,
            context={
                "invited_by_name": account.full_name,
                "organization_name": existing_organization.name,
                "invite_link": f"{self._settings.recruiter_portal_base_url}/dashboard/invites/{invite_token}",
                "organization_logo_url": existing_organization.logo_url,
                "invite_expires_in": naturaldelta(
                    timedelta(seconds=ORGANIZATION_INVITE_EXPIRES_IN)
                ),
            },
        )

        return Ok(invite)

    async def delete(
        self,
        account: Account,
        organization_id: ObjectId,
        invite_id: ObjectId,
    ) -> Result[
        OrganizationInvite, OrganizationNotFoundError | OrganizationInviteNotFoundError
    ]:
        """Delete an invite in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        existing_invite = await self._invite_repo.get(
            invite_id=invite_id, organization_id=organization_id
        )

        if existing_invite is None:
            return Err(OrganizationInviteNotFoundError())

        await self._invite_repo.delete(existing_invite)

        return Ok(existing_invite)

    async def accept(
        self,
        account: Account,
        invite_token: str,
    ) -> Result[OrganizationInvite, OrganizationInviteNotFoundError]:
        """Accept an invite in an organization."""
        existing_invite = await self._invite_repo.get_by_token(
            token=invite_token,
        )

        if (
            existing_invite is None
            or existing_invite.status != "pending"
            or existing_invite.email != account.email
        ):
            return Err(OrganizationInviteNotFoundError())

        await self._invite_repo.update(
            existing_invite, status="accepted", expires_at=None
        )

        # create a member in the organization
        await self._organization_member_repo.create(
            organization_id=existing_invite.organization.id,
            account_id=account.id,
            role="member",
        )

        return Ok(existing_invite)

    async def decline(
        self,
        account: Account,
        invite_token: str,
    ) -> Result[OrganizationInvite, OrganizationInviteNotFoundError]:
        """Decline an invite in an organization."""
        existing_invite = await self._invite_repo.get_by_token(
            token=invite_token,
        )

        if (
            existing_invite is None
            or existing_invite.status != "pending"
            or existing_invite.email != account.email
        ):
            return Err(OrganizationInviteNotFoundError())

        await self._invite_repo.update(
            existing_invite, status="declined", expires_at=None
        )

        return Ok(existing_invite)
