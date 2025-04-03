import uuid

from bson import ObjectId
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client

from app.accounts.documents import Account
from app.base.models import Address
from app.config import Settings
from app.jobs.exceptions import OrganizationNotFoundError
from app.organizations.documents import Organization
from app.organizations.exceptions import OrganizationSlugInUseError
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo


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

        # TODO: check if user is admin of the organization
        # only admins can update the organization

        if (
            await self._organization_repo.get_by_slug(
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
    def __init__(self, organization_member_repo: OrganizationMemberRepo) -> None:
        self._organization_member_repo = organization_member_repo

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
