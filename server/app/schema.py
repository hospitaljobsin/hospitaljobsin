from datetime import datetime

from aioinject.ext.strawberry import AioInjectExtension
from fastapi import UploadFile
from graphql import NoSchemaIntrospectionCustomRule
from strawberry import Schema
from strawberry.extensions import AddValidationRules, ParserCache, ValidationCache
from strawberry.file_uploads import Upload
from strawberry.schema.config import StrawberryConfig
from strawberry.tools import merge_types

from app.accounts.mutation import AccountMutation
from app.accounts.query import AccountQuery
from app.auth.mutation import AuthMutation
from app.auth.query import AuthQuery
from app.config import AppSettings, get_settings
from app.core.schema.extensions import PersistedQueriesExtension
from app.geocoding.query import GeocodingQuery
from app.jobs.mutation import JobMutation
from app.jobs.query import JobQuery
from app.organizations.mutation import OrganizationMutation
from app.organizations.query import OrganizationQuery
from app.scalars import DateTime

from .base.query import BaseQuery
from .container import create_container

query = merge_types(
    name="Query",
    types=(
        AccountQuery,
        AuthQuery,
        BaseQuery,
        JobQuery,
        OrganizationQuery,
        GeocodingQuery,
    ),
)


mutation = merge_types(
    name="Mutation",
    types=(
        AuthMutation,
        JobMutation,
        AccountMutation,
        OrganizationMutation,
    ),
)


def create_schema(app_settings: AppSettings) -> Schema:
    """Create a GraphQL schema."""
    extensions = [
        AioInjectExtension(
            container=create_container(),
        ),
        PersistedQueriesExtension(
            persisted_queries_path=app_settings.persisted_queries_path
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
    ]

    if app_settings.is_production:
        extensions.append(
            AddValidationRules([NoSchemaIntrospectionCustomRule]),
        )
    return Schema(
        query=query,
        mutation=mutation,
        extensions=extensions,
        scalar_overrides={datetime: DateTime, UploadFile: Upload},
        config=StrawberryConfig(
            auto_camel_case=True,
            # TODO: enable batching once the relay client can support this with
            # proper persisted queries configuration
            # batching_config={
            #     "max_operations": 5,
            # },
        ),
    )


schema = create_schema(app_settings=get_settings(AppSettings))
