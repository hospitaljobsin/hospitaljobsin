import re
from base64 import b64decode, b64encode
from datetime import UTC, datetime, timedelta
from http import HTTPStatus
from typing import Any

import httpx
import phonenumbers
import pyotp
from bson.objectid import ObjectId
from email_validator import EmailNotValidError, validate_email
from fastapi import Request, Response
from humanize import naturaldelta
from posthog import Posthog
from result import Err, Ok, Result
from strawberry import relay
from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers import parse_client_data_json
from webauthn.helpers.exceptions import WebAuthnException
from webauthn.helpers.parse_authentication_credential_json import (
    parse_authentication_credential_json,
)
from webauthn.helpers.parse_registration_credential_json import (
    parse_registration_credential_json,
)
from webauthn.helpers.structs import (
    AuthenticatorAttachment,
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialCreationOptions,
    PublicKeyCredentialDescriptor,
    PublicKeyCredentialRequestOptions,
    PublicKeyCredentialType,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

from app.accounts.documents import Account, EmailVerificationToken
from app.accounts.repositories import (
    AccountRepo,
    EmailVerificationTokenRepo,
    ProfileRepo,
)
from app.auth.documents import (
    PasswordResetToken,
    Session,
    TemporaryTwoFactorChallenge,
    WebAuthnCredential,
)
from app.auth.exceptions import (
    AccountNotFoundError,
    AuthenticatorNotEnabledError,
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InsufficientAuthProvidersError,
    InvalidAuthenticationProviderError,
    InvalidCaptchaTokenError,
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidEmailVerificationTokenError,
    InvalidPasskeyAuthenticationCredentialError,
    InvalidPasskeyRegistrationCredentialError,
    InvalidPasswordResetTokenError,
    PasswordNotStrongError,
    PasswordResetTokenCooldownError,
    PasswordResetTokenNotFoundError,
    SessionNotFoundError,
    TwoFactorAuthenticationChallengeNotFoundError,
    TwoFactorAuthenticationNotEnabledError,
    TwoFactorAuthenticationRequiredError,
    WebAuthnChallengeNotFoundError,
    WebAuthnCredentialNotFoundError,
)
from app.auth.repositories import (
    OauthCredentialRepo,
    PasswordResetTokenRepo,
    RecoveryCodeRepo,
    SessionRepo,
    TemporaryTwoFactorChallengeRepo,
    TwoFactorAuthenticationChallengeRepo,
    WebAuthnChallengeRepo,
    WebAuthnCredentialRepo,
)
from app.auth.utils import get_analytics_preference
from app.config import AppSettings, AuthSettings
from app.core.captcha import BaseCaptchaVerifier
from app.core.constants import (
    APP_NAME,
    EMAIL_VERIFICATION_EXPIRES_IN,
    PASSWORD_RESET_EXPIRES_IN,
    SUDO_MODE_EXPIRES_IN,
)
from app.core.emails import BaseEmailSender
from app.core.formatting import format_datetime


class AuthService:
    def __init__(
        self,
        account_repo: AccountRepo,
        session_repo: SessionRepo,
        email_verification_token_repo: EmailVerificationTokenRepo,
        profile_repo: ProfileRepo,
        password_reset_token_repo: PasswordResetTokenRepo,
        web_authn_credential_repo: WebAuthnCredentialRepo,
        webauthn_challenge_repo: WebAuthnChallengeRepo,
        oauth_credential_repo: OauthCredentialRepo,
        two_factor_authentication_challenge_repo: TwoFactorAuthenticationChallengeRepo,
        recovery_code_repo: RecoveryCodeRepo,
        temp_two_factor_challenge_repo: TemporaryTwoFactorChallengeRepo,
        email_sender: BaseEmailSender,
        captcha_verifier: BaseCaptchaVerifier,
        settings: AuthSettings,
        app_settings: AppSettings,
        posthog_client: Posthog,
    ) -> None:
        self._account_repo = account_repo
        self._session_repo = session_repo
        self._email_verification_token_repo = email_verification_token_repo
        self._profile_repo = profile_repo
        self._password_reset_token_repo = password_reset_token_repo
        self._web_authn_credential_repo = web_authn_credential_repo
        self._webauthn_challenge_repo = webauthn_challenge_repo
        self._oauth_credential_repo = oauth_credential_repo
        self._two_factor_authentication_challenge_repo = (
            two_factor_authentication_challenge_repo
        )
        self._recovery_code_repo = recovery_code_repo
        self._temp_two_factor_challenge_repo = temp_two_factor_challenge_repo
        self._email_sender = email_sender
        self._settings = settings
        self._app_settings = app_settings
        self._captcha_verifier = captcha_verifier
        self._posthog_client = posthog_client

    def _is_email_verification_token_cooled_down(
        self, token: EmailVerificationToken
    ) -> bool:
        """Check if an email verification token is cooled down."""
        current_time = datetime.now(UTC)
        # Ensure generation_time is aware (assuming it's stored in UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.email_verification_token_cooldown
        )
        return current_time >= cooldown_time

    def _email_verification_token_cooldown_remaining_seconds(
        self, token: EmailVerificationToken
    ) -> int:
        """
        Calculate remaining cooldown seconds for the email verification token.

        Returns 0 if cooldown has passed or token is invalid.
        """
        if self._is_email_verification_token_cooled_down(token):
            return 0

        current_time = datetime.now(UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.email_verification_token_cooldown
        )

        remaining = (cooldown_time - current_time).total_seconds()
        return max(0, int(remaining))  # Ensure non-negative integer

    async def request_email_verification_token(
        self,
        email: str,
        captcha_token: str,
        user_agent: str,
        request: Request,
    ) -> Result[
        int,
        EmailInUseError
        | EmailVerificationTokenCooldownError
        | InvalidCaptchaTokenError
        | InvalidEmailError,
    ]:
        """Request an email verification token."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

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
            if not self._is_email_verification_token_cooled_down(
                existing_email_verification_token
            ):
                return Err(
                    EmailVerificationTokenCooldownError(
                        remaining_seconds=self._email_verification_token_cooldown_remaining_seconds(
                            existing_email_verification_token
                        )
                    )
                )
            await self._email_verification_token_repo.delete(
                existing_email_verification_token
            )

        (
            verification_token,
            email_verification,
        ) = await self._email_verification_token_repo.create(email=email)

        await self._email_sender.send_template_email(
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

        return Ok(
            self._email_verification_token_cooldown_remaining_seconds(
                email_verification
            )
        )

    async def verify_email(
        self,
        email: str,
        email_verification_token: str,
        captcha_token: str,
        request: Request,
    ) -> Result[
        None,
        EmailInUseError | InvalidEmailVerificationTokenError | InvalidCaptchaTokenError,
    ]:
        """Verify an email address."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

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

    async def _verify_captcha_token(self, captcha_token: str, ip_address: str) -> bool:
        """Verify whether the given captcha token is valid."""
        return await self._captcha_verifier.verify(captcha_token, ip_address=ip_address)

    async def register_with_password(
        self,
        email: str,
        email_verification_token: str,
        captcha_token: str,
        password: str,
        full_name: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[
        Account,
        EmailInUseError
        | InvalidEmailVerificationTokenError
        | InvalidCaptchaTokenError
        | PasswordNotStrongError,
    ]:
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
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
            auth_providers=["password"],
            analytics_preference=get_analytics_preference(request, self._settings),
        )

        await self._profile_repo.create(account=account)

        # delete the email verification token
        await self._email_verification_token_repo.delete(
            existing_email_verification_token
        )

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_signed_up",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": email, "auth_provider": "password"},
        )

        return Ok(account)

    @staticmethod
    def generate_account_id() -> ObjectId:
        return ObjectId()

    async def generate_passkey_registration_options(
        self,
        full_name: str,
        email: str,
        captcha_token: str,
        request: Request,
    ) -> Result[
        PublicKeyCredentialCreationOptions, InvalidCaptchaTokenError | EmailInUseError
    ]:
        """Generate registration options for registering via a passkey."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        # check email availability (failsafe)
        if await self._account_repo.get_by_email(email=email):
            return Err(EmailInUseError())
        account_id = self.generate_account_id()
        registration_options = generate_registration_options(
            rp_id=self._settings.rp_id,
            rp_name=self._settings.rp_name,
            user_id=account_id.binary,
            user_name=email,
            user_display_name=full_name,
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM,
                user_verification=UserVerificationRequirement.PREFERRED,
                resident_key=ResidentKeyRequirement.REQUIRED,
            ),
        )

        await self._webauthn_challenge_repo.create(
            challenge=registration_options.challenge,
            generated_account_id=account_id,
        )

        return Ok(registration_options)

    async def register_with_passkey(
        self,
        email: str,
        email_verification_token: str,
        captcha_token: str,
        passkey_registration_response: dict[Any, Any],
        passkey_nickname: str,
        full_name: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[
        Account,
        EmailInUseError
        | InvalidEmailVerificationTokenError
        | InvalidCaptchaTokenError
        | InvalidPasskeyRegistrationCredentialError,
    ]:
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
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

        try:
            # validate passkey registration response
            passkey_registration_credential = parse_registration_credential_json(
                passkey_registration_response
            )
        except WebAuthnException:
            return Err(InvalidPasskeyRegistrationCredentialError())

        client_data = parse_client_data_json(
            passkey_registration_credential.response.client_data_json,
        )

        verified_registration = verify_registration_response(
            credential=passkey_registration_credential,
            expected_challenge=client_data.challenge,
            expected_rp_id=self._settings.rp_id,
            expected_origin=self._settings.rp_expected_origin,
            require_user_verification=True,
        )

        if not verified_registration.user_verified:
            return Err(InvalidPasskeyRegistrationCredentialError())

        webauthn_challenge = await self._webauthn_challenge_repo.get(
            challenge=client_data.challenge,
        )

        if webauthn_challenge is None:
            return Err(InvalidPasskeyRegistrationCredentialError())

        account = await self._account_repo.create(
            account_id=webauthn_challenge.generated_account_id,
            email=email,
            password=None,
            full_name=full_name,
            auth_providers=["webauthn_credential"],
            analytics_preference=get_analytics_preference(request, self._settings),
        )

        # delete the webauthn challenge after account creation
        await self._webauthn_challenge_repo.delete(webauthn_challenge)

        await self._web_authn_credential_repo.create(
            account_id=account.id,
            credential_id=verified_registration.credential_id,
            credential_public_key=verified_registration.credential_public_key,
            sign_count=verified_registration.sign_count,
            backed_up=verified_registration.credential_backed_up,
            device_type=verified_registration.credential_device_type,
            transports=passkey_registration_credential.response.transports,
            nickname=passkey_nickname,
        )

        await self._profile_repo.create(account=account)

        # delete the email verification token
        await self._email_verification_token_repo.delete(
            existing_email_verification_token
        )

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_signed_up",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": email, "auth_provider": "passkey"},
        )

        return Ok(account)

    async def generate_authentication_options(
        self,
        captcha_token: str,
        request: Request,
    ) -> Result[PublicKeyCredentialRequestOptions, InvalidCaptchaTokenError]:
        """Generate authentication options."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        auth_options = generate_authentication_options(
            rp_id=self._settings.rp_id,
            user_verification=UserVerificationRequirement.PREFERRED,
        )

        # set webauthn challenge in session
        # session cannot store raw bytes, so we encode it to base64
        request.session["webauthn_challenge"] = b64encode(
            auth_options.challenge
        ).decode("utf-8")

        return Ok(auth_options)

    async def generate_reauthentication_options(
        self,
        captcha_token: str,
        request: Request,
        account: Account,
    ) -> Result[PublicKeyCredentialRequestOptions, InvalidCaptchaTokenError]:
        """Generate reauthentication options (for sudo mode requests)."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

        webauthn_credentials = (
            await self._web_authn_credential_repo.get_all_by_account_list(
                account_id=account.id
            )
        )
        auth_options = generate_authentication_options(
            rp_id=self._settings.rp_id,
            user_verification=UserVerificationRequirement.PREFERRED,
            allow_credentials=[
                PublicKeyCredentialDescriptor(
                    type=PublicKeyCredentialType.PUBLIC_KEY,
                    id=credential.credential_id,
                    transports=credential.transports,
                )
                for credential in webauthn_credentials
            ],
        )

        # set webauthn challenge in session
        # session cannot store raw bytes, so we encode it to base64
        request.session["webauthn_challenge"] = b64encode(
            auth_options.challenge
        ).decode("utf-8")

        return Ok(auth_options)

    async def login_with_passkey(
        self,
        captcha_token: str,
        authentication_response: dict[Any, Any],
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[
        Account,
        InvalidPasskeyAuthenticationCredentialError
        | InvalidCaptchaTokenError
        | WebAuthnChallengeNotFoundError,
    ]:
        """Login a user with a passkey."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

        webauthn_challenge: str | None = request.session.get("webauthn_challenge")
        if webauthn_challenge is None:
            return Err(WebAuthnChallengeNotFoundError())

        try:
            authentication_credential = parse_authentication_credential_json(
                authentication_response
            )
            web_authn_credential = await self._web_authn_credential_repo.get(
                credential_id=authentication_credential.raw_id
            )

            if web_authn_credential is None:
                return Err(InvalidPasskeyAuthenticationCredentialError())

            authentication_verification = verify_authentication_response(
                credential=authentication_credential,
                # decode the base64 encoded challenge
                expected_challenge=b64decode(webauthn_challenge),
                expected_rp_id=self._settings.rp_id,
                expected_origin=self._settings.rp_expected_origin,
                require_user_verification=True,
                credential_public_key=web_authn_credential.public_key,
                credential_current_sign_count=web_authn_credential.sign_count,
            )
        except WebAuthnException:
            return Err(InvalidPasskeyAuthenticationCredentialError())
        if not authentication_verification.user_verified:
            return Err(InvalidPasskeyAuthenticationCredentialError())

        # update credential sign count
        await self._web_authn_credential_repo.update_sign_count(
            web_authn_credential=web_authn_credential,
            sign_count=authentication_verification.new_sign_count,
        )

        account = web_authn_credential.account

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        # delete webauthn challenge from session
        del request.session["webauthn_challenge"]

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_logged_in",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": account.email, "auth_provider": "passkey"},
        )

        return Ok(account)

    async def login_with_password(
        self,
        email: str,
        password: str,
        captcha_token: str,
        user_agent: str,
        request: Request,
        response: Response,
    ) -> Result[
        Account,
        InvalidCredentialsError
        | InvalidCaptchaTokenError
        | InvalidAuthenticationProviderError
        | TwoFactorAuthenticationRequiredError,
    ]:
        """Login a user with email and password."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        account = await self._account_repo.get_by_email(email=email)
        if not account:
            return Err(InvalidCredentialsError())

        if account.password_hash is None:
            # return an error for users who signed up with Google
            return Err(
                InvalidAuthenticationProviderError(
                    available_providers=account.auth_providers,
                )
            )

        if not self._account_repo.verify_password(
            password=password,
            password_hash=account.password_hash,
        ):
            return Err(InvalidCredentialsError())

        if account.has_2fa_enabled and "authenticator" in account.two_factor_providers:
            # Set 2FA challenge cookie
            (
                challenge,
                two_factor_challenge,
            ) = await self._two_factor_authentication_challenge_repo.create(
                account=account,
                totp_secret=account.two_factor_secret,
            )
            self._set_two_factor_challenge(
                request=request,
                challenge=challenge,
                challenge_expires_at=two_factor_challenge.expires_at,
            )
            return Err(TwoFactorAuthenticationRequiredError())

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_logged_in",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": account.email, "auth_provider": "password"},
        )

        return Ok(account)

    @staticmethod
    def check_password_strength(password: str) -> bool:
        """
        Check if a password is strong.

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

    async def _get_google_phone_number(self, access_token: str) -> str | None:
        """Get the phone number from the user info."""
        phone_number = None
        async with httpx.AsyncClient() as client:
            # Request additional fields that might contain phone numbers
            response = await client.get(
                "https://people.googleapis.com/v1/people/me",
                params={
                    "personFields": "phoneNumbers",
                },
                headers={"Authorization": f"Bearer {access_token}"},
            )

            print("RESPONSE", response.json())

            if response.status_code == HTTPStatus.OK:
                data = response.json()
                # This will likely be empty if the auth app isn't verified by Google.
                phone_numbers = data.get("phoneNumbers", [])
                if phone_numbers:
                    phone_number = phone_numbers[0].get("value")
            else:
                # Log error but don't fail the signup process
                print(f"Failed to fetch Google profile: {response.status_code}")

        if not phone_number:
            return None
        return phonenumbers.format_number(
            phone_number, phonenumbers.PhoneNumberFormat.E164
        )

    async def signin_with_google(
        self,
        user_info: dict,
        request: Request,
        user_agent: str,
        response: Response,
        access_token: str,
    ) -> Result[Account, InvalidEmailError | TwoFactorAuthenticationRequiredError]:
        """Sign in with Google."""
        if not user_info["email_verified"]:
            return Err(InvalidEmailError(message="Email address is not verified."))

        is_signup = False
        account = await self._account_repo.get_by_email(email=user_info["email"])
        if account is None:
            is_signup = True
            # TODO: uncomment after google auth app is verified
            # phone_number = await self._get_google_phone_number(access_token)
            account = await self._account_repo.create(
                email=user_info["email"],
                full_name=user_info["name"],
                # phone_number=phone_number, # TODO: uncomment after google auth app is verified
                # set initial password to None for the user
                password=None,
                auth_providers=["oauth_google"],
                analytics_preference=get_analytics_preference(request, self._settings),
            )
            await self._profile_repo.create(account=account)
            # create an oauth credential for the user
            await self._oauth_credential_repo.create(
                account_id=account.id,
                provider="google",
                provider_user_id=user_info["sub"],
            )

        if "oauth_google" not in account.auth_providers:
            # user already exists, but this is the first time they are
            # signing in with Google
            await self._account_repo.update_auth_providers(
                account=account,
                auth_providers=[*account.auth_providers, "oauth_google"],
            )

            # create an oauth credential for the user
            await self._oauth_credential_repo.create(
                account_id=account.id,
                provider="google",
                provider_user_id=user_info["sub"],
            )

        if account.has_2fa_enabled and "authenticator" in account.two_factor_providers:
            # Set 2FA challenge cookie
            (
                challenge,
                two_factor_challenge,
            ) = await self._two_factor_authentication_challenge_repo.create(
                account=account,
                totp_secret=account.two_factor_secret,
            )
            self._set_two_factor_challenge(
                request=request,
                challenge=challenge,
                challenge_expires_at=two_factor_challenge.expires_at,
            )
            return Err(TwoFactorAuthenticationRequiredError())

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._set_user_session(
            request=request,
            value=session_token,
        )

        if account.auth_providers == ["oauth_google"]:
            # user has only the Oauth Google auth provider
            # hence, we can grant sudo mode when they sign in
            self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        if is_signup:
            self._posthog_client.capture(
                event="user_signed_up",
                distinct_id=str(relay.GlobalID("Account", str(account.id))),
                properties={"email": account.email, "auth_provider": "oauth_google"},
            )
        else:
            self._posthog_client.capture(
                event="user_logged_in",
                distinct_id=str(relay.GlobalID("Account", str(account.id))),
                properties={"email": account.email, "auth_provider": "oauth_google"},
            )

        return Ok(account)

    def _set_user_session(self, request: Request, value: str) -> None:
        request.session["session_token"] = value

    def _set_two_factor_challenge(
        self,
        request: Request,
        challenge: str,
        challenge_expires_at: datetime,
    ) -> None:
        request.session["2fa_challenge"] = challenge
        request.session["2fa_challenge_expires_at"] = format_datetime(
            challenge_expires_at
        )

    def _delete_two_factor_challenge(self, request: Request) -> None:
        request.session.pop("2fa_challenge", None)
        request.session.pop("2fa_challenge_expires_at", None)

    def _set_temp_two_factor_challenge(self, request: Request, value: str) -> None:
        request.session["temp_2fa_challenge"] = value

    def _delete_temp_two_factor_challenge(self, request: Request) -> None:
        request.session.pop("temp_2fa_challenge", None)

    def _set_analytics_preference(self, response: Response, account: Account) -> None:
        """Set the analytics preference cookie."""
        if account.analytics_preference.type != "undecided":
            response.set_cookie(
                self._settings.analytics_preference_cookie_name,
                "yes" if account.analytics_preference.type == "acceptance" else "no",
                max_age=365 * 24 * 60 * 60,  # 1 year
                path="/",
                secure=self._settings.session_cookie_secure,
                domain=self._settings.session_cookie_domain,
                httponly=False,  # Allow JavaScript access for client-side reading
                samesite="lax",
            )
        else:
            response.delete_cookie(
                self._settings.analytics_preference_cookie_name,
                path="/",
                domain=self._settings.session_cookie_domain,
                secure=self._settings.session_cookie_secure,
                httponly=False,  # Allow JavaScript access for client-side reading
                samesite="lax",
            )

    async def logout(
        self, request: Request, response: Response, session_token: str
    ) -> None:
        """Log out the current user."""
        await self._session_repo.delete_by_token(token=session_token)

        # clear request session
        request.session.clear()

        response.delete_cookie(
            self._settings.analytics_preference_cookie_name,
            path="/",
            domain=self._settings.session_cookie_domain,
            secure=self._settings.session_cookie_secure,
            httponly=False,  # Allow JavaScript access for client-side reading
            samesite="lax",
        )

    async def get_password_reset_token(
        self, password_reset_token: str, email: str
    ) -> Result[PasswordResetToken, PasswordResetTokenNotFoundError]:
        """Get a password reset token (used to check it's validity)."""
        reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token,
            email=email,
        )
        if reset_token is None:
            return Err(PasswordResetTokenNotFoundError())
        return Ok(reset_token)

    def _is_password_reset_token_cooled_down(
        self, token: EmailVerificationToken
    ) -> bool:
        """Check if a password reset token is cooled down."""
        current_time = datetime.now(UTC)
        # Ensure generation_time is aware (assuming it's stored in UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.password_reset_token_cooldown
        )
        return current_time >= cooldown_time

    def _password_reset_token_cooldown_remaining_seconds(
        self, token: EmailVerificationToken
    ) -> int:
        """
        Calculate remaining cooldown seconds for the password reset token.

        Returns 0 if cooldown has passed or token is invalid.
        """
        if self._is_password_reset_token_cooled_down(token):
            return 0

        current_time = datetime.now(UTC)
        generation_time_aware = token.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=self._settings.password_reset_token_cooldown
        )

        remaining = (cooldown_time - current_time).total_seconds()
        return max(0, int(remaining))  # Ensure non-negative integer

    async def request_password_reset(
        self,
        email: str,
        user_agent: str,
        captcha_token: str,
        request: Request,
    ) -> Result[None, InvalidCaptchaTokenError | PasswordResetTokenCooldownError]:
        """Request a password reset."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        existing_user = await self._account_repo.get_by_email(email=email)
        if not existing_user:
            return Ok(None)

        existing_password_reset_token = (
            await self._password_reset_token_repo.get_by_account(
                account_id=existing_user.id,
            )
        )

        if existing_password_reset_token is not None:
            if not self._is_password_reset_token_cooled_down(
                existing_password_reset_token
            ):
                return Err(
                    PasswordResetTokenCooldownError(
                        remaining_seconds=self._password_reset_token_cooldown_remaining_seconds(
                            existing_password_reset_token
                        )
                    )
                )
            await self._password_reset_token_repo.delete(existing_password_reset_token)
        password_reset_token = await self._password_reset_token_repo.create(
            account=existing_user
        )

        await self._email_sender.send_template_email(
            template="password-reset",
            receiver=existing_user.email,
            context={
                "is_initial": existing_user.password_hash is None,
                "reset_link": f"{self._app_settings.accounts_base_url}/auth/reset-password/{password_reset_token}?email={existing_user.email}",
                "link_expires_in": naturaldelta(
                    timedelta(seconds=PASSWORD_RESET_EXPIRES_IN)
                ),
                "user_agent": user_agent,
            },
        )

        return Ok(None)

    async def verify_2fa_password_reset_with_authenticator(
        self,
        request: Request,
        two_factor_token: str,
        password_reset_token: str,
        email: str,
        captcha_token: str,
        response: Response,
    ) -> Result[
        PasswordResetToken,
        InvalidPasswordResetTokenError
        | InvalidCredentialsError
        | AuthenticatorNotEnabledError
        | InvalidCaptchaTokenError,
    ]:
        """Verify a 2FA challenge for password reset with an authenticator app."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        existing_reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token,
            email=email,
        )

        if existing_reset_token is None:
            return Err(InvalidPasswordResetTokenError())

        account = existing_reset_token.account

        if account.two_factor_secret is None:
            return Err(AuthenticatorNotEnabledError())

        existing_recovery_code = await self._recovery_code_repo.get(
            account_id=account.id,
            code=two_factor_token,
        )

        if existing_recovery_code is None:
            totp = pyotp.TOTP(account.two_factor_secret)
            if not totp.verify(two_factor_token):
                return Err(InvalidCredentialsError())
        else:
            # delete the recovery code
            await self._recovery_code_repo.delete(existing_recovery_code)

        # set a cookie to indicate user has completed 2fa challenge for password reset
        challenge = await self._temp_two_factor_challenge_repo.create(
            account_id=account.id,
            password_reset_token_id=existing_reset_token.id,
        )

        self._set_temp_two_factor_challenge(
            request=request,
            value=challenge,
        )

        self._set_analytics_preference(response=response, account=account)

        return Ok(existing_reset_token)

    async def verify_2fa_password_reset_with_passkey(
        self,
        request: Request,
        authentication_response: dict[Any, Any],
        password_reset_token: str,
        email: str,
        captcha_token: str,
        response: Response,
    ) -> Result[
        PasswordResetToken,
        InvalidPasswordResetTokenError
        | InvalidPasskeyAuthenticationCredentialError
        | TwoFactorAuthenticationNotEnabledError
        | InvalidCaptchaTokenError
        | WebAuthnChallengeNotFoundError,
    ]:
        """Verify a 2FA challenge for password reset with a passkey."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        existing_reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token,
            email=email,
        )

        if existing_reset_token is None:
            return Err(InvalidPasswordResetTokenError())

        webauthn_challenge: str = request.session.get("webauthn_challenge")
        if webauthn_challenge is None:
            return Err(WebAuthnChallengeNotFoundError())

        try:
            authentication_credential = parse_authentication_credential_json(
                authentication_response
            )
            web_authn_credential = await self._web_authn_credential_repo.get(
                credential_id=authentication_credential.raw_id
            )

            if web_authn_credential is None:
                return Err(InvalidPasskeyAuthenticationCredentialError())

            authentication_verification = verify_authentication_response(
                credential=authentication_credential,
                # decode the base64 encoded challenge
                expected_challenge=b64decode(webauthn_challenge),
                expected_rp_id=self._settings.rp_id,
                expected_origin=self._settings.rp_expected_origin,
                require_user_verification=True,
                credential_public_key=web_authn_credential.public_key,
                credential_current_sign_count=web_authn_credential.sign_count,
            )
        except WebAuthnException:
            return Err(InvalidPasskeyAuthenticationCredentialError())
        if not authentication_verification.user_verified:
            return Err(InvalidPasskeyAuthenticationCredentialError())

        # update credential sign count
        await self._web_authn_credential_repo.update_sign_count(
            web_authn_credential=web_authn_credential,
            sign_count=authentication_verification.new_sign_count,
        )

        account = web_authn_credential.account

        # delete webauthn challenge from session
        del request.session["webauthn_challenge"]

        # set a cookie to indicate user has completed 2fa challenge for password reset
        challenge = await self._temp_two_factor_challenge_repo.create(
            account_id=account.id,
            password_reset_token_id=existing_reset_token.id,
        )

        self._set_temp_two_factor_challenge(
            request=request,
            value=challenge,
        )

        self._set_analytics_preference(response=response, account=account)
        return Ok(existing_reset_token)

    async def reset_password(
        self,
        password_reset_token: str,
        email: str,
        new_password: str,
        user_agent: str,
        request: Request,
    ) -> Result[
        Account,
        InvalidPasswordResetTokenError
        | PasswordNotStrongError
        | TwoFactorAuthenticationChallengeNotFoundError,
    ]:
        """Reset a user's password."""
        existing_reset_token = await self._password_reset_token_repo.get(
            token=password_reset_token,
            email=email,
        )

        if not existing_reset_token:
            return Err(InvalidPasswordResetTokenError())

        temp_challenge: TemporaryTwoFactorChallenge | None = None

        if existing_reset_token.account.has_2fa_enabled:
            challenge = request.session.get("temp_2fa_challenge")
            if challenge is None:
                return Err(TwoFactorAuthenticationChallengeNotFoundError())

            temp_challenge = await self._temp_two_factor_challenge_repo.get(
                challenge=challenge, password_reset_token_id=existing_reset_token.id
            )
            if temp_challenge is None:
                return Err(TwoFactorAuthenticationChallengeNotFoundError())
            # we don't need to verify the TOTP token as the challenge cookie
            # is set only after the user completes a 2FA challenge

        if not self.check_password_strength(password=new_password):
            return Err(PasswordNotStrongError())

        await self._account_repo.update_password(
            account=existing_reset_token.account, password=new_password
        )

        if "password" not in existing_reset_token.account.auth_providers:
            # user is setting their password for the first time
            await self._account_repo.update_auth_providers(
                account=existing_reset_token.account,
                auth_providers=[
                    *existing_reset_token.account.auth_providers,
                    "password",
                ],
            )

        # delete all existing user sessions
        await self._session_repo.delete_all(account_id=existing_reset_token.account.id)

        session_token = await self._session_repo.create(
            user_agent=user_agent,
            account=existing_reset_token.account,
            ip_address=request.client.host,
        )

        # delete password reset token
        await self._password_reset_token_repo.delete(existing_reset_token)

        if temp_challenge is not None:
            # delete the temp 2fa challenge cookie
            self._delete_temp_two_factor_challenge(request=request)
            await self._temp_two_factor_challenge_repo.delete(temp_challenge)

        self._set_user_session(
            request=request,
            value=session_token,
        )

        return Ok(existing_reset_token.account)

    async def update_password(
        self,
        new_password: str,
        account: Account,
    ) -> Result[Account, PasswordNotStrongError]:
        """Update the current user's password."""
        if not self.check_password_strength(password=new_password):
            return Err(PasswordNotStrongError())

        await self._account_repo.update_password(account=account, password=new_password)

        if "password" not in account.auth_providers:
            # user is setting their password for the first time
            await self._account_repo.update_auth_providers(
                account=account,
                auth_providers=[
                    *account.auth_providers,
                    "password",
                ],
            )

        return Ok(account)

    async def delete_password(
        self, account: Account
    ) -> Result[Account, InsufficientAuthProvidersError]:
        """Delete the current user's password."""
        if account.auth_providers == ["password"]:
            return Err(InsufficientAuthProvidersError())

        account = await self._account_repo.delete_password(account=account)

        return Ok(account)

    async def delete_other_sessions(
        self, account_id: ObjectId, except_session_token: str
    ) -> Ok[list[ObjectId]]:
        """Delete all sessions for the user except the current one."""
        existing_sessions = await self._session_repo.get_all_list(
            account_id=account_id, except_session_token=except_session_token
        )
        session_ids = [session.id for session in existing_sessions]
        await self._session_repo.delete_many(session_ids=session_ids)

        return Ok(session_ids)

    async def delete_session(
        self,
        session_id: ObjectId,
        account_id: ObjectId,
        except_session_token: str,
    ) -> Result[Session, SessionNotFoundError]:
        """Delete a session by ID."""
        session = await self._session_repo.get_by_session_account_id(
            session_id=session_id,
            account_id=account_id,
            except_session_token=except_session_token,
        )
        if not session:
            return Err(SessionNotFoundError())
        await self._session_repo.delete(session)
        return Ok(session)

    async def delete_web_authn_credential(
        self, account: Account, web_authn_credential_id: ObjectId
    ) -> Result[
        WebAuthnCredential,
        WebAuthnCredentialNotFoundError | InsufficientAuthProvidersError,
    ]:
        """Delete a WebAuthn credential by ID."""
        webauthn_credentials = (
            await self._web_authn_credential_repo.get_all_by_account_list(
                account_id=account.id
            )
        )

        web_authn_credential = next(
            (
                credential
                for credential in webauthn_credentials
                if credential.id == web_authn_credential_id
            ),
            None,
        )

        if not web_authn_credential:
            return Err(WebAuthnCredentialNotFoundError())

        if (
            account.auth_providers == ["webauthn_credential"]
            and len(webauthn_credentials) == 1
        ):
            # Cannot delete the only webauthn credential when it is the user's only authentication method
            # This prevents users from locking themselves out of their account
            return Err(InsufficientAuthProvidersError())

        await self._web_authn_credential_repo.delete(web_authn_credential)

        if len(webauthn_credentials) <= 1:
            # update auth providers for the account
            # user has removed their last webauthn credential
            await self._account_repo.update_auth_providers(
                account=account,
                auth_providers=[
                    provider
                    for provider in account.auth_providers
                    if provider != "webauthn_credential"
                ],
            )
        return Ok(web_authn_credential)

    async def generate_web_authn_credential_creation_options(
        self,
        account: Account,
    ) -> Ok[PublicKeyCredentialCreationOptions]:
        """Generate registration options for adding a new webauthn credential."""
        registration_options = generate_registration_options(
            rp_id=self._settings.rp_id,
            rp_name=self._settings.rp_name,
            user_id=account.id.binary,
            user_name=account.email,
            user_display_name=account.full_name,
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM,
                user_verification=UserVerificationRequirement.PREFERRED,
                resident_key=ResidentKeyRequirement.REQUIRED,
            ),
        )

        return Ok(registration_options)

    async def create_web_authn_credential(
        self,
        passkey_registration_response: dict[Any, Any],
        account: Account,
        nickname: str,
    ) -> Result[WebAuthnCredential, InvalidPasskeyRegistrationCredentialError]:
        """Create a new webauthn credential."""
        try:
            # validate passkey registration response
            passkey_registration_credential = parse_registration_credential_json(
                passkey_registration_response
            )
        except WebAuthnException:
            return Err(InvalidPasskeyRegistrationCredentialError())

        client_data = parse_client_data_json(
            passkey_registration_credential.response.client_data_json,
        )

        verified_registration = verify_registration_response(
            credential=passkey_registration_credential,
            expected_challenge=client_data.challenge,
            expected_rp_id=self._settings.rp_id,
            expected_origin=self._settings.rp_expected_origin,
            require_user_verification=True,
        )

        if not verified_registration.user_verified:
            return Err(InvalidPasskeyRegistrationCredentialError())

        web_authn_credential = await self._web_authn_credential_repo.create(
            account_id=account.id,
            credential_id=verified_registration.credential_id,
            credential_public_key=verified_registration.credential_public_key,
            sign_count=verified_registration.sign_count,
            backed_up=verified_registration.credential_backed_up,
            device_type=verified_registration.credential_device_type,
            transports=passkey_registration_credential.response.transports,
            nickname=nickname,
        )

        if "webauthn_credential" not in account.auth_providers:
            # user is creating their first webauthn credential
            await self._account_repo.update_auth_providers(
                account=account,
                auth_providers=[*account.auth_providers, "webauthn_credential"],
            )

        return Ok(web_authn_credential)

    async def update_web_authn_credential(
        self,
        web_authn_credential_id: ObjectId,
        account_id: ObjectId,
        nickname: str,
    ) -> Result[WebAuthnCredential, WebAuthnCredentialNotFoundError]:
        """Update a WebAuthn credential by ID."""
        web_authn_credential = (
            await self._web_authn_credential_repo.get_by_account_credential_id(
                web_authn_credential_id=web_authn_credential_id,
                account_id=account_id,
            )
        )
        if not web_authn_credential:
            return Err(WebAuthnCredentialNotFoundError())
        web_authn_credential = await self._web_authn_credential_repo.update(
            web_authn_credential=web_authn_credential, nickname=nickname
        )
        return Ok(web_authn_credential)

    def _grant_sudo_mode(self, request: Request) -> None:
        """Grant sudo mode to the current user request."""
        sudo_mode_expires_at = datetime.now(UTC) + timedelta(
            seconds=SUDO_MODE_EXPIRES_IN
        )
        request.session["sudo_mode_expires_at"] = format_datetime(sudo_mode_expires_at)

    async def request_sudo_mode_with_passkey(
        self,
        captcha_token: str,
        authentication_response: dict[Any, Any],
        request: Request,
    ) -> Result[
        Account,
        InvalidPasskeyAuthenticationCredentialError
        | InvalidCaptchaTokenError
        | WebAuthnChallengeNotFoundError,
    ]:
        """Request sudo mode with a passkey."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

        webauthn_challenge: str = request.session.get("webauthn_challenge")
        if webauthn_challenge is None:
            return Err(WebAuthnChallengeNotFoundError())

        try:
            authentication_credential = parse_authentication_credential_json(
                authentication_response
            )
            web_authn_credential = await self._web_authn_credential_repo.get(
                credential_id=authentication_credential.raw_id
            )

            if web_authn_credential is None:
                return Err(InvalidPasskeyAuthenticationCredentialError())

            authentication_verification = verify_authentication_response(
                credential=authentication_credential,
                # decode the base64 encoded challenge
                expected_challenge=b64decode(webauthn_challenge),
                expected_rp_id=self._settings.rp_id,
                expected_origin=self._settings.rp_expected_origin,
                require_user_verification=True,
                credential_public_key=web_authn_credential.public_key,
                credential_current_sign_count=web_authn_credential.sign_count,
            )
        except WebAuthnException:
            return Err(InvalidPasskeyAuthenticationCredentialError())
        if not authentication_verification.user_verified:
            return Err(InvalidPasskeyAuthenticationCredentialError())

        # update credential sign count
        await self._web_authn_credential_repo.update_sign_count(
            web_authn_credential=web_authn_credential,
            sign_count=authentication_verification.new_sign_count,
        )

        account = web_authn_credential.account

        # delete webauthn challenge from session
        del request.session["webauthn_challenge"]

        self._grant_sudo_mode(request)

        return Ok(account)

    async def request_sudo_mode_with_password(
        self,
        password: str,
        captcha_token: str,
        account: Account,
        request: Request,
    ) -> Result[
        Account,
        InvalidCredentialsError
        | InvalidCaptchaTokenError
        | InvalidAuthenticationProviderError
        | TwoFactorAuthenticationRequiredError,
    ]:
        """Request sudo mode with password."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

        if account.password_hash is None:
            # return an error for users who signed up with Google
            return Err(
                InvalidAuthenticationProviderError(
                    available_providers=account.auth_providers
                )
            )

        if account.has_2fa_enabled:
            return Err(TwoFactorAuthenticationRequiredError())

        if not self._account_repo.verify_password(
            password=password,
            password_hash=account.password_hash,
        ):
            return Err(InvalidCredentialsError())

        self._grant_sudo_mode(request)

        return Ok(account)

    async def request_sudo_mode_with_authenticator(
        self,
        two_factor_token: str,
        captcha_token: str,
        account: Account,
        request: Request,
    ) -> Result[
        Account,
        InvalidCredentialsError
        | InvalidCaptchaTokenError
        | AuthenticatorNotEnabledError,
    ]:
        """Request sudo mode with 2FA."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())

        if account.two_factor_secret is None:
            return Err(AuthenticatorNotEnabledError())

        totp = pyotp.TOTP(account.two_factor_secret)
        if not totp.verify(two_factor_token):
            return Err(InvalidCredentialsError())

        self._grant_sudo_mode(request)

        return Ok(account)

    async def request_sudo_mode_with_google_oauth(
        self,
        user_info: dict[str, Any],
        request: Request,
        current_user: Account,
    ) -> Result[Account, AccountNotFoundError | TwoFactorAuthenticationRequiredError]:
        """Request sudo mode with Google Oauth."""
        if user_info["email"] != current_user.email:
            return Err(AccountNotFoundError())

        if current_user.has_2fa_enabled:
            return Err(TwoFactorAuthenticationRequiredError())

        if current_user.auth_providers == ["oauth_google"]:
            # user has only the Oauth Google auth provider
            # hence, we can grant sudo mode when they sign in
            self._grant_sudo_mode(request)

        return Ok(current_user)

    async def generate_authenticator_2fa_challenge(
        self,
        account: Account,
        request: Request,
    ) -> Ok[tuple[str, str]]:
        """Generate a 2FA challenge for the account to setup an authenticator."""
        (
            challenge,
            two_factor_challenge,
        ) = await self._two_factor_authentication_challenge_repo.create(
            account=account,
        )

        totp = pyotp.totp.TOTP(two_factor_challenge.totp_secret)
        otp_uri = totp.provisioning_uri(name=account.email, issuer_name=APP_NAME)

        self._set_two_factor_challenge(
            request=request,
            challenge=challenge,
            challenge_expires_at=two_factor_challenge.expires_at,
        )
        return Ok((otp_uri, totp.secret))

    async def enable_account_2fa_with_authenticator(
        self,
        account: Account,
        token: str,
        request: Request,
    ) -> Result[
        tuple[Account, list[str]],
        TwoFactorAuthenticationChallengeNotFoundError | InvalidCredentialsError,
    ]:
        """Enable two factor authentication for the account using an authenticator."""
        challenge = request.session.get("2fa_challenge")

        if challenge is None:
            return Err(TwoFactorAuthenticationChallengeNotFoundError())

        two_factor_authentication_challenge = (
            await self._two_factor_authentication_challenge_repo.get(
                challenge=challenge
            )
        )

        if two_factor_authentication_challenge is None:
            self._delete_two_factor_challenge(request=request)
            return Err(TwoFactorAuthenticationChallengeNotFoundError())
        totp = pyotp.TOTP(two_factor_authentication_challenge.totp_secret)
        if not totp.verify(token):
            return Err(InvalidCredentialsError())
        await self._account_repo.set_two_factor_secret(
            account=account,
            totp_secret=two_factor_authentication_challenge.totp_secret,
        )
        recovey_codes = await self._recovery_code_repo.create_many(
            account_id=account.id
        )
        self._delete_two_factor_challenge(request=request)
        return Ok((account, recovey_codes))

    async def disable_account_2fa_with_authenticator(
        self,
        account: Account,
    ) -> Result[Account, AuthenticatorNotEnabledError]:
        """Disable two factor authentication for the account with authenticator app."""
        if not account.two_factor_secret:
            return Err(AuthenticatorNotEnabledError())
        await self._recovery_code_repo.delete_all(account_id=account.id)
        await self._account_repo.delete_two_factor_secret(account=account)
        return Ok(account)

    async def verify_2fa_with_authenticator(
        self,
        request: Request,
        user_agent: str,
        token: str,
        captcha_token: str,
        response: Response,
    ) -> Result[
        Account,
        InvalidCredentialsError
        | AuthenticatorNotEnabledError
        | TwoFactorAuthenticationChallengeNotFoundError
        | InvalidCaptchaTokenError,
    ]:
        """Verify a 2FA challenge for the account with an authenticator (after login)."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        challenge = request.session.get("2fa_challenge")

        if challenge is None:
            return Err(TwoFactorAuthenticationChallengeNotFoundError())

        two_factor_authentication_challenge = (
            await self._two_factor_authentication_challenge_repo.get(
                challenge=challenge
            )
        )

        if two_factor_authentication_challenge is None:
            self._delete_two_factor_challenge(request=request)
            return Err(TwoFactorAuthenticationChallengeNotFoundError())

        account = two_factor_authentication_challenge.account

        if not account.two_factor_secret:
            return Err(AuthenticatorNotEnabledError())

        totp = pyotp.TOTP(account.two_factor_secret)
        if not totp.verify(token):
            return Err(InvalidCredentialsError())

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._delete_two_factor_challenge(request=request)

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_logged_in",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": account.email, "auth_provider": "2fa_authenticator"},
        )

        return Ok(account)

    async def verify_2fa_with_recovery_code(
        self,
        request: Request,
        user_agent: str,
        token: str,
        captcha_token: str,
        response: Response,
    ) -> Result[
        Account,
        InvalidCredentialsError
        | TwoFactorAuthenticationNotEnabledError
        | TwoFactorAuthenticationChallengeNotFoundError
        | InvalidCaptchaTokenError,
    ]:
        """Verify account 2FA with a recovery code (after login)."""
        if not await self._verify_captcha_token(
            captcha_token, ip_address=request.client.host
        ):
            return Err(InvalidCaptchaTokenError())
        challenge = request.session.get("2fa_challenge")

        if challenge is None:
            return Err(TwoFactorAuthenticationChallengeNotFoundError())

        two_factor_authentication_challenge = (
            await self._two_factor_authentication_challenge_repo.get(
                challenge=challenge
            )
        )

        if two_factor_authentication_challenge is None:
            self._delete_two_factor_challenge(request=request)
            return Err(TwoFactorAuthenticationChallengeNotFoundError())

        account = two_factor_authentication_challenge.account

        if not account.has_2fa_enabled:
            return Err(TwoFactorAuthenticationNotEnabledError())

        recovery_code = await self._recovery_code_repo.get(
            account_id=account.id, code=token
        )

        if recovery_code is None:
            return Err(InvalidCredentialsError())
        # utilize a recovery code for the current user
        await self._recovery_code_repo.delete(recovery_code)

        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        self._delete_two_factor_challenge(request=request)

        self._set_user_session(
            request=request,
            value=session_token,
        )

        self._grant_sudo_mode(request)

        self._set_analytics_preference(response=response, account=account)

        self._posthog_client.capture(
            event="user_logged_in",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"email": account.email, "auth_provider": "2fa_recovery_code"},
        )

        return Ok(account)

    async def generate_2fa_recovery_codes(
        self, account: Account
    ) -> Result[list[str], TwoFactorAuthenticationNotEnabledError]:
        """Generate 2FA recovery codes for the account."""
        if not account.has_2fa_enabled:
            return Err(TwoFactorAuthenticationNotEnabledError())
        await self._recovery_code_repo.delete_all(account_id=account.id)
        recovery_codes = await self._recovery_code_repo.create_many(
            account_id=account.id
        )
        return Ok(recovery_codes)
