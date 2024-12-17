from functools import lru_cache

import aioinject

from app.accounts.repositories import AccountRepo, EmailVerificationRepo, ProfileRepo
from app.auth.repositories import SessionRepo
from app.auth.services import AuthService
from app.companies.repositories import CompanyRepo, JobRepo
from app.companies.services import JobService


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(CompanyRepo))
    container.register(aioinject.Scoped(AuthService))
    container.register(aioinject.Singleton(ProfileRepo))
    container.register(aioinject.Singleton(AccountRepo))
    container.register(aioinject.Singleton(SessionRepo))
    container.register(aioinject.Singleton(EmailVerificationRepo))
    container.register(aioinject.Scoped(JobService))
    return container
