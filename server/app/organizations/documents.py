from typing import Annotated, ClassVar, Literal

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
