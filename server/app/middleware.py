import json
from typing import Literal

from fastapi import Request, Response
from jose import jwe
from jose.exceptions import JWEError
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp

from app.config import SecretSettings, get_settings


class SessionMiddleware(BaseHTTPMiddleware):
    """JWE based session middleware."""

    def __init__(
        self,
        app: ASGIApp,
        *,
        session_cookie: str = "session",
        max_age: int = 14 * 24 * 60 * 60,  # 14 days
        path: str = "/",
        same_site: Literal["lax", "strict", "none"] | None = "lax",
        secure: bool = False,
        domain: str | None = None,
    ) -> None:
        super().__init__(app)
        self._jwe_secret_key: str | None = None
        self.session_cookie = session_cookie
        self.max_age = max_age
        self.path = path
        self.same_site: Literal["lax", "strict", "none"] | None = same_site
        self.secure = secure
        self.domain = domain

    def get_jwe_secret_key(self) -> str:
        """Get the JWE secret key."""
        if self._jwe_secret_key is None:
            secret_settings = get_settings(SecretSettings)
            self._jwe_secret_key = secret_settings.jwe_secret_key.get_secret_value()
        return self._jwe_secret_key

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Try to get the session from the cookie.
        initial_session_was_empty = True
        session_data = {}
        cookie = request.cookies.get(self.session_cookie)
        if cookie:
            try:
                # Decrypt JWE cookie.
                session_data_bytes = jwe.decrypt(
                    cookie.encode("utf-8"),
                    key=self.get_jwe_secret_key(),
                )
                if not session_data_bytes:
                    session_data = {}
                else:
                    session_data = json.loads(session_data_bytes)
                    initial_session_was_empty = False
            except JWEError:
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
            # encrypt the session data into a JWE cookie.
            token = jwe.encrypt(
                json.dumps(request.state.session),
                key=self.get_jwe_secret_key(),
                algorithm="dir",
            )
            response.set_cookie(
                self.session_cookie,
                token.decode("utf-8"),
                max_age=self.max_age,
                path=self.path,
                httponly=True,
                samesite=self.same_site,
                secure=self.secure,
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
