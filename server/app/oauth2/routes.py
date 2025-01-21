from app.lib.oauth import oauth_client
from fastapi import APIRouter, Request

oauth2_router = APIRouter(prefix="/oauth2")


@oauth2_router.get("/login/google")
async def oauth2_login_google(request: Request):
    redirect_uri = request.url_for("auth_via_google")
    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@oauth2_router.get("/callback/google")
async def oauth2_callback_google(request: Request):
    token = await oauth_client.google.authorize_access_token(request)
    user = token["userinfo"]
    return dict(user)
