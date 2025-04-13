import hashlib
from datetime import datetime
from typing import Annotated, ClassVar, Literal

import pymongo
from beanie import BackLink, Document, Indexed, Link
from pydantic import Field
from pymongo import IndexModel

from app.accounts.documents import Account
from app.base.models import Address


class Organization(Document):
    name: str
    slug: Annotated[str, Indexed(unique=True)]
    description: str | None = None
    address: Address
    email: str | None = None
    website: str | None = None
    internal_logo_url: str | None = Field(default=None, alias="logo_url")
    members: list[BackLink["OrganizationMember"]] = Field(original_field="organization")  # type: ignore[call-overload]

    @property
    def logo_url(self) -> str:
        """Return the organization's logo URL, or a placeholder."""
        if self.internal_logo_url is not None:
            return self.internal_logo_url
        slug_hash = hashlib.sha256(self.slug.encode("utf-8")).hexdigest()
        return f"https://api.dicebear.com/9.x/identicon/png?seed={slug_hash}"

    class Settings:
        name = "organizations"


class OrganizationMember(Document):
    organization: Link[Organization]
    account: Link[Account]
    full_name: str  # denormalized from the account document for full-text search
    role: Literal["admin", "member"]

    class Settings:
        name = "organization_members"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                ["organization", "account"],
                name="organization_account_unique_secondary_index",
                unique=True,
            ),
            IndexModel(
                [
                    ("full_name", pymongo.TEXT),
                ],
                name="full_name_text_index",
                default_language="english",
            ),
        ]


class OrganizationInvite(Document):
    email: str
    organization: Link[Organization]
    created_by: Link[Account]
    token_hash: Annotated[str, Indexed(unique=True)]
    status: Literal["pending", "accepted", "declined"]
    is_hidden: bool = False
    expires_at: datetime | None = None

    class Settings:
        name = "organization_invites"
        indexes: ClassVar[list[IndexModel]] = [
            # expire invites after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
            IndexModel(
                [
                    ("email", pymongo.TEXT),
                ],
                name="organization_invite_email_text_index",
                default_language="english",
            ),
        ]
