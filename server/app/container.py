import contextlib
from collections.abc import AsyncIterator, Mapping
from functools import lru_cache
from typing import Any, assert_never

import aioinject
import sentry_sdk
from aioinject import Scope
from aioinject.context import ProviderRecord
from aioinject.extensions import (
    OnResolveContextExtension,
    ProviderExtension,
)
from aioinject.extensions.providers import (
    CacheDirective,
    ProviderInfo,
    ResolveDirective,
)
from pydantic_settings import BaseSettings

from app.accounts.agents.profile_parser import create_profile_parser_agent
from app.accounts.dataloaders import (
    create_account_by_id_dataloader,
    create_profile_by_id_dataloader,
)
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.accounts.services import AccountService, ProfileParserService, ProfileService
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
    RedisSettings,
    SecretSettings,
    TesseractSettings,
    TSettings,
    get_settings,
)
from app.core.aws_sdk import (
    create_aioboto3_session,
    create_bedrock_runtime_client,
    create_location_service_client,
    create_s3_client,
    create_ses_client,
    create_sqs_client,
    create_textract_client,
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
from app.core.ocr import BaseOCRClient, TesseractOCRClient, TextractOCRClient
from app.core.redis_client import create_redis_client
from app.core.templates import create_jinja2_environment
from app.dataloaders import create_dataloaders
from app.embeddings.services import EmbeddingsService
from app.jobs.agents.applicant_analysis import (
    create_job_applicant_analyzer_agent,
)
from app.jobs.agents.applicant_query_parser import create_applicant_query_parser_agent
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
    JobApplicantAnalysisService,
    JobApplicantService,
    JobApplicationFormService,
    JobMetricService,
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
    RedisSettings,
    TesseractSettings,
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
        self.enabled: bool = enabled

    @contextlib.asynccontextmanager
    async def on_resolve_context(
        self, provider: ProviderRecord[Any]
    ) -> AsyncIterator[None]:
        with sentry_sdk.start_span(
            op="di.provide", description=f"{provider.info.interface}"
        ):
            yield


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
            container.register(aioinject.Singleton(create_nominatim_geocoder))
            container.register(
                aioinject.Scoped(NominatimLocationService, BaseLocationService)
            )
        case "aws_location":
            container.register(aioinject.Scoped(create_location_service_client))
            container.register(
                aioinject.Scoped(AWSLocationService, BaseLocationService)
            )
        case _ as unreachable:
            assert_never(unreachable)


def register_ocr_client(container: aioinject.Container) -> None:
    app_settings = get_settings(AppSettings)
    if app_settings.is_production:
        container.register(aioinject.Scoped(create_textract_client))
        container.register(aioinject.Scoped(TextractOCRClient, BaseOCRClient))
    else:
        container.register(aioinject.Singleton(TesseractOCRClient, BaseOCRClient))


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container(
        extensions=[
            SettingsProviderExtension(),
            SentryInstrumentation(),
        ]
    )
    for settings_cls in settings_classes:
        container.register(SettingsProvider(settings_cls))
    container.register(aioinject.Singleton(create_jinja2_environment))
    register_email_sender(container)
    register_location_service(container)
    register_ocr_client(container)
    app_settings = get_settings(AppSettings)
    if app_settings.is_testing:
        container.register(aioinject.Scoped(TestSetupService))
    container.register(aioinject.Singleton(create_aioboto3_session))
    container.register(aioinject.Scoped(create_s3_client))
    container.register(aioinject.Scoped(create_sqs_client))
    container.register(aioinject.Scoped(create_bedrock_runtime_client))
    container.register(aioinject.Singleton(create_oauth_client))
    container.register(aioinject.Singleton(create_captcha_verifier))
    container.register(aioinject.Singleton(create_google_genai_client))
    container.register(aioinject.Singleton(create_redis_client))
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
    container.register(aioinject.Scoped(JobMetricService))
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
    container.register(aioinject.Singleton(create_applicant_query_parser_agent))
    container.register(aioinject.Singleton(create_profile_parser_agent))
    container.register(aioinject.Singleton(JobApplicantAnalysisService))
    container.register(aioinject.Singleton(ProfileParserService))
    return container
