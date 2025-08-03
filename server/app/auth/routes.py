from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, Header, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from result import Err
from starlette.responses import RedirectResponse

from app.accounts.documents import Account
from app.auth.dependencies import get_current_user
from app.auth.exceptions import (
    AccountNotFoundError,
    InvalidEmailError,
    TwoFactorAuthenticationRequiredError,
)
from app.auth.services import AuthService
from app.config import AppSettings, AuthSettings

auth_router = APIRouter(prefix="/auth")


class ConsentRequest(BaseModel):
    consent: str  # "yes" or "no"


@auth_router.get("/signin/google")
@inject
async def oauth2_signin_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    redirect_uri: Annotated[str, Query()],
    user_agent: Annotated[str | None, Header()] = "unknown",
) -> RedirectResponse:
    """Signin with Google OAuth2."""
    # TODO: fix open redirect vulnerability here
    request.session["user_agent"] = user_agent
    request.session["redirect_uri"] = redirect_uri

    oauth_redirect_uri = request.url_for("oauth2_signin_callback_google")

    # ask Google to select an account every time
    return await oauth_client.google.authorize_redirect(
        request,
        oauth_redirect_uri,
        prompt="select_account",
    )


@auth_router.get("/callback/signin/google")
@inject
async def oauth2_signin_callback_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    auth_service: Annotated[AuthService, Inject],
    app_settings: Annotated[AppSettings, Inject],
) -> RedirectResponse:
    """Google OAuth2 signin callback."""
    token = await oauth_client.google.authorize_access_token(request)

    user_info = token["userinfo"]

    redirect_uri = request.session.get("redirect_uri", app_settings.accounts_base_url)

    response = RedirectResponse(url=redirect_uri)

    result = await auth_service.signin_with_google(
        user_info=user_info,
        request=request,
        user_agent=request.session.get("user_agent", "unknown"),
    )

    del request.session["user_agent"]
    del request.session["redirect_uri"]

    if isinstance(result, Err):
        match result.err_value:
            case InvalidEmailError():
                return RedirectResponse(
                    url=app_settings.accounts_base_url
                    + "/auth/login?oauth2_error=unverified_email",
                )
            case TwoFactorAuthenticationRequiredError():
                return RedirectResponse(
                    url=app_settings.accounts_base_url + "/auth/2fa",
                    headers=response.headers,
                )

    return response


@auth_router.get("/request_sudo_mode/google")
@inject
async def oauth2_request_sudo_mode_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    redirect_uri: Annotated[str, Query()],
) -> RedirectResponse:
    """Signin with Google OAuth2."""
    # TODO: fix open redirect vulnerability here
    request.session["redirect_uri"] = redirect_uri

    oauth_redirect_uri = request.url_for("oauth2_request_sudo_mode_callback_google")

    # set prompt=consent to force Google to ask for consent every time
    return await oauth_client.google.authorize_redirect(
        request, oauth_redirect_uri, prompt="consent"
    )


@auth_router.get("/callback/request_sudo_mode/google")
@inject
async def oauth2_request_sudo_mode_callback_google(
    request: Request,
    oauth_client: Annotated[OAuth, Inject],
    auth_service: Annotated[AuthService, Inject],
    app_settings: Annotated[AppSettings, Inject],
    current_user: Annotated[
        Account,
        Depends(
            dependency=get_current_user,
        ),
    ],
) -> RedirectResponse:
    """Request sudo mode with Google OAuth2."""
    token = await oauth_client.google.authorize_access_token(request)

    user_info = token["userinfo"]

    redirect_uri = request.session.get("redirect_uri", app_settings.accounts_base_url)

    response = RedirectResponse(url=redirect_uri)

    result = await auth_service.request_sudo_mode_with_google_oauth(
        user_info=user_info,
        request=request,
        current_user=current_user,
    )

    del request.session["redirect_uri"]

    if isinstance(result, Err):
        match result.err_value:
            case AccountNotFoundError():
                # return a response with an error query param
                return RedirectResponse(
                    url=app_settings.accounts_base_url
                    + "/request-sudo?oauth2_error=invalid_account"
                )
            case TwoFactorAuthenticationRequiredError():
                return RedirectResponse(
                    url=app_settings.accounts_base_url
                    + "/request-sudo?oauth2_error=2fa_required",
                )

    return response


@auth_router.post("/set-consent")
@inject
async def set_consent_cookie(
    request: Request,
    consent_data: ConsentRequest,
    app_settings: Annotated[AppSettings, Inject],
    auth_settings: Annotated[AuthSettings, Inject],
) -> JSONResponse:
    """Set the consent cookie value."""

    response = JSONResponse(
        content={"message": "Consent cookie set successfully"}, status_code=200
    )

    # Set the consent cookie with appropriate settings
    response.set_cookie(
        "cookie_consent",
        consent_data.consent,
        max_age=365 * 24 * 60 * 60,  # 1 year
        path="/",
        httponly=False,  # Allow client-side access
        samesite="lax",
        secure=auth_settings.session_cookie_secure,  # Secure in production
        domain=auth_settings.session_cookie_domain,
    )

    return response
