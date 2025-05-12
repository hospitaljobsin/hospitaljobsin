from datetime import datetime

from aioinject.ext.strawberry import AioInjectExtension
from strawberry import Schema
from strawberry.extensions import ParserCache, ValidationCache
from strawberry.schema.config import StrawberryConfig
from strawberry.tools import merge_types

from app.accounts.mutation import AccountMutation
from app.accounts.query import AccountQuery
from app.auth.mutation import AuthMutation
from app.auth.query import AuthQuery
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


schema = Schema(
    query=query,
    mutation=mutation,
    extensions=[
        AioInjectExtension(
            container=create_container(),
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
    ],
    scalar_overrides={datetime: DateTime},
    config=StrawberryConfig(
        auto_camel_case=True,
    ),
)
