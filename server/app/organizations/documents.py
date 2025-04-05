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
    logo_url: str | None = None
    members: list[BackLink["OrganizationMember"]] = Field(original_field="organization")  # type: ignore[call-overload]

    class Settings:
        name = "organizations"


class OrganizationMember(Document):
    organization: Link[Organization]
    account: Link[Account]
    role: Literal["admin", "member"]

    class Settings:
        name = "organization_members"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                ["organization", "account"],
                name="organization_account_unique_secondary_index",
                unique=True,
            ),
        ]


class OrganizationInvite(Document):
    email: str
    organization: Link[Organization]
    created_by: Link[Account]
    token_hash: Annotated[str, Indexed(unique=True)]
    status: Literal["pending", "accepted", "declined"]

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
