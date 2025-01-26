import secrets
from datetime import UTC, datetime, timedelta

from fastapi import BackgroundTasks, Request, Response
from humanize import naturaldelta
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.auth.exceptions import (
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InvalidCredentialsError,
    InvalidEmailVerificationTokenError,
    InvalidPasswordResetTokenError,
)
from app.auth.repositories import PasswordResetTokenRepo, SessionRepo
from app.config import settings
from app.lib.constants import (
    EMAIL_VERIFICATION_EXPIRES_IN,
    PASSWORD_RESET_EXPIRES_IN,
    USER_SESSION_EXPIRES_IN,
)
from app.lib.emails import send_template_email


class AuthService:
    def __init__(
        self,
        account_repo: AccountRepo,
        session_repo: SessionRepo,
        email_verification_token_repo: EmailVerificationTokenRepo,
        profile_repo: ProfileRepo,
        password_reset_token_repo: PasswordResetTokenRepo,
    ) -> None:
        self._account_repo = account_repo
        self._session_repo = session_repo
        self._email_verification_token_repo = email_verification_token_repo
        self._profile_repo = profile_repo
        self._password_reset_token_repo = password_reset_token_repo

    async def request_email_verification_token(
        self, email: str, user_agent: str, background_tasks: BackgroundTasks
    ) -> Result[None, EmailInUseError | EmailVerificationTokenCooldownError]:
        """Request an email verification token."""
        existing_account = await self._account_repo.get_by_email(email=email)

        if existing_account is not None:
            return Err(EmailInUseError())

        existing_email_verification_token = (
            await self._email_verification_token_repo.get_by_email(email=email)
        )

        if existing_email_verification_token is not None:
            if not existing_email_verification_token.is_cooled_down:
                return Err(EmailVerificationTokenCooldownError())
            await self._email_verification_token_repo.delete(
                existing_email_verification_token
            )

        verification_token = await self._email_verification_token_repo.create(
            email=email
        )

        background_tasks.add_task(
            send_template_email,
            template="email-verification",
            receiver=email,
            context={
                "verification_token": verification_token,
                "token_expires_in": naturaldelta(
                    timedelta(seconds=EMAIL_VERIFICATION_EXPIRES_IN)
                ),
                "user_agent": user_agent,
            },
        )

    async def register(
        self,
        email: str,
        email_verification_token: str,
        password: str,
        full_name: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, EmailInUseError | InvalidEmailVerificationTokenError]:
        # check email availability (failsafe)
        if await self._account_repo.get_by_email(email=email):
            return Err(EmailInUseError())

        existing_email_verification_token = (
            await self._email_verification_token_repo.get(
                verification_token=email_verification_token
            )
        )

        if (
            not existing_email_verification_token
            or existing_email_verification_token.is_expired
            or existing_email_verification_token.email != email
        ):
            return Err(InvalidEmailVerificationTokenError())

        account = await self._account_repo.create(
            email=email,
            password=password,
            full_name=full_name,
        )

        await self._profile_repo.create(account=account)

        # delete the email verification token
        await self._email_verification_token_repo.delete(
            existing_email_verification_token
        )

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

    def generate_random_password(self) -> str:
        """Generate a random password."""
        return secrets.token_urlsafe(16)

    async def signin_with_google(
        self, user_info: dict, request: Request, response: Response, user_agent: str
    ) -> Account:
        """Sign in with Google."""
        account = await self._account_repo.get_by_email(email=user_info["email"])
        if account is None:
            account = await self._account_repo.create(
                email=user_info["email"],
                full_name=user_info["name"],
                # generate initial password for the user
                password=self.generate_random_password(),
                email_verified=user_info["email_verified"],
            )

        if not account.email_verified:
            # TODO: handle user not verified
            pass

        session_token = await self._session_repo.create(
            user_agent=user_agent,
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

    async def request_password_reset(
        self, email: str, user_agent: str, background_tasks: BackgroundTasks
    ) -> None:
        """Request a password reset."""
        existing_user = await self._account_repo.get_by_email(email=email)
        if not existing_user:
            return

        password_reset_token = await self._password_reset_token_repo.create(
            account=existing_user
        )

        background_tasks.add_task(
            send_template_email,
            template="password-reset",
            receiver=existing_user.email,
            context={
                "reset_link": f"{settings.app_url}/auth/reset-password/{password_reset_token}",
                "link_expires_in": naturaldelta(
                    timedelta(seconds=PASSWORD_RESET_EXPIRES_IN)
                ),
                "user_agent": user_agent,
            },
        )

    async def reset_password(
        self,
        password_reset_token: str,
        email: str,
        new_password: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, InvalidPasswordResetTokenError]:
        """Reset a user's password."""

        existing_reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token
        )

        if not existing_reset_token:
            return Err(InvalidPasswordResetTokenError())

        await self._account_repo.update_password(
            account=existing_reset_token.account, password=new_password
        )

        # delete all existing user sessions
        await self._session_repo.delete_all(account=existing_reset_token.account)

        session_token = await self._session_repo.create(
            user_agent=user_agent,
            account=existing_reset_token.account,
        )

        self._set_user_session_cookie(
            request=request,
            response=response,
            value=session_token,
        )

        return Ok(existing_reset_token.account)
