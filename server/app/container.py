from functools import lru_cache

import aioinject

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
from app.config import Settings
from app.core.aws_sdk import get_aioboto3_session, get_s3_client
from app.core.emails import EmailSender, get_smtp_client
from app.core.oauth import get_oauth_client
from app.core.recaptcha import get_recaptcha_verifier
from app.core.templates import get_jinja2_environment
from app.jobs.repositories import JobRepo, SavedJobRepo
from app.jobs.services import SavedJobService
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from app.organizations.services import OrganizationMemberService, OrganizationService


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Object(Settings()))
    container.register(aioinject.Singleton(get_jinja2_environment))
    container.register(aioinject.Singleton(get_smtp_client))
    container.register(aioinject.Scoped(EmailSender))
    container.register(aioinject.Scoped(get_aioboto3_session))
    container.register(aioinject.Scoped(get_s3_client))
    container.register(aioinject.Singleton(get_oauth_client))
    container.register(aioinject.Singleton(get_recaptcha_verifier))
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
    return container
