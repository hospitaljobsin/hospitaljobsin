from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, Header, Query, Request
from result import Err
from starlette.responses import RedirectResponse

from app.auth.exceptions import InvalidEmailError
from app.auth.services import AuthService
from app.config import settings
from app.lib.oauth import oauth_client

auth_router = APIRouter(prefix="/auth")


@auth_router.get("/signin/google")
async def oauth2_signin_google(
    request: Request,
    redirect_uri: Annotated[str, Query()],
    user_agent: Annotated[str | None, Header()] = "unknown",
):
    """Signin with Google OAuth2."""
    request.session["user_agent"] = user_agent
    request.session["redirect_uri"] = redirect_uri

    redirect_uri = request.url_for("oauth2_signin_callback_google")

    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@auth_router.get("/callback/google")
@inject
async def oauth2_signin_callback_google(
    request: Request,
    auth_service: Annotated[AuthService, Inject],
) -> RedirectResponse:
    """Callback for Google OAuth2 signin."""
    token = await oauth_client.google.authorize_access_token(request)

    user_info = token["userinfo"]

    redirect_uri = request.session.get("redirect_uri", "/")

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
