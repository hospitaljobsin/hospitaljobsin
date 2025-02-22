from typing import Annotated

from aioinject import Inject
from aioinject.ext.fastapi import inject
from fastapi import Request

from app.config import Settings


@inject
async def get_session_token(
    request: Request, settings: Annotated[Settings, Inject]
) -> str | None:
    """
    Get the session token from the request cookies.
    """
    return request.cookies.get(settings.user_session_cookie_name)
