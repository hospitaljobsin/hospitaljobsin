from collections.abc import Iterable
from datetime import date, datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Optional, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from beanie import Link
from bson import ObjectId
from strawberry import relay

from app.accounts.documents import (
    Account,
    BaseProfile,
    Certification,
    Education,
    Language,
    License,
    Profile,
    SalaryExpectations,
    WorkExperience,
)
from app.auth.repositories import SessionRepo, WebAuthnCredentialRepo
from app.base.types import (
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


@strawberry.enum(
    name="LanguageProficiency",
    description="Language proficiency level.",
)
class LanguageProficiencyEnum(Enum):
    NATIVE = "NATIVE"
    PROFESSIONAL = "PROFESSIONAL"
    BASIC = "BASIC"


@strawberry.enum(
    name="LicenseVerificationStatus",
    description="License verification status.",
)
class LicenseVerificationStatusEnum(Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


@strawberry.type(
    name="Language",
    description="The language details.",
)
class LanguageType:
    name: str = strawberry.field(description="The name of the language.")
    proficiency: str = strawberry.field(
        description="The proficiency level of the language."
    )

    @classmethod
    def marshal(cls, language: Language) -> Self:
        return cls(name=language.name, proficiency=language.proficiency)


@strawberry.input(
    name="LanguageInput",
    description="The language details input.",
)
class LanguageInputType:
    name: str = strawberry.field(
        description="The name of the language.",
    )
    proficiency: LanguageProficiencyEnum = strawberry.field(
        description="The proficiency level of the language.",
    )

    def to_document(self) -> Language:
        return Language(
            name=self.name,
            proficiency=self.proficiency.value,
        )


@strawberry.input(
    name="CertificationInput",
    description="The certification details input.",
)
class CertificationInputType:
    name: str = strawberry.field(description="The name of the certification.")
    issuer: str = strawberry.field(description="The issuer of the certification.")
    certification_url: str = strawberry.field(
        description="The URL of the certification."
    )
    created_at: date = strawberry.field(
        description="When the certification was obtained."
    )
    expires_at: date | None = strawberry.field(
        description="When the certification expires.", default=None
    )

    def to_document(self):
        return Certification(
            name=self.name,
            issuer=self.issuer,
            certification_url=self.certification_url,
            created_at=self.created_at,
            expires_at=self.expires_at,
        )


@strawberry.input(
    name="EducationInput",
    description="The education details input.",
)
class EducationInputType:
    degree: str = strawberry.field(description="The degree obtained.")
    institution: str = strawberry.field(description="The institution attended.")
    started_at: date = strawberry.field(description="When the degree was started.")
    completed_at: date | None = strawberry.field(
        description="When the degree was completed."
    )

    def to_document(self) -> Education:
        return Education(
            degree=self.degree,
            institution=self.institution,
            started_at=self.started_at,
            completed_at=self.completed_at,
        )


@strawberry.enum(name="EmploymentType", description="Type of employment.")
class EmploymentTypeEnum(Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    CONTRACT = "CONTRACT"
    INTERNSHIP = "INTERNSHIP"
    TEMPORARY = "TEMPORARY"
    VOLUNTEER = "VOLUNTEER"
    OTHER = "OTHER"


@strawberry.input(
    name="WorkExperienceInput",
    description="The work experience details input.",
)
class WorkExperienceInputType:
    title: str = strawberry.field(description="The job title.")
    description: str | None = strawberry.field(description="The job description.")
    organization: str = strawberry.field(description="The organization name.")
    started_at: date = strawberry.field(description="When the job started.")
    completed_at: date | None = strawberry.field(description="When the job ended.")
    employment_type: EmploymentTypeEnum | None = strawberry.field(
        description="Type of employment.",
        default=None,
    )
    skills: list[str] = strawberry.field(description="Skills used in this job.")

    def to_document(self) -> WorkExperience:
        return WorkExperience(
            title=self.title,
            description=self.description,
            organization=self.organization,
            started_at=self.started_at,
            completed_at=self.completed_at,
            employment_type=self.employment_type.value
            if self.employment_type
            else None,
            skills=self.skills,
        )


@strawberry.type(
    name="CreateProfilePicturePresignedURLPayload",
    description="The payload for creating a profile picture presigned URL.",
)
class CreateProfilePicturePresignedURLPayloadType:
    presigned_url: str = strawberry.field(
        description="The presigned URL for uploading the profile picture.",
    )


@strawberry.interface(
    name="BaseProfile",
    description="A base profile belonging to a user.",
)
class BaseProfileType:
    gender: GenderTypeEnum | None = strawberry.field(
        description="The gender of the profile's user.",
    )
    date_of_birth: date | None = strawberry.field(
        description="The date of birth of the profile's user.",
    )
    address: str = strawberry.field(
        description="The address of the profile's user.",
    )
    marital_status: MaritalStatusTypeEnum | None = strawberry.field(
        description="The marital status of the profile's user.",
    )
    category: str | None = strawberry.field(
        description="The category of the profile's user.",
    )
    locations_open_to_work: list[str] = strawberry.field(
        description="Locations the user is open to work in.",
    )
    open_to_relocation_anywhere: bool = strawberry.field(
        description="Whether the user is open to relocation anywhere.",
    )
    education: list["EducationType"] = strawberry.field(
        description="The user's education history.",
    )
    licenses: list["LicenseType"] = strawberry.field(
        description="The user's licenses.",
    )
    languages: list["LanguageType"] = strawberry.field(
        description="The list of languages spoken by the profile's user.",
    )
    job_preferences: list[str] = strawberry.field(
        description="The user's job preferences.",
    )
    work_experience: list["WorkExperienceType"] = strawberry.field(
        description="The user's work experience.",
    )
    salary_expectations: Optional["SalaryExpectationsType"] = strawberry.field(
        description="The user's salary expectations.",
    )
    certifications: list["CertificationType"] = strawberry.field(
        description="The user's certifications.",
    )
    professional_summary: str | None = strawberry.field(
        description="The user's professional summary.",
    )
    headline: str | None = strawberry.field(
        description="The user's headline.",
    )


@strawberry.type(
    name="ParsedProfile",
    description="A parsed profile.",
)
class ParsedProfileType(BaseProfileType):
    @classmethod
    def marshal(cls, model: BaseProfile) -> Self:
        """Marshal into a node instance."""
        return cls(
            gender=GenderTypeEnum[model.gender] if model.gender else None,
            date_of_birth=model.date_of_birth,
            address=model.address,
            marital_status=MaritalStatusTypeEnum[model.marital_status]
            if model.marital_status is not None
            else None,
            category=model.category,
            locations_open_to_work=[loc.name for loc in model.locations_open_to_work],
            open_to_relocation_anywhere=model.open_to_relocation_anywhere,
            education=[EducationType.marshal(edu) for edu in model.education],
            licenses=[LicenseType.marshal(lic) for lic in model.licenses],
            languages=[LanguageType.marshal(language) for language in model.languages],
            job_preferences=model.job_preferences,
            work_experience=[
                WorkExperienceType.marshal(exp) for exp in model.work_experience
            ],
            salary_expectations=SalaryExpectationsType.marshal(
                model.salary_expectations
            )
            if model.salary_expectations is not None
            else None,
            certifications=[
                CertificationType.marshal(cert) for cert in model.certifications
            ],
            professional_summary=model.professional_summary,
            headline=model.headline,
        )


@strawberry.type(
    name="Profile",
    description="An account's profile.",
)
class ProfileType(BaseProfileType, BaseNodeType[Profile]):
    updated_at: datetime = strawberry.field(
        description="When the profile was last updated.",
    )

    is_complete: bool = strawberry.field(
        description="Whether the profile is complete.",
    )

    @classmethod
    def marshal(cls, model: Profile) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(model.id),
            gender=GenderTypeEnum[model.gender] if model.gender else None,
            date_of_birth=model.date_of_birth,
            address=model.address,
            marital_status=MaritalStatusTypeEnum[model.marital_status]
            if model.marital_status is not None
            else None,
            category=model.category,
            locations_open_to_work=[loc.name for loc in model.locations_open_to_work],
            open_to_relocation_anywhere=model.open_to_relocation_anywhere,
            education=[EducationType.marshal(edu) for edu in model.education],
            licenses=[LicenseType.marshal(lic) for lic in model.licenses],
            languages=[LanguageType.marshal(language) for language in model.languages],
            job_preferences=model.job_preferences,
            work_experience=[
                WorkExperienceType.marshal(exp) for exp in model.work_experience
            ],
            salary_expectations=SalaryExpectationsType.marshal(
                model.salary_expectations
            )
            if model.salary_expectations is not None
            else None,
            certifications=[
                CertificationType.marshal(cert) for cert in model.certifications
            ],
            updated_at=model.updated_at,
            is_complete=model.is_complete,
            professional_summary=model.professional_summary,
            headline=model.headline,
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

    uploaded_avatar_url: strawberry.Private[str | None] = None

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
            profile_ref=account.profile.ref.id
            if isinstance(account.profile, Link)
            else account.profile,
            uploaded_avatar_url=account.avatar_url,
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
        graphql_type=ProfileType | None,
        description="The account's profile.",
    )
    @inject
    async def profile(self, info: Info) -> ProfileType | None:
        if self.profile_ref is None:
            return None
        if isinstance(self.profile_ref, Profile):
            return ProfileType.marshal(self.profile_ref)
        result = await info.context["loaders"].profile_by_id.load(str(self.profile_ref))
        if result is None:
            return None
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
        if self.uploaded_avatar_url:
            return self.uploaded_avatar_url

        return f"https://api.dicebear.com/9.x/shapes/png?seed={self.full_name}"

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


ParseProfileDocumentPayload = Annotated[
    ProfileType,
    strawberry.union(
        name="ParseProfileDocumentPayload",
        description="The parse profile document payload.",
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


SaveJobPayload = Annotated[
    AccountType,
    strawberry.union(
        name="SaveJobPayload",
        description="The save job payload.",
    ),
]


@strawberry.type(name="Education")
class EducationType:
    degree: str
    institution: str
    started_at: date
    completed_at: date | None

    @classmethod
    def marshal(cls, edu: Education) -> Self:
        return cls(
            degree=edu.degree,
            institution=edu.institution,
            started_at=edu.started_at,
            completed_at=edu.completed_at,
        )


@strawberry.type(name="License")
class LicenseType:
    name: str
    issuer: str
    license_number: str
    registration_year: int
    verification_status: LicenseVerificationStatusEnum
    verified_at: date | None

    @classmethod
    def marshal(cls, lic: License) -> Self:
        return cls(
            name=lic.name,
            issuer=lic.issuer,
            license_number=lic.license_number,
            registration_year=lic.registration_year,
            verification_status=LicenseVerificationStatusEnum(lic.verification_status),
            verified_at=lic.verified_at,
        )


@strawberry.type(name="WorkExperience")
class WorkExperienceType:
    title: str
    description: str | None
    organization: str
    started_at: date
    completed_at: date | None
    employment_type: EmploymentTypeEnum | None
    skills: list[str]

    @classmethod
    def marshal(cls, exp: WorkExperience) -> Self:
        return cls(
            title=exp.title,
            description=exp.description,
            organization=exp.organization,
            started_at=exp.started_at,
            completed_at=exp.completed_at,
            employment_type=EmploymentTypeEnum(exp.employment_type)
            if exp.employment_type
            else None,
            skills=exp.skills,
        )


@strawberry.type(name="SalaryExpectations")
class SalaryExpectationsType:
    preferred_monthly_salary_inr: int
    negotiable: bool

    @classmethod
    def marshal(cls, se: SalaryExpectations) -> Self:
        return cls(
            preferred_monthly_salary_inr=se.preferred_monthly_salary_inr,
            negotiable=se.negotiable,
        )


@strawberry.type(name="Certification")
class CertificationType:
    name: str
    issuer: str
    certification_url: str
    created_at: date
    expires_at: date | None

    @classmethod
    def marshal(cls, cert: Certification) -> Self:
        return cls(
            name=cert.name,
            issuer=cert.issuer,
            certification_url=cert.certification_url,
            created_at=cert.created_at,
            expires_at=cert.expires_at,
        )


@strawberry.input(
    name="LicenseInput",
    description="The license details input.",
)
class LicenseInputType:
    name: str = strawberry.field(description="The name of the license.")
    issuer: str = strawberry.field(description="The issuer of the license.")
    license_number: str = strawberry.field(description="The license number.")
    registration_year: date = strawberry.field(
        description="The year when the license was issued."
    )

    def to_document(self):
        return License(
            name=self.name,
            issuer=self.issuer,
            license_number=self.license_number,
            registration_year=self.registration_year,
            verification_status="pending",
            verified_at=None,
            verification_notes=None,
        )
