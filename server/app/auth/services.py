from datetime import UTC, datetime, timedelta

from fastapi import Request, Response
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo, EmailVerificationRepo, ProfileRepo
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
        profile_repo: ProfileRepo,
    ) -> None:
        self._account_repo = account_repo
        self._session_repo = session_repo
        self._email_verification_repo = email_verification_repo
        self._profile_repo = profile_repo

    async def register(
        self,
        email: str,
        password: str,
        full_name: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, EmailInUseError]:
        if await self._account_repo.get_by_email(email=email):
            return Err(EmailInUseError())

        account = await self._account_repo.create(
            email=email,
            password=password,
            full_name=full_name,
        )

        await self._profile_repo.create(account=account)

        verification_token = await self._email_verification_repo.create(
            account_id=account.id
        )

        # TODO: send verification email here

        session_token = await self._session_repo.create(
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )

        return Ok(account)

    async def login(
        self,
        email: str,
        password: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, InvalidCredentialsError]:
        """Login a user."""
        account = await self._account_repo.get_by_email(email=email)
        if not account:
            return Err(InvalidCredentialsError())

        if not self._account_repo.verify_password(
            password=password,
            password_hash=account.password_hash,
        ):
            return Err(InvalidCredentialsError())

        session_token = await self._session_repo.create(
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )

        return Ok(account)

    async def signin_with_google(
        self, user_info: dict, request: Request, response: Response
    ) -> None:
        """Sign in with Google."""
        account = await self._account_repo.get_by_email(email=user_info["email"])
        if account is None:
            account = await self._account_repo.create(
                email=user_info["email"],
                full_name=user_info["name"],
                password="",
            )

        session_token = await self._session_repo.create(
            user_agent="",
            account=account,
        )

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )
        return account

    def _set_user_session_cookie(
        self, request: Request, response: Response, value: str
    ) -> None:
        is_localhost = request.url.hostname in ["127.0.0.1", "localhost"]
        secure = False if is_localhost else True
        response.set_cookie(
            key=settings.user_session_cookie_name,
            value=value,
            expires=datetime.now(UTC) + timedelta(seconds=USER_SESSION_EXPIRES_IN),
            path="/",
            domain=settings.session_cookie_domain,
            secure=secure,
            httponly=True,
            samesite="lax",
        )

    async def logout(
        self,
        request: Request,
        response: Response,
        session_token: str,
    ) -> None:
        """Log out the current user."""
        is_localhost = request.url.hostname in ["127.0.0.1", "localhost"]
        secure = False if is_localhost else True

        await self._session_repo.delete(token=session_token)

        response.delete_cookie(
            key=settings.user_session_cookie_name,
            path="/",
            domain=settings.session_cookie_domain,
            secure=secure,
            httponly=True,
            samesite="lax",
        )

    async def request_password_reset(self, email: str, user_agent: str) -> None:
        """Request a password reset."""
        existing_user = await self._account_repo.get_by_email(email=email)
        if not existing_user:
            return

        # TODO: send password reset email here

    async def reset_password(
        self, password_reset_token: str, email: str, new_password: str
    ) -> None:
        """Reset a user's password."""
