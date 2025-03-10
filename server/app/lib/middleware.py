from fastapi import FastAPI, Request, Response
from jose import jwt
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class SessionMiddleware(BaseHTTPMiddleware):
    """JWS based session middleware."""

    def __init__(
        self,
        app: FastAPI,
        *,
        rsa_private_key: str,
        rsa_public_key: str,
        session_cookie: str = "session",
        max_age: int = 14 * 24 * 60 * 60,  # 14 days
        path: str = "/",
        same_site: str = "lax",
        https_only: bool = False,
        domain: str | None = None,
    ) -> None:
        super().__init__(app)
        self.rsa_private_key = rsa_private_key
        self.rsa_public_key = rsa_public_key
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
                # Decode JWT with RS256 using the public key
                session_data = jwt.decode(
                    cookie,
                    key=self.rsa_public_key,
                    algorithms=["RS256"],
                )
                initial_session_was_empty = False
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
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
            # sign with RS256 algorithm
            token = jwt.encode(
                request.state.session,
                key=self.rsa_private_key,
                algorithm="RS256",
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
                self.session_cookie,
                path=self.path,
                domain=self.domain,
            )

        return response
