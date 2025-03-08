import jwt
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class SessionMiddleware(BaseHTTPMiddleware):
    """JWT based session middleware."""

    def __init__(
        self,
        app: FastAPI,
        *,
        session_cookie: str = "session",
        max_age: int = 14 * 24 * 60 * 60,  # 14 days
        path: str = "/",
        same_site: str = "lax",
        secret_key: str | bytes | None = None,
        https_only: bool = False,
        domain: str | None = None,
    ) -> None:
        super().__init__(app)
        self.secret_key = secret_key
        self.session_cookie = session_cookie
        self.max_age = max_age
        self.path = path
        self.same_site = same_site
        self.https_only = https_only
        self.domain = domain

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> None:
        # Try to get the session from the cookie.
        initial_session_was_empty = True
        session_data = {}
        cookie = request.cookies.get(self.session_cookie)
        if cookie:
            try:
                # Decode the JWT cookie without verifying any signature.
                # (Using algorithm "none" disables signature verification.)
                session_data = jwt.decode(
                    cookie, options={"verify_signature": False}, algorithms=["none"]
                )
                initial_session_was_empty = False
            except Exception:
                session_data = {}

        # Add the session to both request.state and request.scope.
        request.state.session = session_data
        request.scope["session"] = session_data

        # Process the request.
        response: Response = await call_next(request)

        # Ensure the scope's session is updated in case it was modified.
        request.scope["session"] = request.state.session

        # On response, if session data exists, encode it into a JWT cookie.
        if request.state.session:
            token = jwt.encode(
                request.state.session,
                key=None,  # key is ignored when algorithm is "none"
                algorithm="none",
            )
            response.set_cookie(
                self.session_cookie,
                token,
                max_age=self.max_age,
                path=self.path,
                httponly=True,
                samesite=self.same_site,
                secure=self.https_only,
                domain=self.domain,
            )
        # If the session was cleared during the request, delete the cookie.
        elif not request.state.session and not initial_session_was_empty:
            response.delete_cookie(
                self.session_cookie, path=self.path, domain=self.domain
            )

        return response
