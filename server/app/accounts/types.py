from collections.abc import Iterable
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import field, relay

from app.accounts.documents import (
    Account,
)
from app.auth.repositories import SessionRepo, WebAuthnCredentialRepo
from app.base.types import (
    BaseErrorType,
    BaseNodeType,
    NotAuthenticatedErrorType,
)
from app.context import AuthInfo, Info
from app.core.constants import TERMS_AND_POLICY_LATEST_VERSION

if TYPE_CHECKING:
    from app.auth.types import (
        SessionConnectionType,
        WebAuthnCredentialConnectionType,
    )


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


@strawberry.enum(
    name="TermsAndPolicyType",
    description="The terms and policy type.",
)
class TermsAndPolicyTypeEnum(Enum):
    ACCEPTANCE = "ACCEPTANCE"
    REJECTION = "REJECTION"
    UNDECIDED = "UNDECIDED"


@strawberry.type(
    name="TermsAndPolicy",
    description="The terms and policy.",
)
class TermsAndPolicyType:
    type: TermsAndPolicyTypeEnum
    updated_at: datetime
    is_latest: bool


@strawberry.enum(
    name="AnalyticsPreferenceInputType",
    description="The analytics preference input type.",
)
class AnalyticsPreferenceInputTypeEnum(Enum):
    ACCEPTANCE = "ACCEPTANCE"
    REJECTION = "REJECTION"


@strawberry.enum(
    name="AnalyticsPreferenceType",
    description="The analytics preference type.",
)
class AnalyticsPreferenceTypeEnum(Enum):
    ACCEPTANCE = "ACCEPTANCE"
    REJECTION = "REJECTION"
    UNDECIDED = "UNDECIDED"


@strawberry.type(
    name="AnalyticsPreference",
    description="The analytics preference.",
)
class AnalyticsPreferenceType:
    type: AnalyticsPreferenceTypeEnum
    updated_at: datetime


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
    avatar_url: str = strawberry.field(
        description="The avatar URL of the account.",
    )
    phone_number: str | None = strawberry.field(
        description="The phone number of the account.",
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

    whatsapp_job_alerts_enabled: bool = strawberry.field(
        description="Whether Whatsapp job alerts have been enabled for the account."
    )

    terms_and_policy: TermsAndPolicyType = strawberry.field(
        description="The terms and policy of the account.",
    )
    analytics_preference: AnalyticsPreferenceType = strawberry.field(
        description="The analytics preference of the account.",
    )

    @classmethod
    def marshal(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            full_name=account.full_name,
            email=account.email,
            phone_number=account.phone_number,
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
            avatar_url=account.avatar_url,
            terms_and_policy=TermsAndPolicyType(
                type=TermsAndPolicyTypeEnum(account.terms_and_policy.type.upper()),
                updated_at=account.terms_and_policy.updated_at,
                is_latest=account.terms_and_policy.version
                == TERMS_AND_POLICY_LATEST_VERSION,
            ),
            analytics_preference=AnalyticsPreferenceType(
                type=AnalyticsPreferenceTypeEnum(
                    account.analytics_preference.type.upper()
                ),
                updated_at=account.analytics_preference.updated_at,
            ),
            whatsapp_job_alerts_enabled=account.whatsapp_job_alerts_enabled,
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
    ) -> Annotated["SessionConnectionType", strawberry.lazy("app.auth.types")]:  # noqa: UP037
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
        "WebAuthnCredentialConnectionType", strawberry.lazy("app.auth.types")  # noqa: UP037
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


@strawberry.type(
    name="GenerateProfileDocumentPresignedURLPayload",
    description="The generate profile document presigned URL payload.",
)
class GenerateProfileDocumentPresignedURLPayloadType:
    file_key: str
    presigned_url: str


UpdateAccountPayload = Annotated[
    AccountType,
    strawberry.union(
        name="UpdateAccountPayload",
        description="The update account payload.",
    ),
]

UpdateAccountAnalyticsPreferencePayload = Annotated[
    AccountType | None,
    strawberry.union(
        name="UpdateAccountAnalyticsPreferencePayload",
        description="The update account analytics preference payload.",
    ),
]


@strawberry.type(name="InvalidPhoneNumberError")
class InvalidPhoneNumberErrorType(BaseErrorType):
    message: str = field(
        default="Invalid phone number provided.",
        description="Human readable error message.",
    )


@strawberry.type(name="InvalidPhoneNumberVerificationTokenError")
class InvalidPhoneNumberVerificationTokenErrorType(BaseErrorType):
    message: str = field(
        default="Invalid phone number verification token provided.",
        description="Human readable error message.",
    )


@strawberry.type(name="PhoneNumberAlreadyExistsError")
class PhoneNumberAlreadyExistsErrorType(BaseErrorType):
    message: str = field(
        default="Phone number provided already exists!",
        description="Human readable error message.",
    )


@strawberry.type(name="PhoneNumberDoesNotExistError")
class PhoneNumberDoesNotExistErrorType(BaseErrorType):
    message: str = field(
        default="Phone number doesn't exist.",
        description="Human readable error message.",
    )


@strawberry.type(name="RequestPhoneNumberVerificationTokenSuccess")
class RequestPhoneNumberVerificationTokenSuccessType(BaseErrorType):
    cooldown_remaining_seconds: int = field(
        description="The remaining seconds before the next phone number verification token can be requested.",
    )
    message: str = field(
        default="Phone number verification token sent.",
        description="Success message.",
    )


@strawberry.type(
    name="PhoneNumberVerificationTokenCooldownError",
    description="Used when the phone number verification token cooldown is active.",
)
class PhoneNumberVerificationTokenCooldownErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Please wait before requesting a new phone number verification token.",
    )
    remaining_seconds: Annotated[
        int,
        strawberry.field(
            description="Remaining seconds before requesting another phone number verification token."
        ),
    ]


@strawberry.type(name="PhoneNumberMissingError")
class PhoneNumberMissingErrorType(BaseErrorType):
    message: str = field(
        default="Account doesn't have a phone number.",
        description="Human readable error message.",
    )


RequestPhoneNumberVerificationTokenPayload = Annotated[
    RequestPhoneNumberVerificationTokenSuccessType
    | PhoneNumberAlreadyExistsErrorType
    | InvalidPhoneNumberErrorType
    | PhoneNumberVerificationTokenCooldownErrorType,
    strawberry.union(
        name="RequestPhoneNumberVerificationTokenPayload",
        description="The create phone number verification token payload.",
    ),
]


UpdateAccountPhoneNumberPayload = Annotated[
    AccountType
    | InvalidPhoneNumberVerificationTokenErrorType
    | InvalidPhoneNumberErrorType,
    strawberry.union(
        name="UpdateAccountPhoneNumberPayload",
        description="The update account phone number payload.",
    ),
]


RemoveAccountPhoneNumberPayload = Annotated[
    AccountType | PhoneNumberDoesNotExistErrorType,
    strawberry.union(
        name="RemoveAccountPhoneNumberPayload",
        description="The remove account phone number payload.",
    ),
]

SaveJobPayload = Annotated[
    AccountType,
    strawberry.union(
        name="SaveJobPayload",
        description="The save job payload.",
    ),
]
