from functools import lru_cache

import aioinject

from app.auth.services import AuthService
from app.companies.repositories import CompanyRepo
from app.jobs.repositories import JobRepo
from app.lib.boto3 import get_cognito_idp_client, get_session


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(CompanyRepo))
    container.register(aioinject.Scoped(get_session))
    container.register(aioinject.Scoped(get_cognito_idp_client))
    container.register(aioinject.Scoped(AuthService))
    return container
