import sys
from pathlib import Path
from typing import Annotated, ClassVar

sys.path.insert(0, Path.cwd())

import pymongo
from app.organizations.documents import OrganizationVerificationRequest
from beanie import Document, Indexed, free_fall_migration
from pydantic import Field
from pymongo import IndexModel


class OldOrganization(Document):
    name: str
    slug: Annotated[str, Indexed(unique=True)]
    description: str | None = None
    description_cleaned: str | None = None  # plain text version of description
    description_html: str | None = None
    location: str | None = None
    email: str | None = None
    website: str | None = None
    verification_request: OrganizationVerificationRequest | None = None
    internal_logo_url: str | None = Field(default=None, alias="logo_url")
    internal_banner_url: str | None = Field(default=None, alias="banner_url")

    class Settings:
        name = "organizations"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                [
                    ("name", pymongo.TEXT),
                    ("description_cleaned", pymongo.TEXT),
                    ("location", pymongo.TEXT),
                ],
                name="organization_text_index",
                default_language="english",
            ),
        ]


class Organization(Document):
    name: str
    slug: Annotated[str, Indexed(unique=True)]
    description: str | None = None
    description_cleaned: str | None = None  # plain text version of description
    description_html: str | None = None
    location: str | None = None
    email: str | None = None
    website: str | None = None
    verification_request: OrganizationVerificationRequest | None = None
    internal_logo_url: str | None = Field(default=None, alias="logo_url")
    internal_banner_url: str | None = Field(default=None, alias="banner_url")

    is_spam: bool

    class Settings:
        name = "organizations"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                [
                    ("name", pymongo.TEXT),
                    ("description_cleaned", pymongo.TEXT),
                    ("location", pymongo.TEXT),
                ],
                name="organization_text_index",
                default_language="english",
            ),
        ]


class Forward:
    @free_fall_migration(document_models=[Organization, OldOrganization])
    async def add_spam_flag(self, session) -> None:
        async for old_org in OldOrganization.find_all():
            new_org = Organization(**old_org.model_dump(), is_spam=False)
            await new_org.replace(session=session)


class Backward:
    @free_fall_migration(document_models=[Organization, OldOrganization])
    async def remove_spam_flag(self, session):
        async for org in Organization.find():
            old_org = OldOrganization(**org.model_dump(exclude={"is_spam"}))
            await old_org.replace(session=session)
