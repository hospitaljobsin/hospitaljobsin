from collections.abc import Iterable
from datetime import date, datetime
from enum import Enum
from typing import Annotated, Self

import strawberry
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.accounts.documents import Account, CurrentJob, Language, Profile
from app.base.types import (
    AddressType,
    BaseErrorType,
    BaseNodeType,
    NotAuthenticatedErrorType,
)
from app.context import Info


@strawberry.type(name="ProfileNotFoundError")
class ProfileNotFoundErrorType(BaseErrorType):
    message: str = "Profile not found!"


@strawberry.enum(name="GenderType")
class GenderTypeEnum(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


@strawberry.enum(name="MaritalStatusType")
class MaritalStatusTypeEnum(Enum):
    MARRIED = "MARRIED"
    SINGLE = "SINGLE"


@strawberry.type(name="Language")
class LanguageType:
    name: str
    proficiency: str

    @classmethod
    def marshal(cls, language: Language) -> Self:
        return cls(
            name=language.name,
            proficiency=language.proficiency,
        )


@strawberry.input(name="LanguageInput")
class LanguageInputType:
    name: str
    proficiency: str

    @classmethod
    def marshal(cls, language: Language) -> Self:
        return cls(
            name=language.name,
            proficiency=language.proficiency,
        )


@strawberry.type(name="CurrentJob")
class CurrentJobType:
    current_title: str
    current_organization: str | None = None
    current_salary: float | None = None

    @classmethod
    def marshal(cls, current_job: CurrentJob) -> Self:
        return cls(
            current_title=current_job.current_title,
            current_organization=current_job.current_organization,
            current_salary=current_job.current_salary,
        )


@strawberry.type(name="Profile")
class ProfileType(BaseNodeType[Profile]):
    # personal details
    gender: GenderTypeEnum | None
    date_of_birth: date | None
    address: AddressType | None
    marital_status: MaritalStatusTypeEnum | None
    category: str | None
    languages: list[LanguageType]

    # employment details
    total_job_experience: float | None
    current_job: CurrentJobType | None

    created_at: datetime

    @classmethod
    def marshal(cls, profile: Profile) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(profile.id),
            gender=GenderTypeEnum[profile.gender],
            date_of_birth=profile.date_of_birth,
            address=AddressType.marshal(profile.address)
            if profile.address is not None
            else None,
            marital_status=MaritalStatusTypeEnum[profile.marital_status]
            if profile.marital_status is not None
            else None,
            category=profile.category,
            languages=[
                LanguageType.marshal(language) for language in profile.languages
            ],
            total_job_experience=profile.total_job_experience,
            current_job=CurrentJobType.marshal(profile.current_job)
            if profile.current_job is not None
            else None,
            created_at=profile.id.generation_time,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        accounts = await info.context["loaders"].account_by_id.load_many(node_ids)
        return [
            cls.marshal(account) if account is not None else account
            for account in accounts
        ]


ProfilePayload = Annotated[
    ProfileType | ProfileNotFoundErrorType,
    strawberry.union(
        name="ProfilePayload",
    ),
]

UpdateProfilePayload = Annotated[
    ProfileType | ProfileNotFoundErrorType,
    strawberry.union(
        name="UpdateProfilePayload",
    ),
]


@strawberry.type(name="Account")
class AccountType(BaseNodeType[Account]):
    full_name: str
    email: str
    has_onboarded: bool
    updated_at: datetime | None
    profile_id: strawberry.Private[ObjectId | None] = None

    @classmethod
    def marshal(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            full_name=account.full_name,
            email=account.email,
            updated_at=account.updated_at,
            has_onboarded=account.has_onboarded,
            profile_id=account.profile.ref.id if account.profile is not None else None,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        accounts = await info.context["loaders"].account_by_id.load_many(node_ids)
        return [
            cls.marshal(account) if account is not None else account
            for account in accounts
        ]

    @strawberry.field(graphql_type=ProfilePayload)
    @inject
    async def profile(self, info: Info) -> ProfilePayload:
        if self.profile_id is None:
            return ProfileNotFoundErrorType()
        result = await info.context["loaders"].profile_by_id.load(str(self.profile_id))
        return ProfileType.marshal(result)


ViewerPayload = Annotated[
    AccountType | NotAuthenticatedErrorType,
    strawberry.union(
        name="ViewerPayload",
    ),
]


SaveJobPayload = Annotated[
    AccountType,
    strawberry.union(
        name="SaveJobPayload",
    ),
]
