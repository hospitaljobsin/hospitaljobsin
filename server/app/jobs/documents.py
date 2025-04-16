from datetime import UTC, datetime
from typing import Annotated, ClassVar, Literal

import pymongo
from beanie import (
    Document,
    Granularity,
    Indexed,
    Link,
    PydanticObjectId,
    TimeSeriesConfig,
)
from pydantic import BaseModel, Field
from pymongo import IndexModel

from app.accounts.documents import Account
from app.base.models import GeoObject
from app.core.constants import JobApplicantStatus, JobMetricEventType
from app.organizations.documents import Organization


class Job(Document):
    title: str
    slug: Annotated[str, Indexed()]
    description: str | None = None
    type: Literal["full_time", "part_time", "internship", "contract"] | None = None
    work_mode: Literal["remote", "hybrid", "office"] | None = None

    location: str | None = None
    geo: GeoObject | None = None
    skills: list[str]

    currency: Literal["INR"] = "INR"

    min_salary: int | None = None
    max_salary: int | None = None

    min_experience: int | None = None
    max_experience: int | None = None

    vacancies: int | None = None

    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    expires_at: datetime | None = None

    is_active: bool = False

    external_application_url: str | None = None

    organization: Link[Organization]

    class Settings:
        name = "jobs"
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
            IndexModel([("geo", pymongo.GEOSPHERE)], name="geo_2dsphere_index"),
            IndexModel(
                [("slug", pymongo.ASCENDING), ("organization", pymongo.ASCENDING)],
                name="slug_organization_unique_index",
                unique=True,
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


class ApplicantField(BaseModel):
    field_name: str
    field_value: str


class JobApplicant(Document):
    account: Link[Account]
    account_full_name: (
        str  # denormalized from the account document for full-text search
    )
    job: Link[Job]
    slug: Annotated[str, Indexed()]
    status: JobApplicantStatus
    applicant_fields: list[ApplicantField]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "job_applicants"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                ["slug", "job"],
                name="slug_job_unique_secondary_index",
                unique=True,
            ),
            IndexModel(
                [
                    ("account_full_name", pymongo.TEXT),
                ],
                name="account_full_name_text_index",
                default_language="english",
            ),
        ]


class JobMetricMetadata(BaseModel):
    job_id: PydanticObjectId
    organization_id: PydanticObjectId
    event_type: JobMetricEventType


class JobMetric(Document):
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: JobMetricMetadata

    class Settings:
        name = "job_metrics"
        timeseries = TimeSeriesConfig(
            time_field="timestamp",  #  Required
            meta_field="metadata",  #  Optional
            granularity=Granularity.minutes,  #  Optional
        )
