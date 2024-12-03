from typing import Annotated, Any

from fastapi import Depends, Request
from strawberry.fastapi import GraphQLRouter

from app.auth.dependencies import current_user_id, validate_auth_header

from .context import Context
from .dataloaders import create_dataloaders
from .schema import schema


async def get_context(
    request: Request,
    current_user_id: Annotated[
        str | None,
        Depends(
            dependency=current_user_id,
        ),
    ],
) -> Context:
    if current_user_id is not None:
        print(f"Current user ID: {current_user_id}")
    return Context(
        request=request,
        loaders=create_dataloaders(),
        current_user_id=current_user_id,
    )


def create_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide="graphiql",
    )
