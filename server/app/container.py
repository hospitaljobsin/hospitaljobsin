import contextlib
from collections.abc import AsyncIterator, Mapping
from functools import lru_cache
from typing import Any, assert_never

import aioinject
import sentry_sdk
from aioinject import Scope
from aioinject.context import ProviderRecord
from aioinject.extensions import (
    LifespanExtension,
    OnResolveContextExtension,
    ProviderExtension,
)
from aioinject.extensions.providers import (
    CacheDirective,
    ProviderInfo,
    ResolveDirective,
)
from pydantic_settings import BaseSettings
from structlog import get_logger

from app.accounts.dataloaders import (
    create_account_by_id_dataloader,
    create_profile_by_id_dataloader,
)
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.accounts.services import AccountService, ProfileService
from app.auth.repositories import (
    OauthCredentialRepo,
    PasswordResetTokenRepo,
    RecoveryCodeRepo,
    SessionRepo,
    TemporaryTwoFactorChallengeRepo,
    TwoFactorAuthenticationChallengeRepo,
    WebAuthnChallengeRepo,
    WebAuthnCredentialRepo,
)
from app.auth.services import AuthService
from app.config import (
    AppSettings,
    AuthSettings,
    AWSSettings,
    DatabaseSettings,
    EmailSettings,
    GeocoderSettings,
    SecretSettings,
    TSettings,
    get_settings,
)
from app.core.aws_sdk import (
    create_aioboto3_session,
    create_location_service_client,
    create_s3_client,
    create_ses_client,
)
from app.core.captcha import create_captcha_verifier
from app.core.emails import (
    BaseEmailSender,
    SESEmailSender,
    SMTPEmailSender,
    create_smtp_client,
)
from app.core.genai_client import create_google_genai_client
from app.core.geocoding import (
    AWSLocationService,
    BaseLocationService,
    NominatimLocationService,
    create_nominatim_geocoder,
)
from app.core.oauth import create_oauth_client
from app.core.templates import create_jinja2_environment
from app.database import initialize_database
from app.dataloaders import create_dataloaders
from app.embeddings.services import EmbeddingsService
from app.jobs.agents import (
    create_job_applicant_analyzer_agent,
)
from app.jobs.dataloaders import (
    create_applicant_count_by_job_id_dataloader,
    create_job_applicant_by_id_dataloader,
    create_job_applicant_by_slug_dataloader,
    create_job_application_form_by_id_dataloader,
    create_job_by_id_dataloader,
    create_job_by_slug_dataloader,
    create_saved_job_by_id_dataloader,
)
from app.jobs.repositories import (
    JobApplicantRepo,
    JobApplicationFormRepo,
    JobMetricRepo,
    JobRepo,
    SavedJobRepo,
)
from app.jobs.services import (
    JobApplicantService,
    JobApplicationFormService,
    JobService,
    SavedJobService,
)
from app.organizations.dataloaders import (
    create_organization_by_id_dataloader,
    create_organization_by_slug_dataloader,
    create_organization_invite_by_token_dataloader,
)
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)
from app.organizations.services import (
    OrganizationInviteService,
    OrganizationMemberService,
    OrganizationService,
)
from app.testing.services import TestSetupService

settings_classes: list[type[BaseSettings]] = [
    AppSettings,
    DatabaseSettings,
    SecretSettings,
    EmailSettings,
    AWSSettings,
    AuthSettings,
    GeocoderSettings,
]


class SettingsProvider(aioinject.Provider[TSettings]):
    def __init__(self, settings_cls: type[TSettings]) -> None:
        self.implementation = settings_cls

    def provide(
        self,
        kwargs: dict[str, Any],  # noqa: ARG002
    ) -> TSettings:
        return self.implementation()


class SettingsProviderExtension(
    ProviderExtension[SettingsProvider[TSettings]],
):
    def supports_provider(self, provider: object) -> bool:
        return isinstance(provider, SettingsProvider)

    def extract(
        self,
        provider: SettingsProvider[TSettings],
        type_context: Mapping[str, type[object]],  # noqa: ARG002
    ) -> ProviderInfo[TSettings]:
        return ProviderInfo(
            interface=provider.implementation,
            type_=provider.implementation,
            dependencies=(),
            scope=Scope.lifetime,
            compilation_directives=(
                ResolveDirective(is_async=False, is_context_manager=False),
                CacheDirective(),
            ),
        )


class SentryInstrumentation(OnResolveContextExtension):
    def __init__(self, *, enabled: bool = True) -> None:
        self.enabled = enabled

    @contextlib.asynccontextmanager
    async def on_resolve_context(
        self, provider: ProviderRecord[Any]
    ) -> AsyncIterator[None]:
        with sentry_sdk.start_span(
            op="di.provide", description=f"{provider.info.interface}"
        ):
            yield


class MyLifespanExtension(LifespanExtension):
    @contextlib.asynccontextmanager
    async def lifespan(
        self,
        container: aioinject.Container,  # noqa: ARG002
    ) -> AsyncIterator[None]:
        logger = get_logger(__name__)
        database_settings = get_settings(DatabaseSettings)
        logger.debug("Initializing database connection")
        async with initialize_database(
            database_url=str(database_settings.database_url),
            default_database_name=database_settings.default_database_name,
        ) as _:
            yield None


def register_email_sender(container: aioinject.Container) -> None:
    email_settings = get_settings(EmailSettings)

    match email_settings.email_provider:
        case "smtp":
            container.register(aioinject.Scoped(create_smtp_client))
            container.register(aioinject.Scoped(SMTPEmailSender, BaseEmailSender))
        case "aws_ses":
            container.register(aioinject.Scoped(create_ses_client))
            container.register(aioinject.Scoped(SESEmailSender, BaseEmailSender))
        case _ as unreachable:
            assert_never(unreachable)


def register_location_service(container: aioinject.Container) -> None:
    geocoder_settings = get_settings(GeocoderSettings)

    match geocoder_settings.geocoding_provider:
        case "nominatim":
            container.register(aioinject.Scoped(create_nominatim_geocoder))
            container.register(
                aioinject.Scoped(NominatimLocationService, BaseLocationService)
            )
        case "aws_location":
            container.register(aioinject.Scoped(create_location_service_client))
            container.register(
                aioinject.Singleton(AWSLocationService, BaseLocationService)
            )
        case _ as unreachable:
            assert_never(unreachable)


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container(
        extensions=[
            MyLifespanExtension(),
            SettingsProviderExtension(),
            SentryInstrumentation(),
        ]
    )
    for settings_cls in settings_classes:
        container.register(SettingsProvider(settings_cls))
    container.register(aioinject.Singleton(create_jinja2_environment))
    register_email_sender(container)
    register_location_service(container)
    app_settings = get_settings(AppSettings)
    if app_settings.is_testing:
        container.register(aioinject.Scoped(TestSetupService))
    container.register(aioinject.Singleton(create_aioboto3_session))
    container.register(aioinject.Singleton(create_s3_client))
    container.register(aioinject.Singleton(create_oauth_client))
    container.register(aioinject.Singleton(create_captcha_verifier))
    container.register(aioinject.Singleton(create_google_genai_client))
    container.register(aioinject.Singleton(EmbeddingsService))
    container.register(aioinject.Singleton(JobApplicantRepo))
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(SavedJobRepo))
    container.register(aioinject.Scoped(AuthService))
    container.register(aioinject.Singleton(ProfileRepo))
    container.register(aioinject.Scoped(ProfileService))
    container.register(aioinject.Scoped(AccountService))
    container.register(aioinject.Singleton(AccountRepo))
    container.register(aioinject.Singleton(SessionRepo))
    container.register(aioinject.Singleton(EmailVerificationTokenRepo))
    container.register(aioinject.Singleton(PasswordResetTokenRepo))
    container.register(aioinject.Scoped(JobService))
    container.register(aioinject.Scoped(SavedJobService))
    container.register(aioinject.Singleton(OrganizationRepo))
    container.register(aioinject.Singleton(OrganizationMemberRepo))
    container.register(aioinject.Scoped(OrganizationService))
    container.register(aioinject.Scoped(OrganizationMemberService))
    container.register(aioinject.Singleton(WebAuthnCredentialRepo))
    container.register(aioinject.Singleton(WebAuthnChallengeRepo))
    container.register(aioinject.Singleton(OauthCredentialRepo))
    container.register(aioinject.Singleton(TwoFactorAuthenticationChallengeRepo))
    container.register(aioinject.Singleton(RecoveryCodeRepo))
    container.register(aioinject.Singleton(TemporaryTwoFactorChallengeRepo))
    container.register(aioinject.Singleton(OrganizationInviteRepo))
    container.register(aioinject.Singleton(JobApplicationFormRepo))
    container.register(aioinject.Scoped(JobApplicationFormService))
    container.register(aioinject.Scoped(OrganizationInviteService))
    container.register(aioinject.Scoped(JobApplicantService))
    container.register(aioinject.Singleton(JobMetricRepo))
    container.register(aioinject.Scoped(create_account_by_id_dataloader))
    container.register(aioinject.Scoped(create_profile_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_by_slug_dataloader))
    container.register(aioinject.Scoped(create_saved_job_by_id_dataloader))
    container.register(aioinject.Scoped(create_organization_by_id_dataloader))
    container.register(aioinject.Scoped(create_organization_by_slug_dataloader))
    container.register(aioinject.Scoped(create_organization_invite_by_token_dataloader))
    container.register(aioinject.Scoped(create_job_application_form_by_id_dataloader))
    container.register(aioinject.Scoped(create_applicant_count_by_job_id_dataloader))
    container.register(aioinject.Scoped(create_job_applicant_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_applicant_by_slug_dataloader))
    container.register(aioinject.Scoped(create_dataloaders))
    container.register(aioinject.Singleton(create_job_applicant_analyzer_agent))

    return container
