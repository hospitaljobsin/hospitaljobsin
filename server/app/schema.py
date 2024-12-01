from aioinject.ext.strawberry import AioInjectExtension
from strawberry import Schema
from strawberry.extensions import ParserCache, ValidationCache
from strawberry.extensions.tracing import OpenTelemetryExtension
from strawberry.relay import GlobalID
from strawberry.tools import merge_types

from app.jobs.query import JobQuery
from app.scalars import ID

from .base.query import BaseQuery
from .container import create_container

query = merge_types(
    name="Query",
    types=(
        BaseQuery,
        JobQuery,
    ),
)


# mutation = merge_types(
#     name="Mutation",
#     types=(QuestionMutation,),
# )


schema = Schema(
    query=query,
    # mutation=mutation,
    extensions=[
        OpenTelemetryExtension,
        AioInjectExtension(
            container=create_container(),
        ),
        ParserCache(maxsize=128),
        ValidationCache(maxsize=128),
    ],
    scalar_overrides={GlobalID: ID},
)
