from datetime import datetime, timedelta

from fastapi import Request, Response
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo, EmailVerificationRepo
from app.auth.exceptions import EmailInUseError, InvalidCredentialsError
from app.auth.repositories import SessionRepo
from app.config import settings
from app.lib.constants import USER_SESSION_EXPIRES_IN


class AuthService:
    def __init__(
        self,
        account_repo: AccountRepo,
        session_repo: SessionRepo,
        email_verification_repo: EmailVerificationRepo,
    ) -> None:
        self._account_repo = account_repo
        self._session_repo = session_repo
        self._email_verification_repo = email_verification_repo

    async def register(
        self, email: str, password: str, request: Request, response: Response
    ) -> Result[Account, EmailInUseError]:
        if await self._account_repo.get_by_email(email=email):
            return Err(EmailInUseError())

        account = await self._account_repo.create(
            email=email,
            password=password,
        )

        verification_token = await self._email_verification_repo.create(
            account_id=account.id
        )

        session_token = await self._session_repo.create(account_id=account.id)

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )

        return Ok(account)

    async def login(
        self, email: str, password: str, request: Request, response: Response
    ) -> Result[Account, InvalidCredentialsError]:
        account = await self._account_repo.get_by_email(email=email)
        if not account:
            return Err(InvalidCredentialsError())

        if not self._account_repo.verify_password(
            password=password,
            password_hash=account.password_hash,
        ):
            return Err(InvalidCredentialsError())

        session_token = await self._session_repo.create(account_id=account.id)

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )

        return Ok(account)

    def _set_user_session_cookie(
        self, request: Request, response: Response, value: str
    ) -> None:
        is_localhost = request.url.hostname in ["127.0.0.1", "localhost"]
        secure = False if is_localhost else True
        response.set_cookie(
            settings.session_cookie_name,
            value=value,
            expires=datetime.now() + timedelta(seconds=USER_SESSION_EXPIRES_IN),
            path="/",
            domain=settings.session_cookie_domain,
            secure=secure,
            httponly=True,
            samesite="lax",
        )
