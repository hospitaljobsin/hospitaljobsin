from fastapi import Request

from app.config import settings


def get_session_token(request: Request) -> str | None:
    """
    Get the session token from the request cookies.
    """
    return request.cookies.get(settings.user_session_cookie_name)
