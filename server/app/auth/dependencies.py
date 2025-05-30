from http import HTTPStatus
from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from fastapi import Depends, HTTPException, Request

from app.accounts.documents import Account
from app.auth.repositories import SessionRepo


@inject
async def get_session_token(request: Request) -> str | None:
    """Get the session token from the request session."""
    return request.session.get("session_token")


@inject
async def get_current_user(
    session_token: Annotated[
        str | None,
        Depends(
            dependency=get_session_token,
        ),
    ],
    session_repo: Annotated[SessionRepo, Inject],
) -> Account:
    """Get the current user from the request."""
    if session_token is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Unauthorized",
        )

    session = await session_repo.get(token=session_token, fetch_account=True)

    if session is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Unauthorized",
        )
    return session.account
