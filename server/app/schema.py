from datetime import datetime

from aioinject.ext.strawberry import AioInjectExtension
from fastapi import UploadFile
from graphql import NoSchemaIntrospectionCustomRule
from strawberry import Schema
from strawberry.extensions import (
    AddValidationRules,
    ParserCache,
    QueryDepthLimiter,
    SchemaExtension,
    ValidationCache,
)
from strawberry.file_uploads import Upload
from strawberry.schema.config import StrawberryConfig
from strawberry.tools import merge_types

from app.accounts.mutation import AccountMutation
from app.accounts.query import AccountQuery
from app.auth.mutation import AuthMutation
from app.auth.query import AuthQuery
from app.config import AppSettings, EnvironmentSettings, get_settings
from app.core.schema.extensions.mask_errors import MaskErrors
from app.core.schema.extensions.persisted_queries import PersistedQueriesExtension
from app.geocoding.query import GeocodingQuery
from app.job_alerts.mutation import JobAlertMutation
from app.job_alerts.query import JobAlertQuery
from app.jobs.mutation import JobMutation
from app.jobs.query import JobQuery
from app.organizations.mutation import OrganizationMutation
from app.organizations.query import OrganizationQuery
from app.scalars import DateTime
from app.stats.query import StatsQuery

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
        JobAlertQuery,
        StatsQuery,
    ),
)


mutation = merge_types(
    name="Mutation",
    types=(
        AuthMutation,
        JobMutation,
        AccountMutation,
        OrganizationMutation,
        JobAlertMutation,
    ),
)


def create_schema(
    app_settings: AppSettings, env_settings: EnvironmentSettings
) -> Schema:
    """Create a GraphQL schema."""
    extensions: list[SchemaExtension] = [
        AioInjectExtension(
            container=create_container(),
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
        QueryDepthLimiter(max_depth=10),
    ]

    if not env_settings.is_testing:
        extensions.extend(
            [
                PersistedQueriesExtension(
                    persisted_queries_path=app_settings.persisted_queries_path
                ),
            ]
        )

    if env_settings.is_production or env_settings.is_staging:
        extensions.extend(
            [
                AddValidationRules([NoSchemaIntrospectionCustomRule]),
                MaskErrors(
                    error_message="An error occurred while processing your request.",
                ),
            ]
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


schema = create_schema(
    app_settings=get_settings(AppSettings),
    env_settings=get_settings(EnvironmentSettings),
)
