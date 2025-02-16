from typing import TYPE_CHECKING, Literal

from beanie import BackLink, Document, Link
from pydantic import Field
from pymongo import IndexModel

from app.base.models import Address

if TYPE_CHECKING:
    from app.accounts.documents import Account


class Organization(Document):
    name: str
    description: str
    address: Address
    phone: str
    website: str
    logo_url: str | None = None
    members: list[BackLink["OrganizationMember"]] = Field(original_field="organization")

    class Settings:
        name = "organizations"


class OrganizationMember(Document):
    organization: Link[Organization]
    account: Link["Account"]
    role: Literal["admin", "member"]

    class Settings:
        name = "organization_members"
        indexes = [
            IndexModel(
                [("organization", 1), ("account", 1)],
                unique=True,
            ),
        ]
