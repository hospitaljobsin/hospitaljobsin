from functools import lru_cache

import aioinject

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
from app.config import Settings
from app.core.aws_sdk import create_aioboto3_session, create_s3_client
from app.core.emails import EmailSender, create_smtp_client
from app.core.oauth import create_oauth_client
from app.core.recaptcha import create_recaptcha_verifier
from app.core.templates import create_jinja2_environment
from app.dataloaders import create_dataloaders
from app.jobs.dataloaders import (
    create_job_application_form_by_id_dataloader,
    create_job_by_id_dataloader,
    create_job_by_slug_dataloader,
    create_saved_job_by_id_dataloader,
)
from app.jobs.repositories import (
    JobApplicationFormRepo,
    JobApplicationRepo,
    JobRepo,
    SavedJobRepo,
)
from app.jobs.services import JobApplicationFormService, JobService, SavedJobService
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


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Object(Settings()))  # type: ignore[arg-type]
    container.register(aioinject.Singleton(create_jinja2_environment))
    container.register(aioinject.Singleton(create_smtp_client))
    container.register(aioinject.Scoped(EmailSender))
    container.register(aioinject.Scoped(create_aioboto3_session))
    container.register(aioinject.Scoped(create_s3_client))
    container.register(aioinject.Singleton(create_oauth_client))
    container.register(aioinject.Singleton(create_recaptcha_verifier))
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
    container.register(aioinject.Singleton(JobApplicationRepo))
    container.register(aioinject.Singleton(JobApplicationFormRepo))
    container.register(aioinject.Scoped(JobApplicationFormService))
    container.register(aioinject.Scoped(OrganizationInviteService))
    container.register(aioinject.Scoped(create_account_by_id_dataloader))
    container.register(aioinject.Scoped(create_profile_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_by_slug_dataloader))
    container.register(aioinject.Scoped(create_saved_job_by_id_dataloader))
    container.register(aioinject.Scoped(create_organization_by_id_dataloader))
    container.register(aioinject.Scoped(create_organization_by_slug_dataloader))
    container.register(aioinject.Scoped(create_organization_invite_by_token_dataloader))
    container.register(aioinject.Scoped(create_job_application_form_by_id_dataloader))
    container.register(aioinject.Scoped(create_dataloaders))
    return container
