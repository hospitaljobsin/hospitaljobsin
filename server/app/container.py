from functools import lru_cache

import aioinject

from app.auth.services import AuthService
from app.companies.repositories import CompanyRepo
from app.jobs.repositories import JobRepo
from app.profiles.repositories import ProfileRepo


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(CompanyRepo))
    container.register(aioinject.Scoped(AuthService))
    container.register(aioinject.Singleton(ProfileRepo))
    return container
