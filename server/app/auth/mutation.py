from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err
from strawberry.permission import PermissionExtension
from strawberry.scalars import JSON
from webauthn import options_to_json

from app.accounts.repositories import AccountRepo
from app.accounts.types import AccountType
from app.auth.exceptions import (
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidEmailVerificationTokenError,
    InvalidPasskeyAuthenticationCredentialError,
    InvalidPasskeyRegistrationCredentialError,
    InvalidPasswordResetTokenError,
    InvalidRecaptchaTokenError,
    InvalidSignInMethodError,
    PasswordNotStrongError,
    WebAuthnChallengeNotFoundError,
)
from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo, Info

from .services import AuthService
from .types import (
    EmailInUseErrorType,
    EmailVerificationTokenCooldownErrorType,
    GenerateAuthenticationOptionsPayload,
    GenerateAuthenticationOptionsSuccessType,
    GeneratePasskeyRegistrationOptionsPayload,
    GeneratePasskeyRegistrationOptionsSuccessType,
    InvalidCredentialsErrorType,
    InvalidEmailErrorType,
    InvalidEmailVerificationTokenErrorType,
    InvalidPasskeyAuthenticationCredentialErrorType,
    InvalidPasskeyRegistrationCredentialErrorType,
    InvalidPasswordResetTokenErrorType,
    InvalidRecaptchaTokenErrorType,
    InvalidSignInMethodErrorType,
    LoginWithPasskeyPayload,
    LoginWithPasswordPayload,
    LogoutPayloadType,
    PasswordNotStrongErrorType,
    RegisterWithPasskeyPayload,
    RegisterWithPasswordPayload,
    RemoveOtherSessionsPayloadType,
    RequestEmailVerificationTokenPayload,
    RequestEmailVerificationTokenSuccessType,
    RequestPasswordResetPayload,
    RequestPasswordResetSuccessType,
    ResetPasswordPayload,
    VerifyEmailPayload,
    VerifyEmailSuccessType,
    WebAuthnChallengeNotFoundErrorType,
)


@strawberry.type
class AuthMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestEmailVerificationTokenPayload,
        description="Request an email verification token.",
    )
    @inject
    async def request_email_verification_token(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email to request an email verification token for.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RequestEmailVerificationTokenPayload:
        result = await auth_service.request_email_verification_token(
            email=email,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            background_tasks=info.context["background_tasks"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case EmailVerificationTokenCooldownError() as err:
                    return EmailVerificationTokenCooldownErrorType(
                        remaining_seconds=err.remaining_seconds
                    )
                case InvalidEmailError() as err:
                    return InvalidEmailErrorType(message=err.message)
                case EmailInUseError():
                    return EmailInUseErrorType()

        return RequestEmailVerificationTokenSuccessType(
            remaining_seconds=result.ok_value.cooldown_remaining_seconds
        )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=VerifyEmailPayload,
        description="Verify an email.",
    )
    @inject
    async def verify_email(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email to request an email verification token for.",
            ),
        ],
        email_verification_token: Annotated[
            str,
            strawberry.argument(
                description="The email verification token.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> VerifyEmailPayload:
        result = await auth_service.verify_email(
            email=email,
            email_verification_token=email_verification_token,
            recaptcha_token=recaptcha_token,
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case EmailInUseError():
                    return EmailInUseErrorType()
                case InvalidEmailVerificationTokenError():
                    return InvalidEmailVerificationTokenErrorType()

        return VerifyEmailSuccessType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RegisterWithPasswordPayload,
        description="Register a new user with a password.",
    )
    @inject
    async def register_with_password(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the new user.",
            ),
        ],
        email_verification_token: Annotated[
            str,
            strawberry.argument(
                description="The email verification token.",
            ),
        ],
        password: Annotated[
            str,
            strawberry.argument(
                description="The password of the new user.",
            ),
        ],
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the new user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RegisterWithPasswordPayload:
        """Register a new user with a password."""
        result = await auth_service.register_with_password(
            email=email,
            email_verification_token=email_verification_token,
            password=password,
            full_name=full_name,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case EmailInUseError():
                    return EmailInUseErrorType()
                case InvalidEmailVerificationTokenError():
                    return InvalidEmailVerificationTokenErrorType()
                case PasswordNotStrongError():
                    return PasswordNotStrongErrorType()

        return AccountType.marshal_with_profile(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GeneratePasskeyRegistrationOptionsPayload,
        description="Generate registration options for adding a passkey.",
    )
    @inject
    async def generate_passkey_registration_options(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the new user.",
            ),
        ],
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the new user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> GeneratePasskeyRegistrationOptionsPayload:
        """Generate registration options for adding a passkey."""
        result = await auth_service.generate_passkey_registration_options(
            email=email, full_name=full_name, recaptcha_token=recaptcha_token
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case EmailInUseError():
                    return EmailInUseErrorType()
                case InvalidEmailVerificationTokenError():
                    return InvalidEmailVerificationTokenErrorType()

        return GeneratePasskeyRegistrationOptionsSuccessType(
            registration_options=options_to_json(result.ok_value),
        )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RegisterWithPasskeyPayload,
        description="Register a new user with a passkey.",
    )
    @inject
    async def register_with_passkey(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the new user.",
            ),
        ],
        email_verification_token: Annotated[
            str,
            strawberry.argument(
                description="The email verification token.",
            ),
        ],
        passkey_registration_response: Annotated[
            JSON,
            strawberry.argument(
                description="The passkey registration response of the new user.",
            ),
        ],
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the new user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RegisterWithPasskeyPayload:
        """Register a new user with a passkey."""
        result = await auth_service.register_with_passkey(
            email=email,
            email_verification_token=email_verification_token,
            passkey_registration_response=passkey_registration_response,
            full_name=full_name,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case EmailInUseError():
                    return EmailInUseErrorType()
                case InvalidEmailVerificationTokenError():
                    return InvalidEmailVerificationTokenErrorType()
                case InvalidPasskeyRegistrationCredentialError():
                    return InvalidPasskeyRegistrationCredentialErrorType()

        return AccountType.marshal_with_profile(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GenerateAuthenticationOptionsPayload,
        description="Generate authentication options.",
    )
    @inject
    async def generate_authentication_options(
        self,
        info: Info,
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> GenerateAuthenticationOptionsPayload:
        """Generate authentication options."""
        result = await auth_service.generate_authentication_options(
            recaptcha_token=recaptcha_token,
            request=info.context["request"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()

        return GenerateAuthenticationOptionsSuccessType(
            authentication_options=options_to_json(result.ok_value)
        )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LoginWithPasskeyPayload,
        description="Log in a user with a passkey.",
    )
    @inject
    async def login_with_passkey(
        self,
        info: Info,
        authentication_response: Annotated[
            JSON,
            strawberry.argument(
                description="The authentication response of the user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> LoginWithPasskeyPayload:
        """Login a user with a passkey."""
        result = await auth_service.login_with_passkey(
            authentication_response=authentication_response,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case InvalidPasskeyAuthenticationCredentialError():
                    return InvalidPasskeyAuthenticationCredentialErrorType()
                case WebAuthnChallengeNotFoundError():
                    return WebAuthnChallengeNotFoundErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LoginWithPasswordPayload,
        description="Log in a user with email and password.",
    )
    @inject
    async def login_with_password(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the user.",
            ),
        ],
        password: Annotated[
            str,
            strawberry.argument(
                description="The password of the user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> LoginWithPasswordPayload:
        """Login a user with email and password."""
        result = await auth_service.login_with_password(
            email=email,
            password=password,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()
                case InvalidSignInMethodError():
                    return InvalidSignInMethodErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LogoutPayloadType,
        description="Log out the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def logout(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        account_repo: Annotated[AccountRepo, Inject],
    ) -> LogoutPayloadType:
        """Log out the current user."""
        await auth_service.logout(
            request=info.context["request"],
            response=info.context["response"],
            session_token=info.context["session_token"],
        )

        return LogoutPayloadType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestPasswordResetPayload,
        description="Request a password reset.",
    )
    @inject
    async def request_password_reset(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the existing user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RequestPasswordResetPayload:
        """Request a password reset."""
        result = await auth_service.request_password_reset(
            email=email,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            background_tasks=info.context["background_tasks"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()

        return RequestPasswordResetSuccessType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=ResetPasswordPayload,
        description="Reset a user's password.",
    )
    @inject
    async def reset_password(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the existing user.",
            ),
        ],
        password_reset_token: Annotated[
            str,
            strawberry.argument(
                description="The password reset token.",
            ),
        ],
        new_password: Annotated[
            str,
            strawberry.argument(
                description="The new password.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> ResetPasswordPayload:
        """Reset a user's password."""
        result = await auth_service.reset_password(
            email=email,
            password_reset_token=password_reset_token,
            new_password=new_password,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidPasswordResetTokenError():
                    return InvalidPasswordResetTokenErrorType()
                case PasswordNotStrongError():
                    return PasswordNotStrongErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RemoveOtherSessionsPayloadType,
        description="Remove other sessions of the viewer than the current one.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def remove_other_sessions(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> RemoveOtherSessionsPayloadType:
        """Remove other sessions of the viewer than the current one."""
        await auth_service.remove_other_sessions(
            account_id=info.context["current_user_id"],
            except_session_token=info.context["session_token"],
        )

        return RemoveOtherSessionsPayloadType()
