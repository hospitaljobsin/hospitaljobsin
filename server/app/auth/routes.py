from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Header, Query, Request
from result import Err
from starlette.responses import RedirectResponse

from app.auth.exceptions import AccountNotFoundError, InvalidEmailError
from app.auth.services import AuthService
from app.config import Settings

auth_router = APIRouter(prefix="/auth")


@auth_router.get("/signin/google")
@inject
async def oauth2_signin_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    redirect_uri: Annotated[str, Query()],
    user_agent: Annotated[str | None, Header()] = "unknown",
):
    """Signin with Google OAuth2."""
    request.session["user_agent"] = user_agent
    request.session["redirect_uri"] = redirect_uri

    redirect_uri = request.url_for("oauth2_signin_callback_google")

    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@auth_router.get("/callback/signin/google")
@inject
async def oauth2_signin_callback_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    auth_service: Annotated[AuthService, Inject],
    settings: Annotated[Settings, Inject],
) -> RedirectResponse:
    """Callback for Google OAuth2 signin."""
    token = await oauth_client.google.authorize_access_token(request)

    user_info = token["userinfo"]

    redirect_uri = request.session.get("redirect_uri", settings.accounts_base_url)

    response = RedirectResponse(url=redirect_uri)

    result = await auth_service.signin_with_google(
        user_info=user_info,
        request=request,
        response=response,
        user_agent=request.session.get("user_agent", "unknown"),
    )

    del request.session["user_agent"]
    del request.session["redirect_uri"]

    if isinstance(result, Err):
        match result.err_value:
            case InvalidEmailError():
                return RedirectResponse(
                    url=settings.app_url + "/auth/login?oauth2_error=unverified_email"
                )

    return response


@auth_router.get("/request_sudo_mode/google")
@inject
async def oauth2_request_sudo_mode_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    redirect_uri: Annotated[str, Query()],
    user_agent: Annotated[str | None, Header()] = "unknown",
):
    """Signin with Google OAuth2."""
    request.session["user_agent"] = user_agent
    request.session["redirect_uri"] = redirect_uri

    redirect_uri = request.url_for("oauth2_request_sudo_mode_callback_google")

    # TODO: add consent prompt here
    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@auth_router.get("/callback/request_sudo_mode/google")
@inject
async def oauth2_request_sudo_mode_callback_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    auth_service: Annotated[AuthService, Inject],
    settings: Annotated[Settings, Inject],
) -> RedirectResponse:
    """Request sudo mode with Google OAuth2."""
    token = await oauth_client.google.authorize_access_token(request)

    user_info = token["userinfo"]

    redirect_uri = request.session.get("redirect_uri", settings.accounts_base_url)

    response = RedirectResponse(url=redirect_uri)

    result = await auth_service.request_sudo_mode_with_google_oauth(
        user_info=user_info,
        request=request,
    )

    del request.session["user_agent"]
    del request.session["redirect_uri"]

    if isinstance(result, Err):
        match result.err_value:
            case AccountNotFoundError():
                return response

    return response
