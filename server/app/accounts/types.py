import hashlib
import urllib
from collections.abc import Iterable
from datetime import date, datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Self
from urllib.parse import urlencode

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import relay

from app.accounts.documents import Account, CurrentJob, Language, Profile
from app.auth.repositories import SessionRepo, WebAuthnCredentialRepo
from app.base.types import (
    AddressType,
    BaseErrorType,
    BaseNodeType,
    NotAuthenticatedErrorType,
)
from app.context import AuthInfo, Info
from app.organizations.repositories import OrganizationRepo

if TYPE_CHECKING:
    from app.auth.types import (
        SessionConnectionType,
        SessionType,
        WebAuthnCredentialConnectionType,
    )
    from app.organizations.types import (
        OrganizationConnectionType,
    )


@strawberry.type(
    name="ProfileNotFoundError",
    description="Used when the profile is not found.",
)
class ProfileNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        default="Profile not found!",
        description="Human readable error message.",
    )


@strawberry.type(
    name="AccountNotFoundError",
    description="Used when the account is not found.",
)
class AccountNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Account not found!",
    )


@strawberry.enum(
    name="GenderType",
    description="Gender type.",
)
class GenderTypeEnum(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


@strawberry.enum(
    name="MaritalStatusType",
    description="Marital status type.",
)
class MaritalStatusTypeEnum(Enum):
    MARRIED = "MARRIED"
    SINGLE = "SINGLE"


@strawberry.type(
    name="Language",
    description="The language details.",
)
class LanguageType:
    name: str = strawberry.field(
        description="The name of the language.",
    )

    proficiency: str = strawberry.field(
        description="The proficiency level of the language.",
    )

    @classmethod
    def marshal(cls, language: Language) -> Self:
        return cls(
            name=language.name,
            proficiency=language.proficiency,
        )


@strawberry.input(
    name="LanguageInput",
    description="The language details input.",
)
class LanguageInputType:
    name: str = strawberry.field(
        description="The name of the language.",
    )
    proficiency: str = strawberry.field(
        description="The proficiency level of the language.",
    )

    def to_document(self) -> Language:
        return Language(
            name=self.name,
            proficiency=self.proficiency,
        )


@strawberry.type(
    name="CurrentJob",
    description="The current job details.",
)
class CurrentJobType:
    current_title: str = strawberry.field(
        description="The current job title.",
    )
    current_organization: str | None = strawberry.field(
        description="The current organization.",
    )
    current_salary: float | None = strawberry.field(
        description="The current salary.",
    )

    @classmethod
    def marshal(cls, current_job: CurrentJob) -> Self:
        return cls(
            current_title=current_job.current_title,
            current_organization=current_job.current_organization,
            current_salary=current_job.current_salary,
        )


@strawberry.type(
    name="Profile",
    description="An account's profile.",
)
class ProfileType(BaseNodeType[Profile]):
    # personal details
    gender: GenderTypeEnum | None = strawberry.field(
        description="The gender of the profile's user.",
    )
    date_of_birth: date = strawberry.field(
        description="The date of birth of the profile's user.",
    )
    address: AddressType = strawberry.field(
        description="The address of the profile's user.",
    )
    marital_status: MaritalStatusTypeEnum | None = strawberry.field(
        description="The marital status of the profile's user.",
    )
    category: str | None = strawberry.field(
        description="The category of the profile's user.",
    )
    languages: list[LanguageType] = strawberry.field(
        description="The list of languages spoken by the profile's user.",
    )

    # employment details
    total_job_experience: float | None = strawberry.field(
        description="Total job experience (in years) of the profile's user.",
    )
    current_job: CurrentJobType | None = strawberry.field(
        description="The current job of the profile's user.",
    )

    created_at: datetime = strawberry.field(
        description="When the profile was created.",
    )

    @classmethod
    def marshal(cls, profile: Profile) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(profile.id),
            gender=GenderTypeEnum[profile.gender]
            if profile.gender is not None
            else None,
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
        description="The profile payload.",
    ),
]


@strawberry.enum(
    name="AuthProvider",
    description="The authentication provider.",
)
class AuthProviderEnum(Enum):
    PASSWORD = "PASSWORD"  # noqa: S105
    WEBAUTHN_CREDENTIAL = "WEBAUTHN_CREDENTIAL"
    OAUTH_GOOGLE = "OAUTH_GOOGLE"


@strawberry.enum(
    name="TwoFactorProvider",
    description="The two factor provider provider.",
)
class TwoFactorProviderEnum(Enum):
    AUTHENTICATOR = "AUTHENTICATOR"


@strawberry.type(
    name="Account",
    description="An account.",
)
class AccountType(BaseNodeType[Account]):
    full_name: str = strawberry.field(
        description="The full name of the account.",
    )
    email: str = strawberry.field(
        description="The email of the account.",
    )
    updated_at: datetime | None = strawberry.field(
        description="When the account was last updated.",
    )
    auth_providers: list[AuthProviderEnum] = strawberry.field(
        description="The authentication providers supported by the account."
    )
    two_factor_providers: list[TwoFactorProviderEnum] = strawberry.field(
        description="Available 2FA providers for the account.",
    )
    has_2fa_enabled: bool = strawberry.field(
        description="Whether the account has 2FA enabled.",
    )

    profile_ref: strawberry.Private[ObjectId | Profile | None] = None

    @classmethod
    def marshal(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            full_name=account.full_name,
            email=account.email,
            updated_at=account.updated_at,
            auth_providers=[
                AuthProviderEnum[provider.upper()]
                for provider in account.auth_providers
            ],
            two_factor_providers=[
                TwoFactorProviderEnum[provider.upper()]
                for provider in account.two_factor_providers
            ],
            has_2fa_enabled=account.has_2fa_enabled,
            profile_ref=account.profile.ref.id if account.profile is not None else None,
        )

    @classmethod
    def marshal_with_profile(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            full_name=account.full_name,
            email=account.email,
            updated_at=account.updated_at,
            auth_providers=[
                AuthProviderEnum[provider.upper()]
                for provider in account.auth_providers
            ],
            two_factor_providers=[
                TwoFactorProviderEnum[provider.upper()]
                for provider in account.two_factor_providers
            ],
            has_2fa_enabled=account.has_2fa_enabled,
            profile_ref=account.profile,
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

    @strawberry.field(  # type: ignore[misc]
        graphql_type=ProfilePayload,
        description="The account's profile.",
    )
    @inject
    async def profile(self, info: Info) -> ProfilePayload:
        if self.profile_ref is None:
            return ProfileNotFoundErrorType()
        if isinstance(self.profile_ref, Profile):
            return ProfileType.marshal(self.profile_ref)
        result = await info.context["loaders"].profile_by_id.load(str(self.profile_ref))
        if result is None:
            return ProfileNotFoundErrorType()
        return ProfileType.marshal(result)

    @strawberry.field(  # type: ignore[misc]
        description="The account's avatar URL.",
    )
    async def avatar_url(
        self,
        size: Annotated[
            int,
            strawberry.argument(
                description="The size of the avatar.",
            ),
        ] = 80,
    ) -> str:
        """Return the user's avatar URL."""
        email_encoded = self.email.lower().encode("utf-8")

        # Generate the SHA256 hash of the email
        email_hash = hashlib.sha256(email_encoded).hexdigest()

        seed_query_params = urlencode({"seed": urllib.parse.quote_plus(self.full_name)})
        # Construct the URL with encoded query parameters
        query_params = urlencode(
            {
                "d": f"https://api.dicebear.com/9.x/shapes/png/{seed_query_params}",
                "s": size,
            }
        )
        return f"https://www.gravatar.com/avatar/{email_hash}?{query_params}"

    @strawberry.field(  # type: ignore[misc]
        description="When the user's sudo mode grant expires at.",
    )
    async def sudo_mode_expires_at(self, info: Info) -> datetime | None:
        """Return when the user's sudo mode expires at."""
        sudo_mode_expires_at = info.context["request"].session.get(
            "sudo_mode_expires_at"
        )
        return (
            datetime.fromisoformat(sudo_mode_expires_at)
            if sudo_mode_expires_at
            else None
        )

    @strawberry.field(  # type: ignore[misc]
        description="The organizations the account is in.",
    )
    @inject
    async def organizations(
        self,
        organization_repo: Annotated[
            OrganizationRepo,
            Inject,
        ],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> Annotated[
        "OrganizationConnectionType", strawberry.lazy("app.organizations.types")
    ]:
        """Return the organizations the user is in."""
        from app.organizations.types import OrganizationConnectionType

        memberships = await organization_repo.get_all_by_account_id(
            account_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return OrganizationConnectionType.marshal(memberships)

    @strawberry.field(  # type: ignore[misc]
        description="The session for the current user.",
    )
    @inject
    async def current_session(
        self, info: AuthInfo
    ) -> Annotated["SessionType", strawberry.lazy("app.auth.types")]:
        """Return the current session for the user."""
        from app.auth.types import SessionType

        return SessionType.marshal(info.context["session"])

    @strawberry.field(  # type: ignore[misc]
        description="The sessions for the account.",
    )
    @inject
    async def sessions(
        self,
        info: AuthInfo,
        session_repo: Annotated[
            SessionRepo,
            Inject,
        ],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> Annotated["SessionConnectionType", strawberry.lazy("app.auth.types")]:
        """Return the sessions for the current user."""
        from app.auth.types import SessionConnectionType

        sessions = await session_repo.get_all_by_account_id(
            account_id=ObjectId(self.id),
            except_session_token=info.context["session_token"],
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return SessionConnectionType.marshal(sessions)

    @strawberry.field(  # type: ignore[misc]
        description="The webauthn credentials for the account.",
    )
    @inject
    async def web_authn_credentials(
        self,
        web_authn_credential_repo: Annotated[
            WebAuthnCredentialRepo,
            Inject,
        ],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> Annotated[
        "WebAuthnCredentialConnectionType", strawberry.lazy("app.auth.types")
    ]:
        """Return the webauthn credentials for the current user."""
        from app.auth.types import WebAuthnCredentialConnectionType

        sessions = await web_authn_credential_repo.get_all_by_account_id(
            account_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return WebAuthnCredentialConnectionType.marshal(sessions)


ViewerPayload = Annotated[
    AccountType | NotAuthenticatedErrorType,
    strawberry.union(
        name="ViewerPayload",
        description="The viewer payload.",
    ),
]

UpdateProfilePayload = Annotated[
    AccountType,
    strawberry.union(
        name="UpdateProfilePayload",
        description="The update profile payload.",
    ),
]

UpdateAccountPayload = Annotated[
    AccountType | AccountNotFoundErrorType,
    strawberry.union(
        name="UpdateAccountPayload",
        description="The update account payload.",
    ),
]


SaveJobPayload = Annotated[
    AccountType,
    strawberry.union(
        name="SaveJobPayload",
        description="The save job payload.",
    ),
]
