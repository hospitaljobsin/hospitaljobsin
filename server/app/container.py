from functools import lru_cache

import aioinject

from app.companies.repositories import CompanyRepo
from app.jobs.repositories import JobRepo


@lru_cache
def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(CompanyRepo))
    return container
