from aioinject.ext.strawberry import AioInjectExtension
from strawberry import Schema
from strawberry.extensions import ParserCache, SchemaExtension, ValidationCache
from strawberry.relay import GlobalID
from strawberry.tools import merge_types

from app.accounts.mutation import AccountMutation
from app.accounts.query import AccountQuery
from app.auth.mutation import AuthMutation
from app.jobs.mutation import JobMutation
from app.jobs.query import JobQuery
from app.organizations.mutation import OrganizationMutation
from app.organizations.query import OrganizationQuery
from app.scalars import ID

from .base.query import BaseQuery
from .container import create_container

query = merge_types(
    name="Query",
    types=(
        AccountQuery,
        BaseQuery,
        JobQuery,
        OrganizationQuery,
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


class MyExtension(SchemaExtension):
    def on_validate(self):
        print("GraphQL operation start")
        print("Query:", self.execution_context.query)
        yield


schema = Schema(
    query=query,
    mutation=mutation,
    extensions=[
        AioInjectExtension(
            container=create_container(),
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
        MyExtension,
    ],
    scalar_overrides={GlobalID: ID},
)
