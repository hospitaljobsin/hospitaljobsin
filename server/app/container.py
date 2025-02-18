from functools import lru_cache

import aioinject

from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.accounts.services import AccountService, ProfileService
from app.auth.repositories import PasswordResetTokenRepo, SessionRepo
from app.auth.services import AuthService
from app.jobs.repositories import JobRepo, SavedJobRepo
from app.jobs.services import SavedJobService
from app.lib.aws_sdk import get_aioboto3_session, get_s3_client
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from app.organizations.services import OrganizationService


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Scoped(get_aioboto3_session))
    container.register(aioinject.Scoped(get_s3_client))
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
    return container
