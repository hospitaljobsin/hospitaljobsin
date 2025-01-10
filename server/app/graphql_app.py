from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import Depends, Header, Request, Response
from strawberry.fastapi import GraphQLRouter

from app.auth.dependencies import get_session_token
from app.auth.repositories import SessionRepo
from app.auth.services import AuthService

from .context import AuthContext, BaseContext, Context
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
    auth_service: Injected[AuthService],
    user_agent: Annotated[str | None, Header()] = "unknown",
) -> BaseContext:
    if session_token:
        session = await session_repo.get(token=session_token)
        if session is not None:
            return AuthContext(
                request=request,
                response=response,
                loaders=create_dataloaders(),
                current_user_id=session.account.ref.id,
                user_agent=user_agent,
            )
        await auth_service.logout(request=request, response=response)
    return Context(
        request=request,
        response=response,
        loaders=create_dataloaders(),
        current_user_id=None,
        user_agent=user_agent,
    )


def create_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide="graphiql",
    )
