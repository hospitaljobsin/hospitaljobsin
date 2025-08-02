import uuid
from datetime import timedelta

from bson import ObjectId
from bson.errors import InvalidId
from email_validator import EmailNotValidError, validate_email
from humanize import naturaldelta
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.exceptions import InvalidEmailError
from app.base.models import Address
from app.config import AppSettings, AWSSettings
from app.core.constants import (
    ORGANIZATION_INVITE_EXPIRES_IN,
    RESERVED_ORGANIZATION_NAMES,
)
from app.core.emails import BaseEmailSender
from app.dataloaders import Dataloaders
from app.jobs.exceptions import OrganizationNotFoundError
from app.organizations.documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from app.organizations.exceptions import (
    InsufficientOrganizationAdminsError,
    MemberAlreadyExistsError,
    OrganizationAlreadyVerifiedError,
    OrganizationAuthorizationError,
    OrganizationInviteNotFoundError,
    OrganizationMemberNotFoundError,
    OrganizationSlugInUseError,
    OrganizationVerificationRequestAlreadyExistsError,
)
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
    OrganizationVerificationRequestRepo,
)


class OrganizationMemberService:
    def __init__(
        self,
        organization_member_repo: OrganizationMemberRepo,
        organization_repo: OrganizationRepo,
        dataloaders: Dataloaders,
    ) -> None:
        self._organization_member_repo = organization_member_repo
        self._organization_repo = organization_repo
        self._dataloaders = dataloaders

    async def is_admin(self, account_id: ObjectId, organization_id: ObjectId) -> bool:
        member = await self._dataloaders.organization_member_by_id.load(
            (str(account_id), str(organization_id))
        )

        return member is not None and member.role == "admin"

    async def is_member(self, account_id: ObjectId, organization_id: ObjectId) -> bool:
        return (
            await self._dataloaders.organization_member_by_id.load(
                (str(account_id), str(organization_id))
            )
            is not None
        )

    async def remove_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        tuple[OrganizationMember, Organization],
        OrganizationNotFoundError
        | OrganizationMemberNotFoundError
        | OrganizationAuthorizationError,
    ]:
        """Kick a member from an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

        existing_organization_member = await self._organization_member_repo.get(
            account_id=member_account_id,
            organization_id=organization_id,
        )

        if existing_organization_member is None:
            return Err(OrganizationMemberNotFoundError())

        if existing_organization_member.role == "admin":
            # we cannot kick other admins
            return Err(OrganizationAuthorizationError())

        # we don't need to check if we have atleast one admin, as admins cannot be removed
        # and we check for minimum admins in the demote method

        await self._organization_member_repo.delete(existing_organization_member)

        return Ok((existing_organization_member, existing_organization))

    async def promote_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        tuple[OrganizationMember, Organization],
        OrganizationNotFoundError
        | OrganizationMemberNotFoundError
        | OrganizationAuthorizationError,
    ]:
        """Promote a member in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

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

        return Ok((existing_organization_member, existing_organization))

    async def demote_member(
        self,
        account: Account,
        organization_id: ObjectId,
        member_account_id: ObjectId,
    ) -> Result[
        tuple[OrganizationMember, Organization],
        OrganizationNotFoundError
        | OrganizationMemberNotFoundError
        | InsufficientOrganizationAdminsError
        | OrganizationAuthorizationError,
    ]:
        """Demote a member in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

        existing_organization_member = await self._organization_member_repo.get(
            account_id=member_account_id,
            organization_id=organization_id,
        )

        if existing_organization_member is None:
            return Err(OrganizationMemberNotFoundError())

        if (
            existing_organization_member.role == "admin"
            and await self._organization_member_repo.get_admin_count(
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

        return Ok((existing_organization_member, existing_organization))


class OrganizationService:
    def __init__(
        self,
        organization_repo: OrganizationRepo,
        organization_member_repo: OrganizationMemberRepo,
        organization_member_service: OrganizationMemberService,
        organization_verification_request_repo: OrganizationVerificationRequestRepo,
        s3_client: S3Client,
        aws_settings: AWSSettings,
    ) -> None:
        self._organization_repo = organization_repo
        self._organization_member_repo = organization_member_repo
        self._organization_member_service = organization_member_service
        self._organization_verification_request_repo = (
            organization_verification_request_repo
        )
        self._s3_client = s3_client
        self._aws_settings = aws_settings

    async def create(
        self,
        admin: Account,
        name: str,
        slug: str,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Result[Organization, OrganizationSlugInUseError]:
        if slug in RESERVED_ORGANIZATION_NAMES:
            return Err(OrganizationSlugInUseError())
        existing_organization = await self._organization_repo.get_by_slug(
            organization_slug=slug,
        )

        if existing_organization is not None:
            return Err(OrganizationSlugInUseError())

        organization = await self._organization_repo.create(
            name=name,
            slug=slug,
            description=description,
            location=None,
            website=website,
            logo_url=logo_url,
        )

        # create initial admin member
        await self._organization_member_repo.create(
            organization_id=organization.id,
            account=admin,
            role="admin",
        )

        return Ok(organization)

    async def check_slug_availability(self, slug: str) -> bool:
        """Check if a slug is available."""
        if slug in RESERVED_ORGANIZATION_NAMES:
            return False

        return (
            await self._organization_repo.get_by_slug(
                organization_slug=slug,
            )
            is None
        )

    async def create_logo_presigned_url(self, content_type: str) -> str:
        """Create a presigned URL for uploading an organization logo."""
        return await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._aws_settings.s3_bucket_name,
                "Key": f"org-logos/{uuid.uuid4()}",
                "ContentType": content_type,
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
        location: str | None = None,
        description: str | None = None,
        website: str | None = None,
        logo_url: str | None = None,
    ) -> Result[
        Organization,
        OrganizationSlugInUseError
        | OrganizationNotFoundError
        | OrganizationAuthorizationError,
    ]:
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

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
            location=location,
            website=website,
            logo_url=logo_url,
        )

        return Ok(organization)

    async def delete(
        self, account: Account, organization_id: str
    ) -> Result[
        Organization, OrganizationNotFoundError | OrganizationAuthorizationError
    ]:
        """Delete an organization."""
        try:
            organization_id = ObjectId(organization_id)
        except InvalidId:
            return Err(OrganizationNotFoundError())
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        await self._organization_repo.delete(existing_organization)

        return Ok(existing_organization)

    async def create_proof_presigned_url(self, content_type: str) -> str:
        """Create a presigned URL for uploading a proof."""
        return await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._aws_settings.s3_bucket_name,
                "Key": f"org-verification-proofs/{uuid.uuid4()}",
                "ContentType": content_type,
            },
            ExpiresIn=3600,
            HttpMethod="PUT",
        )

    async def request_verification(
        self,
        account: Account,
        organization_id: str,
        registered_organization_name: str,
        contact_email: str,
        phone_number: str,
        address: Address,
        business_proof_type: str,
        business_proof_url: str,
        address_proof_type: str,
        address_proof_url: str,
    ) -> Result[
        Organization,
        OrganizationNotFoundError
        | OrganizationAuthorizationError
        | OrganizationAlreadyVerifiedError
        | OrganizationVerificationRequestAlreadyExistsError,
    ]:
        """Request an organization verification."""
        try:
            organization_id = ObjectId(organization_id)
        except InvalidId:
            return Err(OrganizationNotFoundError())
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        if existing_organization.verified_at is not None:
            return Err(OrganizationAlreadyVerifiedError())

        latest_verification_request = await self._organization_verification_request_repo.get_latest_by_organization_id(
            organization_id=existing_organization.id,
        )

        if (
            latest_verification_request is not None
            and latest_verification_request.status == "pending"
        ):
            return Err(OrganizationVerificationRequestAlreadyExistsError())

        await self._organization_verification_request_repo.delete_by_organization_id(
            organization_id=existing_organization.id,
        )

        # create a verification request
        await self._organization_verification_request_repo.create(
            organization=existing_organization,
            account=account,
            registered_organization_name=registered_organization_name,
            contact_email=contact_email,
            phone_number=phone_number,
            address=address,
            business_proof_type=business_proof_type,
            business_proof_url=business_proof_url,
            address_proof_type=address_proof_type,
            address_proof_url=address_proof_url,
        )

        return Ok(existing_organization)


class OrganizationInviteService:
    def __init__(
        self,
        invite_repo: OrganizationInviteRepo,
        organization_repo: OrganizationRepo,
        organization_member_repo: OrganizationMemberRepo,
        organization_member_service: OrganizationMemberService,
        account_repo: AccountRepo,
        email_sender: BaseEmailSender,
        app_settings: AppSettings,
    ) -> None:
        self._invite_repo = invite_repo
        self._organization_repo = organization_repo
        self._organization_member_repo = organization_member_repo
        self._organization_member_service = organization_member_service
        self._account_repo = account_repo
        self._email_sender = email_sender
        self._app_settings = app_settings

    async def create(
        self,
        account: Account,
        organization_id: ObjectId,
        email: str,
    ) -> Result[
        OrganizationInvite,
        InvalidEmailError
        | OrganizationNotFoundError
        | MemberAlreadyExistsError
        | OrganizationAuthorizationError,
    ]:
        """Create a new invite for an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

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

        await self._email_sender.send_template_email(
            template="organization-invite",
            receiver=email,
            context={
                "invited_by_name": account.full_name,
                "organization_name": existing_organization.name,
                "invite_link": f"{self._app_settings.recruiter_portal_base_url}/invites/{invite_token}",
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
        OrganizationInvite,
        OrganizationNotFoundError
        | OrganizationInviteNotFoundError
        | OrganizationAuthorizationError,
    ]:
        """Delete an invite in an organization."""
        existing_organization = await self._organization_repo.get(
            organization_id=organization_id,
        )

        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

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

        await self._invite_repo.mark_other_as_hidden(
            organization_id=existing_invite.organization.id,
            email=existing_invite.email,
        )

        # create a member in the organization
        await self._organization_member_repo.create(
            organization_id=existing_invite.organization.id,
            account=account,
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
