from datetime import UTC, datetime
from typing import Annotated, ClassVar, Literal

import pymongo
from beanie import Document, Indexed, Link
from pydantic import BaseModel, Field
from pymongo import IndexModel
from pymongo.operations import SearchIndexModel

from app.accounts.documents import Account
from app.base.models import Address
from app.core.constants import JobApplicationStatus
from app.organizations.documents import Organization


class Job(Document):
    title: str
    slug: Annotated[str, Indexed(unique=True)]
    description: str | None = None
    type: Literal["full_time", "part_time", "internship", "contract"] | None = None
    work_mode: Literal["remote", "hybrid", "office"] | None = None

    address: Address
    skills: list[str]

    currency: Literal["INR"] = "INR"

    min_salary: int | None = None
    max_salary: int | None = None

    min_experience: int | None = None
    max_experience: int | None = None

    vacancies: int | None = None

    job_embedding: list[float] | None = None

    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    expires_at: datetime | None = None

    is_active: bool = False

    organization: Link[Organization]

    class Settings:
        name = "jobs"

    class Config:
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("skills", pymongo.TEXT),
                ],
                weights={"title": 10, "description": 5},
                name="title_description_skills_text_index",
                default_language="english",
            ),
            IndexModel(
                [("expired", pymongo.ASCENDING), ("deleted", pymongo.ASCENDING)],
                name="expired_deleted_index",
            ),
            SearchIndexModel(
                definition={
                    "fields": [
                        {
                            "type": "vector",
                            "numDimensions": 1536,  # depends on embedding model
                            "path": "job_embedding",
                            "similarity": "dotProduct",  # depends on embedding model
                        },
                        {
                            "type": "filter",
                            "path": "min_salary",
                        },
                        {
                            "type": "filter",
                            "path": "type",
                        },
                        {
                            "type": "filter",
                            "path": "work_mode",
                        },
                    ]
                },
                name="job_embedding_index",
                type="vectorSearch",
            ),
        ]


class SavedJob(Document):
    account: Link[Account]
    job: Link[Job]

    class Settings:
        name = "saved_jobs"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                ["account", "job"],
                name="account_job_unique_secondary_index",
                unique=True,
            ),
        ]


class ApplicationField(BaseModel):
    field_name: str
    default_value: str | None = None
    is_required: bool = False


class JobApplicationForm(Document):
    job: Annotated[Link[Job], Indexed(unique=True)]
    fields: list[ApplicationField]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "job_application_forms"


class JobApplication(Document):
    account: Link[Account]
    job: Link[Job]
    status: JobApplicationStatus
    application_form_data: dict | None = (
        None  # custom data that is collected via appliaction forms
    )
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "job_applications"
