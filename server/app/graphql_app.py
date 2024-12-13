from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import Depends, Request, Response
from strawberry.fastapi import GraphQLRouter

from app.auth.dependencies import get_session_token
from app.auth.repositories import SessionRepo

from .context import Context
from .dataloaders import create_dataloaders
from .schema import schema


@inject
async def get_context(
    request: Request,
    response: Response,
    session_token: Annotated[
        str | None,
        Depends(
            dependency=get_session_token,
        ),
    ],
    session_repo: Injected[SessionRepo],
) -> Context:
    if session_token:
        if session := await session_repo.get(token=session_token):
            return Context(
                request=request,
                response=response,
                loaders=create_dataloaders(),
                current_user_id=session.account.ref.id,
            )
    return Context(
        request=request,
        response=response,
        loaders=create_dataloaders(),
        current_user_id=None,
    )


def create_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide="graphiql",
    )
