from fastapi import Request


def get_terms_and_policy_type(request: Request) -> str:
    """Get the terms and policy type from the request."""
    cookie_consent = request.cookies.get("cookie_consent", "undecided")
    if cookie_consent == "yes":
        return "acceptance"
    elif cookie_consent == "no":
        return "rejection"
    else:
        return "undecided"
