from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import Header, Request, Response
from strawberry.fastapi import GraphQLRouter

from app.auth.repositories import SessionRepo
from app.auth.services import AuthService
from app.config import AppSettings
from app.core.constants import SESSION_TOKEN_KEY

from .context import AuthContext, BaseContext, Context
from .dataloaders import Dataloaders
from .schema import schema


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


def create_graphql_router(app_settings: AppSettings) -> GraphQLRouter:
    """Create a GraphQL router."""
    return GraphQLRouter(
        schema=schema,
        context_getter=get_context,
        graphql_ide=None if app_settings.is_production else "apollo-sandbox",
        multipart_uploads_enabled=True,
        include_in_schema=False,
    )
