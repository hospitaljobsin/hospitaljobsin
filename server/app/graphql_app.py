from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import Header, Request, Response
from strawberry.fastapi import GraphQLRouter

from app.auth.repositories import SessionRepo
from app.auth.services import AuthService
from app.config import EnvironmentSettings
from app.core.constants import SESSION_TOKEN_KEY

from .context import AuthContext, BaseContext, Context
from .dataloaders import Dataloaders


@inject
async def get_context(
    request: Request,
    response: Response,
    session_repo: Injected[SessionRepo],
    auth_service: Injected[AuthService],
    dataloaders: Injected[Dataloaders],
    user_agent: Annotated[str | None, Header()] = "unknown",
) -> BaseContext:
    """Get the context for the GraphQL request."""
    session_token = request.session.get(SESSION_TOKEN_KEY)
    if session_token:
        session = await session_repo.get(token=session_token, fetch_account=True)
        if session is not None:
            return AuthContext(
                request=request,
                response=response,
                loaders=dataloaders,
                current_user=session.account,
                session=session,
                user_agent=user_agent,
                session_token=session_token,
            )
        await auth_service.logout(
            request=request,
            response=response,
            session_token=session_token,
        )
    return Context(
        request=request,
        response=response,
        loaders=dataloaders,
        current_user=None,
        session=None,
        user_agent=user_agent,
    )


def create_graphql_router(env_settings: EnvironmentSettings) -> GraphQLRouter:
    """Create a GraphQL router."""
    from .schema import schema

    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide=None
        if (env_settings.is_production or env_settings.is_staging)
        else "apollo-sandbox",
        include_in_schema=False,
        allow_queries_via_get=True,
    )
