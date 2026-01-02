import contextlib
from collections.abc import AsyncIterator, Mapping
from functools import lru_cache
from typing import Any, assert_never

import aioinject
import sentry_sdk
from aioinject import Scope
from aioinject._internal.type_sources import TypeResolver
from aioinject.context import ProviderRecord
from aioinject.ext.fastapi import FastAPIExtension
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

from app.accounts.dataloaders import (
    create_account_by_id_dataloader,
)
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    PhoneNumberVerificationTokenRepo,
)
from app.accounts.services import AccountService
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
    BingIndexNowSettings,
    DatabaseSettings,
    EmailSettings,
    EnvironmentSettings,
    FrontendSettings,
    GoogleIndexingSettings,
    JobAlertsSettings,
    Oauth2Settings,
    PosthogSettings,
    ProviderSettings,
    RedisSettings,
    RevalidateSettings,
    SecretSettings,
    TesseractSettings,
    TSettings,
    TwoFactorINSettings,
    WhatsappSettings,
    get_settings,
)
from app.core.analytics import create_posthog_client
from app.core.aws_sdk import (
    create_aioboto3_session,
    create_bedrock_runtime_client,
    create_s3_client,
    create_ses_client,
    create_sqs_client,
    create_textract_client,
)
from app.core.captcha import create_captcha_verifier
from app.core.emails import (
    BaseEmailSender,
    DummyEmailSender,
    SESEmailSender,
    SMTPEmailSender,
    create_smtp_client,
)
from app.core.embeddings import (
    BaseEmbeddingsService,
    EmbeddingsService,
    LocalEmbeddingsService,
)
from app.core.messages import (
    BaseMessageSender,
    DummyMessageSender,
    TwoFactorINSMSMessageSender,
)
from app.core.oauth import create_oauth_client
from app.core.ocr import BaseOCRClient, TesseractOCRClient, TextractOCRClient
from app.core.redis_client import create_redis_client
from app.core.templates import create_jinja2_environment, create_jinja2_mjml_environment
from app.dataloaders import create_dataloaders
from app.mailbox.messages import DummyMailbox
from app.revalidation.services import (
    BaseRevalidationService,
    DummyRevalidationService,
    RevalidationService,
)
from app.testing.services import TestSetupService

settings_classes: list[type[BaseSettings]] = [
    AppSettings,
    DatabaseSettings,
    SecretSettings,
    EmailSettings,
    ProviderSettings,
    AWSSettings,
    AuthSettings,
    RedisSettings,
    TesseractSettings,
    WhatsappSettings,
    PosthogSettings,
    EnvironmentSettings,
    FrontendSettings,
    TwoFactorINSettings,
    Oauth2Settings,
    RevalidateSettings,
    JobAlertsSettings,
    BingIndexNowSettings,
    GoogleIndexingSettings,
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
        type_resolver: TypeResolver,  # noqa: ARG002
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
    provider_settings = get_settings(ProviderSettings)

    match provider_settings.email_provider:
        case "smtp":
            container.register(aioinject.Singleton(create_smtp_client))
            container.register(aioinject.Scoped(SMTPEmailSender, BaseEmailSender))
        case "aws_ses":
            container.register(aioinject.Scoped(create_ses_client))
            container.register(aioinject.Scoped(SESEmailSender, BaseEmailSender))
        case "dummy":
            container.register(aioinject.Singleton(DummyMailbox))
            container.register(aioinject.Scoped(DummyEmailSender, BaseEmailSender))
        case _ as unreachable:
            assert_never(unreachable)


def register_ocr_client(container: aioinject.Container) -> None:
    env_settings = get_settings(EnvironmentSettings)
    if env_settings.is_production or env_settings.is_staging:
        container.register(aioinject.Scoped(create_textract_client))
        container.register(aioinject.Scoped(TextractOCRClient, BaseOCRClient))
    else:
        container.register(aioinject.Singleton(TesseractOCRClient, BaseOCRClient))


def register_message_sender(container: aioinject.Container) -> None:
    env_settings = get_settings(EnvironmentSettings)
    if env_settings.is_production or env_settings.is_staging:
        container.register(
            aioinject.Scoped(TwoFactorINSMSMessageSender, BaseMessageSender)
        )
    else:
        container.register(aioinject.Singleton(DummyMessageSender, BaseMessageSender))


def register_revalidation_service(container: aioinject.Container) -> None:
    env_settings = get_settings(EnvironmentSettings)
    if env_settings.is_production or env_settings.is_staging:
        container.register(
            aioinject.Scoped(RevalidationService, BaseRevalidationService)
        )
    else:
        container.register(
            aioinject.Singleton(DummyRevalidationService, BaseRevalidationService)
        )


def register_embeddings_service(container: aioinject.Container) -> None:
    env_settings = get_settings(EnvironmentSettings)
    if (
        env_settings.is_production
        or env_settings.is_staging
        or env_settings.is_development
    ):
        container.register(
            aioinject.Singleton(EmbeddingsService, BaseEmbeddingsService)
        )
    else:
        container.register(
            aioinject.Singleton(LocalEmbeddingsService, BaseEmbeddingsService)
        )


@lru_cache
def create_container() -> aioinject.Container:
    """Create a container instance."""
    container = aioinject.Container(
        extensions=[
            SettingsProviderExtension(),
            SentryInstrumentation(),
            FastAPIExtension(),
        ]
    )
    for settings_cls in settings_classes:
        container.register(SettingsProvider(settings_cls))
    container.register(aioinject.Singleton(create_jinja2_mjml_environment))
    container.register(aioinject.Singleton(create_jinja2_environment))
    register_email_sender(container)
    register_ocr_client(container)
    register_message_sender(container)
    register_revalidation_service(container)
    register_embeddings_service(container)
    env_settings = get_settings(EnvironmentSettings)
    if env_settings.is_testing or env_settings.is_staging:
        container.register(aioinject.Scoped(TestSetupService))
    container.register(aioinject.Singleton(create_posthog_client))
    container.register(aioinject.Singleton(create_aioboto3_session))
    container.register(aioinject.Scoped(create_s3_client))
    container.register(aioinject.Scoped(create_sqs_client))
    container.register(aioinject.Scoped(create_bedrock_runtime_client))
    container.register(aioinject.Singleton(create_oauth_client))
    container.register(aioinject.Singleton(create_captcha_verifier))
    container.register(aioinject.Singleton(create_redis_client))
    container.register(aioinject.Singleton(PhoneNumberVerificationTokenRepo))
    container.register(aioinject.Scoped(AuthService))
    container.register(aioinject.Scoped(AccountService))
    container.register(aioinject.Singleton(AccountRepo))
    container.register(aioinject.Singleton(SessionRepo))
    container.register(aioinject.Singleton(EmailVerificationTokenRepo))
    container.register(aioinject.Singleton(PasswordResetTokenRepo))
    container.register(aioinject.Singleton(WebAuthnCredentialRepo))
    container.register(aioinject.Singleton(WebAuthnChallengeRepo))
    container.register(aioinject.Singleton(OauthCredentialRepo))
    container.register(aioinject.Singleton(TwoFactorAuthenticationChallengeRepo))
    container.register(aioinject.Singleton(RecoveryCodeRepo))
    container.register(aioinject.Singleton(TemporaryTwoFactorChallengeRepo))
    container.register(aioinject.Scoped(create_account_by_id_dataloader))
    container.register(aioinject.Scoped(create_dataloaders))
    return container
