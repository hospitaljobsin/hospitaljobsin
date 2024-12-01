from aioinject.ext.strawberry import AioInjectExtension
from strawberry import Schema
from strawberry.extensions import ParserCache, ValidationCache
from strawberry.extensions.tracing import OpenTelemetryExtension
from strawberry.relay import GlobalID
from strawberry.tools import merge_types

from app.audit_logs.query import AuditLogQuery
from app.config import settings
from app.lib.schema.extensions import PersistedQueriesExtension
from app.questions.mutation import QuestionMutation
from app.questions.query import QuestionQuery
from app.scalars import ID
from app.users.query import UserQuery

from .base.query import BaseQuery
from .container import create_container

query = merge_types(
    name="Query",
    types=(
        BaseQuery,
        QuestionQuery,
        UserQuery,
        AuditLogQuery,
    ),
)


mutation = merge_types(
    name="Mutation",
    types=(QuestionMutation,),
)


schema = Schema(
    query=query,
    mutation=mutation,
    extensions=[
        OpenTelemetryExtension,
        AioInjectExtension(
            container=create_container(),
        ),
        PersistedQueriesExtension(
            persisted_queries_path=settings.persisted_queries_path
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
    ],
    scalar_overrides={GlobalID: ID},
)
