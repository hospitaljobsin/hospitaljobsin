from http import HTTPStatus
from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from app.accounts.documents import Account
from app.accounts.services import AccountService
from app.auth.dependencies import get_current_user_or_none
from app.config import AuthSettings

accounts_router = APIRouter(prefix="/accounts")


class ConsentRequest(BaseModel):
    consent: str  # "yes" or "no"


@accounts_router.post("/analytics/set-preference", status_code=HTTPStatus.ACCEPTED)
@inject
async def update_analytics_preference(
    response: Response,
    consent_data: ConsentRequest,
    current_user: Annotated[
        Account | None,
        Depends(
            dependency=get_current_user_or_none,
        ),
    ],
    account_service: Annotated[AccountService, Inject],
    settings: Annotated[AuthSettings, Inject],
) -> dict[str, str]:
    """Update the analytics preference."""
    if current_user is not None:
        await account_service.update_analytics_preference(
            account=current_user,
            type="acceptance" if consent_data.consent == "yes" else "rejection",
            response=response,
        )
        return {"message": "Consent cookie set successfully"}

    # Set the consent cookie with appropriate settings
    response.set_cookie(
        settings.analytics_preference_cookie_name,
        "yes" if consent_data.consent == "yes" else "no",
        max_age=365 * 24 * 60 * 60,  # 1 year
        path="/",
        httponly=False,  # Allow client-side access
        samesite="lax",
        secure=settings.session_cookie_secure,  # Secure in production
        domain=settings.session_cookie_domain,
    )

    return {"message": "Consent cookie set successfully"}
