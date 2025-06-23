import uuid
from typing import Literal

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp


class FingerprintMiddleware(BaseHTTPMiddleware):
    """Fingerprint middleware."""

    def __init__(
        self,
        app: ASGIApp,
        *,
        fingerprint_cookie: str = "_fpid",
        same_site: Literal["lax", "strict", "none"] | None = "lax",
        max_age: int | None = 60 * 60 * 24 * 365 * 10,  # 10 years
        path: str = "/",
        secure: bool = False,
        domain: str | None = None,
    ) -> None:
        super().__init__(app)
        self.fingerprint_cookie = fingerprint_cookie
        self.same_site: Literal["lax", "strict", "none"] | None = same_site
        self.max_age = max_age
        self.path = path
        self.secure = secure
        self.domain = domain

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        fingerprint = request.cookies.get(self.fingerprint_cookie)
        if fingerprint is None:
            fingerprint = self.generate_fingerprint()

        request.state.fingerprint = fingerprint

        # Process the request.
        response: Response = await call_next(request)
        response.set_cookie(
            self.fingerprint_cookie,
            fingerprint,
            max_age=self.max_age,
            path=self.path,
            httponly=True,
            samesite=self.same_site,
            secure=self.secure,
            domain=self.domain,
        )

        return response

    def generate_fingerprint(self) -> str:
        return str(uuid.uuid4())
