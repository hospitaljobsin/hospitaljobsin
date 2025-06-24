from http import HTTPStatus

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import HTTPException, Request

from app.accounts.documents import Account
from app.auth.repositories import SessionRepo
from app.core.constants import SESSION_TOKEN_KEY


@inject
async def get_current_user(
    request: Injected[Request],
    session_repo: Injected[SessionRepo],
) -> Account:
    """Get the current user from the request."""
    session_token = request.session.get(SESSION_TOKEN_KEY)
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


@inject
async def get_current_user_or_none(
    request: Injected[Request],
    session_repo: Injected[SessionRepo],
) -> Account | None:
    """Get the current user from the request."""
    session_token = request.session.get(SESSION_TOKEN_KEY)
    if session_token is None:
        return None

    session = await session_repo.get(token=session_token, fetch_account=True)

    if session is None:
        return None
    return session.account
