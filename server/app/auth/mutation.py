from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension
from strawberry.scalars import JSON
from webauthn import options_to_json

from app.accounts.types import AccountType
from app.auth.exceptions import (
    AuthenticatorNotEnabledError,
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InsufficientAuthProvidersError,
    InvalidAuthenticationProviderError,
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidEmailVerificationTokenError,
    InvalidPasskeyAuthenticationCredentialError,
    InvalidPasskeyRegistrationCredentialError,
    InvalidPasswordResetTokenError,
    InvalidRecaptchaTokenError,
    PasswordNotStrongError,
    PasswordResetTokenCooldownError,
    SessionNotFoundError,
    TwoFactorAuthenticationChallengeNotFoundError,
    TwoFactorAuthenticationNotEnabledError,
    TwoFactorAuthenticationRequiredError,
    WebAuthnChallengeNotFoundError,
    WebAuthnCredentialNotFoundError,
)
from app.auth.permissions import IsAuthenticated, RequiresSudoMode
from app.context import AuthInfo, Info

from .services import AuthService
from .types import (
    AuthenticatorNotEnabledErrorType,
    CreateWebAuthnCredentialPayload,
    CreateWebAuthnCredentialSuccessType,
    DeleteOtherSessionsPayloadType,
    DeletePasswordPayload,
    DeleteSessionPayload,
    DeleteSessionSuccessType,
    DeleteWebAuthnCredentialPayload,
    DeleteWebAuthnCredentialSuccessType,
    DisableAccount2FAWithAuthenticatorPayload,
    EmailInUseErrorType,
    EmailVerificationTokenCooldownErrorType,
    EnableAccount2FAWithAuthenticatorPayload,
    EnableAccount2FAWithAuthenticatorSuccessType,
    Generate2FARecoveryCodesPayload,
    Generate2FARecoveryCodesSuccessType,
    GenerateAuthenticationOptionsPayload,
    GenerateAuthenticationOptionsSuccessType,
    GenerateAuthenticator2FAChallengePayload,
    GenerateAuthenticator2FAChallengeSuccessType,
    GeneratePasskeyCreationOptionsPayload,
    GeneratePasskeyCreationOptionsSuccessType,
    GeneratePasskeyRegistrationOptionsPayload,
    GeneratePasskeyRegistrationOptionsSuccessType,
    InsufficientAuthProvidersErrorType,
    InvalidAuthenticationProviderErrorType,
    InvalidCredentialsErrorType,
    InvalidEmailErrorType,
    InvalidEmailVerificationTokenErrorType,
    InvalidPasskeyAuthenticationCredentialErrorType,
    InvalidPasskeyRegistrationCredentialErrorType,
    InvalidPasswordResetTokenErrorType,
    InvalidRecaptchaTokenErrorType,
    LoginWithPasskeyPayload,
    LoginWithPasswordPayload,
    LogoutPayloadType,
    PasswordNotStrongErrorType,
    PasswordResetTokenCooldownErrorType,
    PasswordResetTokenType,
    RegisterWithPasskeyPayload,
    RegisterWithPasswordPayload,
    RequestEmailVerificationTokenPayload,
    RequestEmailVerificationTokenSuccessType,
    RequestPasswordResetPayload,
    RequestPasswordResetSuccessType,
    RequestSudoModeWithAuthenticatorPayload,
    RequestSudoModeWithPasskeyPayload,
    RequestSudoModeWithPasswordPayload,
    ResetPasswordPayload,
    SessionEdgeType,
    SessionNotFoundErrorType,
    TwoFactorAuthenticationChallengeNotFoundErrorType,
    TwoFactorAuthenticationNotEnabledErrorType,
    TwoFactorAuthenticationRequiredErrorType,
    UpdatePasswordPayload,
    UpdateWebAuthnCredentialPayload,
    Verify2FAPasswordResetWithAuthenticatorPayload,
    Verify2FAPasswordResetWithPasskeyPayload,
    Verify2FAWithAuthenticatorPayload,
    Verify2FAWithRecoveryCodePayload,
    VerifyEmailPayload,
    VerifyEmailSuccessType,
    WebAuthnChallengeNotFoundErrorType,
    WebAuthnCredentialEdgeType,
    WebAuthnCredentialNotFoundErrorType,
    WebAuthnCredentialType,
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
        match await auth_service.request_email_verification_token(
            email=email,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            background_tasks=info.context["background_tasks"],
        ):
            case Ok(verification_token):
                return RequestEmailVerificationTokenSuccessType(
                    remaining_seconds=verification_token.cooldown_remaining_seconds
                )
            case Err(error):
                match error:
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

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=VerifyEmailPayload,
        description="Verify an email.",
    )
    @inject
    async def verify_email(
        self,
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
        match await auth_service.verify_email(
            email=email,
            email_verification_token=email_verification_token,
            recaptcha_token=recaptcha_token,
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case EmailInUseError():
                        return EmailInUseErrorType()
                    case InvalidEmailVerificationTokenError():
                        return InvalidEmailVerificationTokenErrorType()
            case Ok():
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
        match await auth_service.register_with_password(
            email=email,
            email_verification_token=email_verification_token,
            password=password,
            full_name=full_name,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case EmailInUseError():
                        return EmailInUseErrorType()
                    case InvalidEmailVerificationTokenError():
                        return InvalidEmailVerificationTokenErrorType()
                    case PasswordNotStrongError():
                        return PasswordNotStrongErrorType()
            case Ok(account):
                return AccountType.marshal_with_profile(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GeneratePasskeyRegistrationOptionsPayload,
        description="Generate registration options for registering via a passkey.",
    )
    @inject
    async def generate_passkey_registration_options(
        self,
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
        """Generate registration options for registering via a passkey."""
        match await auth_service.generate_passkey_registration_options(
            email=email, full_name=full_name, recaptcha_token=recaptcha_token
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case EmailInUseError():
                        return EmailInUseErrorType()
                    case InvalidEmailVerificationTokenError():
                        return InvalidEmailVerificationTokenErrorType()
            case Ok(options):
                return GeneratePasskeyRegistrationOptionsSuccessType(
                    registration_options=options_to_json(options),
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
        passkey_nickname: Annotated[
            str,
            strawberry.argument(
                description="The nickname of the passkey.",
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
        match await auth_service.register_with_passkey(
            email=email,
            email_verification_token=email_verification_token,
            passkey_registration_response=passkey_registration_response,
            passkey_nickname=passkey_nickname,
            full_name=full_name,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case EmailInUseError():
                        return EmailInUseErrorType()
                    case InvalidEmailVerificationTokenError():
                        return InvalidEmailVerificationTokenErrorType()
                    case InvalidPasskeyRegistrationCredentialError():
                        return InvalidPasskeyRegistrationCredentialErrorType()
            case Ok(account):
                return AccountType.marshal_with_profile(account)

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
        match await auth_service.generate_authentication_options(
            recaptcha_token=recaptcha_token,
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
            case Ok(options):
                return GenerateAuthenticationOptionsSuccessType(
                    authentication_options=options_to_json(options)
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GenerateAuthenticationOptionsPayload,
        description="Generate reauthentication options (for sudo mode requests).",
        permission_classes=[
            IsAuthenticated,
        ],
    )
    @inject
    async def generate_reauthentication_options(
        self,
        info: AuthInfo,
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> GenerateAuthenticationOptionsPayload:
        """Generate reauthentication options (for sudo mode requests)."""
        match await auth_service.generate_reauthentication_options(
            recaptcha_token=recaptcha_token,
            request=info.context["request"],
            account=info.context["current_user"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
            case Ok(options):
                return GenerateAuthenticationOptionsSuccessType(
                    authentication_options=options_to_json(options)
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
        match await auth_service.login_with_passkey(
            authentication_response=authentication_response,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case InvalidPasskeyAuthenticationCredentialError():
                        return InvalidPasskeyAuthenticationCredentialErrorType()
                    case WebAuthnChallengeNotFoundError():
                        return WebAuthnChallengeNotFoundErrorType()
            case Ok(account):
                return AccountType.marshal(account)

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
        match await auth_service.login_with_password(
            email=email,
            password=password,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case InvalidAuthenticationProviderError() as err:
                        return InvalidAuthenticationProviderErrorType.marshal(
                            available_providers=err.available_providers
                        )
                    case TwoFactorAuthenticationRequiredError():
                        return TwoFactorAuthenticationRequiredErrorType()
            case Ok(account):
                return AccountType.marshal(account)

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
    ) -> LogoutPayloadType:
        """Log out the current user."""
        await auth_service.logout(
            request=info.context["request"],
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
        match await auth_service.request_password_reset(
            email=email,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
            background_tasks=info.context["background_tasks"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case PasswordResetTokenCooldownError() as err:
                        return PasswordResetTokenCooldownErrorType(
                            remaining_seconds=err.remaining_seconds
                        )
            case Ok():
                return RequestPasswordResetSuccessType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=Verify2FAPasswordResetWithAuthenticatorPayload,
        description="Verify a 2FA challenge for password reset using an authenticator app.",
    )
    @inject
    async def verify_2fa_password_reset_with_authenticator(
        self,
        info: Info,
        auth_service: Annotated[AuthService, Inject],
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
        two_factor_token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token to verify password reset.",
            ),
        ],
    ) -> Verify2FAPasswordResetWithAuthenticatorPayload:
        """Verify a 2FA challenge for password reset using an authenticator app."""
        match await auth_service.verify_2fa_password_reset_with_authenticator(
            email=email,
            password_reset_token=password_reset_token,
            two_factor_token=two_factor_token,
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidPasswordResetTokenError():
                        return InvalidPasswordResetTokenErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case AuthenticatorNotEnabledError():
                        return AuthenticatorNotEnabledErrorType()
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
            case Ok(reset_token):
                return PasswordResetTokenType.marshal(reset_token)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=Verify2FAPasswordResetWithPasskeyPayload,
        description="Verify a 2FA challenge for password reset using a passkey.",
    )
    @inject
    async def verify_2fa_password_reset_with_passkey(
        self,
        info: Info,
        auth_service: Annotated[AuthService, Inject],
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
        authentication_response: Annotated[
            JSON,
            strawberry.argument(
                description="The passkey authentication response to verify password reset.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
    ) -> Verify2FAPasswordResetWithPasskeyPayload:
        """Verify a 2FA challenge for password reset using a passkey."""
        match await auth_service.verify_2fa_password_reset_with_passkey(
            email=email,
            password_reset_token=password_reset_token,
            authentication_response=authentication_response,
            request=info.context["request"],
            recaptcha_token=recaptcha_token,
        ):
            case Err(error):
                match error:
                    case InvalidPasswordResetTokenError():
                        return InvalidPasswordResetTokenErrorType()
                    case InvalidPasskeyAuthenticationCredentialError():
                        return InvalidPasskeyAuthenticationCredentialErrorType()
                    case TwoFactorAuthenticationNotEnabledError():
                        return TwoFactorAuthenticationNotEnabledErrorType()
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case WebAuthnChallengeNotFoundError():
                        return WebAuthnChallengeNotFoundErrorType()
            case Ok(reset_token):
                return PasswordResetTokenType.marshal(reset_token)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=ResetPasswordPayload,
        description="Reset a user's password.",
    )
    @inject
    async def reset_password(
        self,
        info: Info,
        auth_service: Annotated[AuthService, Inject],
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
    ) -> ResetPasswordPayload:
        """Reset a user's password."""
        match await auth_service.reset_password(
            email=email,
            password_reset_token=password_reset_token,
            new_password=new_password,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InvalidPasswordResetTokenError():
                        return InvalidPasswordResetTokenErrorType()
                    case PasswordNotStrongError():
                        return PasswordNotStrongErrorType()
                    case TwoFactorAuthenticationChallengeNotFoundError():
                        return TwoFactorAuthenticationChallengeNotFoundErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdatePasswordPayload,
        description="Update the current user's password.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ]
            )
        ],
    )
    @inject
    async def update_password(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        new_password: Annotated[
            str,
            strawberry.argument(
                description="The new password.",
            ),
        ],
    ) -> UpdatePasswordPayload:
        """Update the current user's password."""
        match await auth_service.update_password(
            new_password=new_password,
            account=info.context["current_user"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case PasswordNotStrongError():
                        return PasswordNotStrongErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeletePasswordPayload,
        description="Delete the current user's password.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ]
            )
        ],
    )
    @inject
    async def delete_password(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> DeletePasswordPayload:
        """Delete the current user's password."""
        match await auth_service.delete_password(
            account=info.context["current_user"],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case InsufficientAuthProvidersError():
                        return InsufficientAuthProvidersErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteOtherSessionsPayloadType,
        description="Delete other sessions of the viewer than the current one.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def delete_other_sessions(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> DeleteOtherSessionsPayloadType:
        """Delete other sessions of the viewer than the current one."""
        match await auth_service.delete_other_sessions(
            account_id=info.context["current_user"].id,
            except_session_token=info.context["session_token"],
        ):
            case Ok(deleted_session_ids):
                return DeleteOtherSessionsPayloadType.marshal(deleted_session_ids)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteSessionPayload,
        description="Delete session by ID.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def delete_session(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        session_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the session to delete.",
            ),
        ],
    ) -> DeleteSessionPayload:
        """Delete session by ID."""
        match await auth_service.delete_session(
            account_id=info.context["current_user"].id,
            session_id=ObjectId(session_id.node_id),
            except_session_token=info.context["session_token"],
        ):
            case Err(error):
                match error:
                    case SessionNotFoundError():
                        return SessionNotFoundErrorType()
            case Ok(session):
                return DeleteSessionSuccessType(
                    session_edge=SessionEdgeType.marshal(session)
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteWebAuthnCredentialPayload,
        description="Delete webauthn credential by ID.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def delete_web_authn_credential(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        web_authn_credential_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the Webauthn credential to delete.",
            ),
        ],
    ) -> DeleteWebAuthnCredentialPayload:
        """Delete Webauthn credential by ID."""
        match await auth_service.delete_web_authn_credential(
            account=info.context["current_user"],
            web_authn_credential_id=ObjectId(web_authn_credential_id.node_id),
        ):
            case Err(error):
                match error:
                    case WebAuthnCredentialNotFoundError():
                        return WebAuthnCredentialNotFoundErrorType()
                    case InsufficientAuthProvidersError():
                        return InsufficientAuthProvidersErrorType()
            case Ok(web_authn_credential):
                return DeleteWebAuthnCredentialSuccessType(
                    web_authn_credential_edge=WebAuthnCredentialEdgeType.marshal(
                        web_authn_credential
                    )
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateWebAuthnCredentialPayload,
        description="Delete webauthn credential by ID.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_web_authn_credential(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        web_authn_credential_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the Webauthn credential to update.",
            ),
        ],
        nickname: Annotated[
            str,
            strawberry.argument(
                description="The nickname of the passkey.",
            ),
        ],
    ) -> UpdateWebAuthnCredentialPayload:
        """Update Webauthn credential by ID."""
        match await auth_service.update_web_authn_credential(
            account_id=info.context["current_user"].id,
            web_authn_credential_id=ObjectId(web_authn_credential_id.node_id),
            nickname=nickname,
        ):
            case Err(error):
                match error:
                    case WebAuthnCredentialNotFoundError():
                        return WebAuthnCredentialNotFoundErrorType()
            case Ok(web_authn_credential):
                return WebAuthnCredentialType.marshal(web_authn_credential)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GeneratePasskeyCreationOptionsPayload,
        description="Generate registration options for adding a webauthn credential.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def generate_web_authn_credential_creation_options(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> GeneratePasskeyCreationOptionsPayload:
        """Generate registration options for adding a webauthn credential."""
        match await auth_service.generate_web_authn_credential_creation_options(
            account=info.context["current_user"],
        ):
            case Ok(options):
                return GeneratePasskeyCreationOptionsSuccessType(
                    registration_options=options_to_json(options),
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateWebAuthnCredentialPayload,
        description="Create a new webauthn credential for the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def create_web_authn_credential(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        passkey_registration_response: Annotated[
            JSON,
            strawberry.argument(
                description="The passkey registration response.",
            ),
        ],
        nickname: Annotated[
            str,
            strawberry.argument(
                description="The nickname of the passkey.",
            ),
        ],
    ) -> CreateWebAuthnCredentialPayload:
        """Create a new webauthn credential for the current user."""
        match await auth_service.create_web_authn_credential(
            account=info.context["current_user"],
            nickname=nickname,
            passkey_registration_response=passkey_registration_response,
        ):
            case Err(error):
                match error:
                    case InvalidPasskeyRegistrationCredentialError():
                        return InvalidPasskeyRegistrationCredentialErrorType()
            case Ok(web_authn_credential):
                return CreateWebAuthnCredentialSuccessType(
                    web_authn_credential_edge=WebAuthnCredentialEdgeType.marshal(
                        web_authn_credential
                    ),
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestSudoModeWithPasskeyPayload,
        description="Request a sudo mode grant for the current user using a passkey.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def request_sudo_mode_with_passkey(
        self,
        info: AuthInfo,
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
    ) -> RequestSudoModeWithPasskeyPayload:
        """Request a sudo mode grant for the current user using a passkey."""
        match await auth_service.request_sudo_mode_with_passkey(
            request=info.context["request"],
            authentication_response=authentication_response,
            recaptcha_token=recaptcha_token,
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case InvalidPasskeyAuthenticationCredentialError():
                        return InvalidPasskeyAuthenticationCredentialErrorType()
                    case WebAuthnChallengeNotFoundError():
                        return WebAuthnChallengeNotFoundErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestSudoModeWithPasswordPayload,
        description="Request a sudo mode grant for the current user using a password.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def request_sudo_mode_with_password(
        self,
        info: AuthInfo,
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
    ) -> RequestSudoModeWithPasswordPayload:
        """Request a sudo mode grant for the current user using a password."""
        match await auth_service.request_sudo_mode_with_password(
            request=info.context["request"],
            password=password,
            recaptcha_token=recaptcha_token,
            account=info.context["current_user"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case InvalidAuthenticationProviderError() as err:
                        return InvalidAuthenticationProviderErrorType.marshal(
                            available_providers=err.available_providers
                        )
                    case TwoFactorAuthenticationRequiredError():
                        return TwoFactorAuthenticationRequiredErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestSudoModeWithAuthenticatorPayload,
        description="Request a sudo mode grant for the current user using an authenticator app.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def request_sudo_mode_with_authenticator(
        self,
        info: AuthInfo,
        two_factor_token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token of the user.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RequestSudoModeWithAuthenticatorPayload:
        """Request a sudo mode grant for the current user using an authenticator app."""
        match await auth_service.request_sudo_mode_with_authenticator(
            request=info.context["request"],
            two_factor_token=two_factor_token,
            recaptcha_token=recaptcha_token,
            account=info.context["current_user"],
        ):
            case Err(error):
                match error:
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case AuthenticatorNotEnabledError():
                        return AuthenticatorNotEnabledErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=EnableAccount2FAWithAuthenticatorPayload,
        description="Enable account 2FA with authenticator.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def enable_account_2fa_with_authenticator(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token.",
            ),
        ],
    ) -> EnableAccount2FAWithAuthenticatorPayload:
        """Set two factor authentication."""
        match await auth_service.enable_account_2fa_with_authenticator(
            account=info.context["current_user"],
            request=info.context["request"],
            token=token,
        ):
            case Err(error):
                match error:
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case TwoFactorAuthenticationChallengeNotFoundError():
                        return TwoFactorAuthenticationChallengeNotFoundErrorType()
            case Ok(result):
                (account, recovery_codes) = result
                return EnableAccount2FAWithAuthenticatorSuccessType(
                    account=AccountType.marshal(account),
                    recovery_codes=recovery_codes,
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DisableAccount2FAWithAuthenticatorPayload,
        description="Disable two factor authentication with authenticator app.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def disable_account_2fa_with_authenticator(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> DisableAccount2FAWithAuthenticatorPayload:
        """Disable two factor authentication with authenticator app."""
        match await auth_service.disable_account_2fa_with_authenticator(
            account=info.context["current_user"],
        ):
            case Err(error):
                match error:
                    case AuthenticatorNotEnabledError():
                        return AuthenticatorNotEnabledErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GenerateAuthenticator2FAChallengePayload,
        description="Generate an account 2FA challenge to setup an authenticator.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def generate_authenticator_2fa_challenge(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> GenerateAuthenticator2FAChallengePayload:
        """Generate an account 2FA challenge to setup an authenticator."""
        match await auth_service.generate_authenticator_2fa_challenge(
            account=info.context["current_user"],
            request=info.context["request"],
        ):
            case Ok(result):
                otp_uri, secret = result
                return GenerateAuthenticator2FAChallengeSuccessType(
                    otp_uri=otp_uri,
                    secret=secret,
                )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=Verify2FAWithAuthenticatorPayload,
        description="Verify Account 2FA challenge with an authenticator.",
    )
    @inject
    async def verify_2fa_with_authenticator(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
    ) -> Verify2FAWithAuthenticatorPayload:
        """Verify Account 2FA challenge with an authenticator."""
        match await auth_service.verify_2fa_with_authenticator(
            request=info.context["request"],
            token=token,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
        ):
            case Err(error):
                match error:
                    case AuthenticatorNotEnabledError():
                        return AuthenticatorNotEnabledErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case TwoFactorAuthenticationChallengeNotFoundError():
                        return TwoFactorAuthenticationChallengeNotFoundErrorType()
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=Verify2FAWithRecoveryCodePayload,
        description="Verify Account 2FA with a recovery code.",
    )
    @inject
    async def verify_2fa_with_recovery_code(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token.",
            ),
        ],
        recaptcha_token: Annotated[
            str,
            strawberry.argument(
                description="The recaptcha token to verify the user request."
            ),
        ],
    ) -> Verify2FAWithRecoveryCodePayload:
        """Verify Account 2FA with a recovery code."""
        match await auth_service.verify_2fa_with_recovery_code(
            request=info.context["request"],
            token=token,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
        ):
            case Err(error):
                match error:
                    case TwoFactorAuthenticationNotEnabledError():
                        return TwoFactorAuthenticationNotEnabledErrorType()
                    case InvalidCredentialsError():
                        return InvalidCredentialsErrorType()
                    case TwoFactorAuthenticationChallengeNotFoundError():
                        return TwoFactorAuthenticationChallengeNotFoundErrorType()
                    case InvalidRecaptchaTokenError():
                        return InvalidRecaptchaTokenErrorType()
            case Ok(account):
                return AccountType.marshal(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=Generate2FARecoveryCodesPayload,
        description="Generate 2FA recovery codes for the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def generate_2fa_recovery_codes(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> Generate2FARecoveryCodesPayload:
        """Generate 2FA recovery codes for the current user."""
        match await auth_service.generate_2fa_recovery_codes(
            account=info.context["current_user"],
        ):
            case Err(error):
                match error:
                    case TwoFactorAuthenticationNotEnabledError():
                        return TwoFactorAuthenticationNotEnabledErrorType()
            case Ok(recovery_codes):
                return Generate2FARecoveryCodesSuccessType(
                    recovery_codes=recovery_codes,
                )
