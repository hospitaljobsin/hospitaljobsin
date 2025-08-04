from fastapi import Request

from app.config import AuthSettings


def get_analytics_preference(request: Request, auth_settings: AuthSettings) -> str:
    """Get the analytics preference from the request."""
    analytics_preference = request.cookies.get(
        auth_settings.analytics_preference_cookie_name, "undecided"
    )
    if analytics_preference == "yes":
        return "acceptance"
    elif analytics_preference == "no":
        return "rejection"
    else:
        return "undecided"
