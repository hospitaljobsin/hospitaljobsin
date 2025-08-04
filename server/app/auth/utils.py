from fastapi import Request


def get_analytics_preference(request: Request) -> str:
    """Get the analytics preference from the request."""
    analytics_preference = request.cookies.get("analytics_preference", "undecided")
    if analytics_preference == "yes":
        return "acceptance"
    elif analytics_preference == "no":
        return "rejection"
    else:
        return "undecided"
