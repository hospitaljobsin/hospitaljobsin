from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.accounts.documents import Account
from app.accounts.services import AccountService
from app.auth.dependencies import get_current_user_or_none

accounts_router = APIRouter(prefix="/accounts")


class ConsentRequest(BaseModel):
    consent: str  # "yes" or "no"


@accounts_router.post("/analytics/set-preference")
@inject
async def update_analytics_preference(
    consent_data: ConsentRequest,
    current_user: Annotated[
        Account | None,
        Depends(
            dependency=get_current_user_or_none,
        ),
    ],
    account_service: Annotated[AccountService, Inject],
) -> JSONResponse:
    """Update the terms and policy consent."""
    response = JSONResponse(
        content={"message": "Consent cookie set successfully"}, status_code=200
    )

    if current_user is not None:
        await account_service.update_analytics_preference(
            account=current_user,
            type="acceptance" if consent_data.consent == "yes" else "rejection",
            response=response,
        )

    return response
