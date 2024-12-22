from collections.abc import Iterable
from datetime import date, datetime
from enum import Enum
from typing import Annotated, Self

import strawberry
from aioinject.ext.strawberry import inject

from app.accounts.documents import Account, Profile
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
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


@strawberry.enum(name="CategoryType")
class CategoryTypeEnum(Enum):
    SC = "SC"
    ST = "ST"
    OBC = "OBC"
    GENERAL = "general"
    OTHER = "other"


@strawberry.enum(name="MaritalStatusType")
class MaritalStatusTypeEnum(Enum):
    MARRIED = "married"
    SINGLE = "single"


@strawberry.type(name="Language")
class LanguageType:
    name: str
    proficiency: str


@strawberry.type(name="CurrentJob")
class CurrentJobType:
    current_title: str
    current_organization: str | None = None
    current_salary: float | None = None


@strawberry.type(name="Profile")
class ProfileType(BaseNodeType[Profile]):
    # personal details
    gender: GenderTypeEnum
    date_of_birth: date
    address: AddressType
    marital_status: MaritalStatusTypeEnum
    category: CategoryTypeEnum
    languages: list[LanguageType]

    # employment details
    total_job_experience: float
    current_job: CurrentJobType | None = None

    created_at: datetime
    updated_at: datetime

    @classmethod
    def marshal(cls, profile: Profile) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(profile.id),
            name=profile.name,
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


@strawberry.type(name="Account")
class AccountType(BaseNodeType[Account]):
    full_name: str
    email: str
    has_onboarded: bool
    updated_at: datetime | None
    profile_id: strawberry.Private[str | None] = None

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
        result = await info.context["loaders"].profile_by_id.load(self.profile_id)
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
