from datetime import UTC, datetime
from typing import Annotated, Any, ClassVar, Literal

import pymongo
from beanie import (
    Document,
    Granularity,
    Indexed,
    Link,
    PydanticObjectId,
    TimeSeriesConfig,
    UnionDoc,
)
from pydantic import BaseModel, Field
from pymongo import IndexModel
from pymongo.operations import SearchIndexModel

from app.accounts.documents import Account, BaseProfile
from app.base.models import GeoObject
from app.core.constants import (
    CoreJobMetricEventType,
    ImpressionJobMetricEventType,
    JobApplicantStatus,
)
from app.organizations.documents import Organization


class Job(Document):
    title: str
    slug: Annotated[str, Indexed()]
    description: str
    # the vector embedding search index is created separately (in the initialize_database function)
    # as Beanie doesn't directly support it
    embedding: list[float]
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
        indexes: ClassVar[list[IndexModel | SearchIndexModel]] = [
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
    profile_snapshot: BaseProfile
    profile_embedding: list[float] | None = None
    account: Link[Account]
    account_full_name: (
        str  # denormalized from the account document for full-text search
    )
    job: Link[Job]
    organization: Link[Organization]
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

    def __init__(self, **data: Any) -> None:
        super().__init__(**data)
        self.__ai_insight_data: dict[str, Any] | None = None

    @property
    def ai_insight_data(self) -> dict[str, Any] | None:
        return self.__ai_insight_data

    @ai_insight_data.setter
    def ai_insight_data(self, value: dict[str, Any] | None) -> None:
        self.__ai_insight_data = value


class BaseJobMetric(UnionDoc):
    class Settings:
        name = "job_metrics"
        class_id = "_class_id"  # _class_id is the default beanie internal field used to filter children Documents
        timeseries = TimeSeriesConfig(
            time_field="timestamp",  #  Required
            meta_field="metadata",  #  Optional
            granularity=Granularity.minutes,  #  Optional
        )


class CoreJobMetricMetadata(BaseModel):
    account_id: PydanticObjectId
    job_id: PydanticObjectId
    organization_id: PydanticObjectId
    event_type: CoreJobMetricEventType


class CoreJobMetric(Document):
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: CoreJobMetricMetadata

    class Settings:
        name = "CoreJobMetric"
        union_doc = BaseJobMetric


class ImpressionJobMetricMetadata(BaseModel):
    account_id: PydanticObjectId | None = None
    fingerprint_id: str
    impression_id: str
    job_id: PydanticObjectId
    organization_id: PydanticObjectId
    event_type: ImpressionJobMetricEventType


class ImpressionJobMetric(Document):
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: ImpressionJobMetricMetadata

    class Settings:
        name = "ImpressionJobMetric"
        union_doc = BaseJobMetric
