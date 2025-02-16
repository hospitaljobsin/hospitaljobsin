import re
import secrets
from datetime import UTC, datetime, timedelta

import httpx
from email_validator import EmailNotValidError, validate_email
from fastapi import BackgroundTasks, Request, Response
from humanize import naturaldelta
from result import Err, Ok, Result

from app.accounts.documents import Account, EmailVerificationToken
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.auth.exceptions import (
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidEmailVerificationTokenError,
    InvalidPasswordResetTokenError,
    InvalidRecaptchaTokenError,
    PasswordNotStrongError,
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
        self,
        email: str,
        recaptcha_token: str,
        user_agent: str,
        background_tasks: BackgroundTasks,
    ) -> Result[
        EmailVerificationToken,
        EmailInUseError
        | EmailVerificationTokenCooldownError
        | InvalidRecaptchaTokenError
        | InvalidEmailError,
    ]:
        """Request an email verification token."""
        if not await self._verify_recaptcha_token(recaptcha_token):
            return Err(InvalidRecaptchaTokenError())

        try:
            email_info = validate_email(
                email,
                check_deliverability=True,
            )
            email = email_info.normalized
        except EmailNotValidError as err:
            return Err(InvalidEmailError(message=str(err)))

        existing_account = await self._account_repo.get_by_email(email=email)

        if existing_account is not None:
            return Err(EmailInUseError())

        existing_email_verification_token = (
            await self._email_verification_token_repo.get_by_email(email=email)
        )

        if existing_email_verification_token is not None:
            if not existing_email_verification_token.is_cooled_down:
                return Err(
                    EmailVerificationTokenCooldownError(
                        remaining_seconds=existing_email_verification_token.cooldown_remaining_seconds
                    )
                )
            await self._email_verification_token_repo.delete(
                existing_email_verification_token
            )

        (
            verification_token,
            email_verification,
        ) = await self._email_verification_token_repo.create(email=email)

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

        return Ok(email_verification)

    async def verify_email(
        self,
        email: str,
        email_verification_token: str,
        recaptcha_token: str,
    ) -> Result[
        None,
        EmailInUseError
        | InvalidEmailVerificationTokenError
        | InvalidRecaptchaTokenError,
    ]:
        """Verify an email address."""
        if not await self._verify_recaptcha_token(recaptcha_token):
            return Err(InvalidRecaptchaTokenError())

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

        return Ok(None)

    async def _verify_recaptcha_token(self, recaptcha_token: str) -> bool:
        """Verify whether the given recaptcha token is valid."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://www.google.com/recaptcha/api/siteverify?secret={settings.recaptcha_secret_key.get_secret_value()}&response={recaptcha_token}",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            )
            response_data = response.json()

        print("response_data", response_data)

        return response_data["success"]

    async def register(
        self,
        email: str,
        email_verification_token: str,
        recaptcha_token: str,
        password: str,
        full_name: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[
        Account,
        EmailInUseError
        | InvalidEmailVerificationTokenError
        | InvalidRecaptchaTokenError
        | PasswordNotStrongError,
    ]:
        if not await self._verify_recaptcha_token(recaptcha_token):
            return Err(InvalidRecaptchaTokenError())
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

        if not self.check_password_strength(password=password):
            return Err(PasswordNotStrongError())

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
        recaptcha_token: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, InvalidCredentialsError | InvalidRecaptchaTokenError]:
        """Login a user."""
        if not await self._verify_recaptcha_token(recaptcha_token):
            return Err(InvalidRecaptchaTokenError())
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

    @staticmethod
    def generate_random_password() -> str:
        """Generate a random password."""
        return secrets.token_urlsafe(16)

    @staticmethod
    def check_password_strength(password: str) -> bool:
        """
        Checks if a password is strong.
        A strong password must:
        - Be at least 8 characters long
        - Contain at least one lowercase letter
        - Contain at least one uppercase letter
        - Contain at least one digit
        - Contain at least one special character (!@#$%^&*()-_+=)
        """
        pattern = re.compile(
            r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,}$"
        )
        return bool(pattern.match(password))

    async def signin_with_google(
        self, user_info: dict, request: Request, response: Response, user_agent: str
    ) -> Result[Account, InvalidEmailError]:
        """Sign in with Google."""
        if not user_info["email_verified"]:
            return Err(InvalidEmailError())
        account = await self._account_repo.get_by_email(email=user_info["email"])
        if account is None:
            account = await self._account_repo.create(
                email=user_info["email"],
                full_name=user_info["name"],
                # generate initial password for the user
                password=self.generate_random_password(),
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
        self,
        email: str,
        user_agent: str,
        recaptcha_token: str,
        background_tasks: BackgroundTasks,
    ) -> Result[None, InvalidRecaptchaTokenError]:
        """Request a password reset."""
        if not await self._verify_recaptcha_token(recaptcha_token):
            return Err(InvalidRecaptchaTokenError())
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

        return Ok(None)

    async def reset_password(
        self,
        password_reset_token: str,
        email: str,
        new_password: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[Account, InvalidPasswordResetTokenError | PasswordNotStrongError]:
        """Reset a user's password."""

        existing_reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token
        )

        if not existing_reset_token:
            return Err(InvalidPasswordResetTokenError())

        if not self.check_password_strength(password=new_password):
            return Err(PasswordNotStrongError())

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
