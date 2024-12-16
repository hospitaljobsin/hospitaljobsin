from collections.abc import Iterable
from datetime import datetime
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay

from app.accounts.documents import Account, Profile
from app.base.types import BaseErrorType, BaseNodeType, NotAuthenticatedErrorType
from app.companies.repositories import JobRepo
from app.companies.types import JobConnectionType
from app.context import Info


@strawberry.type(name="ProfileNotFoundError")
class ProfileNotFoundErrorType(BaseErrorType):
    message: str = "Profile not found!"


@strawberry.type(name="Profile")
class ProfileType(BaseNodeType[Profile]):
    name: str

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

    @strawberry.field(graphql_type=JobConnectionType)
    @inject
    async def saved_jobs(
        self,
        info: Info,
        job_repo: Annotated[JobRepo, Inject],
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
    ) -> JobConnectionType:
        result = await job_repo.get_all_saved(
            account=None,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )
        return JobConnectionType.from_paginated_result(result)


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
