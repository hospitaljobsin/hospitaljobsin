from aioinject import Injected
from fastapi import APIRouter, Request, Response
from starlette.responses import RedirectResponse

from app.auth.services import AuthService
from app.lib.oauth import oauth_client

auth_router = APIRouter(prefix="/auth")


@auth_router.get("/signin/google")
async def oauth2_signin_google(request: Request):
    """Signin with Google OAuth2."""
    redirect_uri = request.url_for("oauth2_signin_callback_google")
    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@auth_router.get("/callback/google")
async def oauth2_signin_callback_google(
    request: Request,
    response: Response,
    auth_service: Injected[AuthService,],
) -> RedirectResponse:
    """Callback for Google OAuth2 signin."""
    token = await oauth_client.google.authorize_access_token(request)
    user_info = token["userinfo"]
    await auth_service.signin_with_google(
        user_info=user_info, request=request, response=response
    )
    return RedirectResponse(url="http://localhost:3000/")
