from fastapi import Request
from strawberry.fastapi import GraphQLRouter


from .context import Context
from .dataloaders import create_dataloaders
from .schema import schema


async def get_context(request: Request) -> Context:
    return Context(
        request=request,
        loaders=create_dataloaders(),
    )


def create_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide="graphiql",
    )
