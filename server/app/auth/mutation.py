from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err
from strawberry import relay
from strawberry.permission import PermissionExtension
from strawberry.scalars import JSON
from webauthn import options_to_json

from app.accounts.types import AccountType
from app.auth.exceptions import (
    EmailInUseError,
    EmailVerificationTokenCooldownError,
    InsufficientAuthProvidersError,
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidEmailVerificationTokenError,
    InvalidPasskeyAuthenticationCredentialError,
    InvalidPasskeyRegistrationCredentialError,
    InvalidPasswordResetTokenError,
    InvalidRecaptchaTokenError,
    InvalidSignInMethodError,
    PasswordNotStrongError,
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
    CreateWebAuthnCredentialPayload,
    CreateWebAuthnCredentialSuccessType,
    DeleteOtherSessionsPayloadType,
    DeleteSessionPayload,
    DeleteSessionSuccessType,
    DeleteWebAuthnCredentialPayload,
    DeleteWebAuthnCredentialSuccessType,
    DisableAccount2FAPayload,
    EmailInUseErrorType,
    EmailVerificationTokenCooldownErrorType,
    Generate2FARecoveryCodesPayload,
    Generate2FARecoveryCodesSuccessType,
    GenerateAccount2FAOTPURIPayload,
    GenerateAccount2FAOTPURISuccessType,
    GenerateAuthenticationOptionsPayload,
    GenerateAuthenticationOptionsSuccessType,
    GeneratePasskeyCreationOptionsPayload,
    GeneratePasskeyCreationOptionsSuccessType,
    GeneratePasskeyRegistrationOptionsPayload,
    GeneratePasskeyRegistrationOptionsSuccessType,
    InsufficientAuthProvidersErrorType,
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
    RequestEmailVerificationTokenPayload,
    RequestEmailVerificationTokenSuccessType,
    RequestPasswordResetPayload,
    RequestPasswordResetSuccessType,
    RequestSudoModeWithPasskeyPayload,
    RequestSudoModeWithPasswordPayload,
    ResetPasswordPayload,
    SessionEdgeType,
    SessionNotFoundErrorType,
    SetAccount2FAPayload,
    SetAccount2FASuccessType,
    TwoFactorAuthenticationChallengeNotFoundErrorType,
    TwoFactorAuthenticationNotEnabledErrorType,
    TwoFactorAuthenticationRequiredErrorType,
    UpdateWebAuthnCredentialPayload,
    VerifyAccount2FATokenPayload,
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
        result = await auth_service.register_with_passkey(
            email=email,
            email_verification_token=email_verification_token,
            passkey_registration_response=passkey_registration_response,
            passkey_nickname=passkey_nickname,
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
        result = await auth_service.generate_reauthentication_options(
            recaptcha_token=recaptcha_token,
            request=info.context["request"],
            account=info.context["current_user"],
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
                case InvalidSignInMethodError() as err:
                    return InvalidSignInMethodErrorType.marshal(
                        available_providers=err.available_providers
                    )
                case TwoFactorAuthenticationRequiredError():
                    return TwoFactorAuthenticationRequiredErrorType()

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
        deleted_session_ids = await auth_service.delete_other_sessions(
            account_id=info.context["current_user"].id,
            except_session_token=info.context["session_token"],
        )

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
        result = await auth_service.delete_session(
            account_id=info.context["current_user"].id,
            session_id=ObjectId(session_id.node_id),
            except_session_token=info.context["session_token"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case SessionNotFoundError():
                    return SessionNotFoundErrorType()

        return DeleteSessionSuccessType(
            session_edge=SessionEdgeType.marshal(result.ok_value)
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
        result = await auth_service.delete_web_authn_credential(
            account=info.context["current_user"],
            web_authn_credential_id=ObjectId(web_authn_credential_id.node_id),
        )

        if isinstance(result, Err):
            match result.err_value:
                case WebAuthnCredentialNotFoundError():
                    return WebAuthnCredentialNotFoundErrorType()
                case InsufficientAuthProvidersError():
                    return InsufficientAuthProvidersErrorType()

        return DeleteWebAuthnCredentialSuccessType(
            web_authn_credential_edge=WebAuthnCredentialEdgeType.marshal(
                result.ok_value
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
        result = await auth_service.update_web_authn_credential(
            account_id=info.context["current_user"].id,
            web_authn_credential_id=ObjectId(web_authn_credential_id.node_id),
            nickname=nickname,
        )

        if isinstance(result, Err):
            match result.err_value:
                case WebAuthnCredentialNotFoundError():
                    return WebAuthnCredentialNotFoundErrorType()

        return WebAuthnCredentialType.marshal(result.ok_value)

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
        result = await auth_service.generate_web_authn_credential_creation_options(
            account=info.context["current_user"],
        )

        return GeneratePasskeyCreationOptionsSuccessType(
            registration_options=options_to_json(result.ok_value),
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
        result = await auth_service.create_web_authn_credential(
            account=info.context["current_user"],
            nickname=nickname,
            passkey_registration_response=passkey_registration_response,
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidPasskeyRegistrationCredentialError():
                    return InvalidPasskeyRegistrationCredentialErrorType()

        return CreateWebAuthnCredentialSuccessType(
            web_authn_credential_edge=WebAuthnCredentialEdgeType.marshal(
                result.ok_value
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
        result = await auth_service.request_sudo_mode_with_passkey(
            request=info.context["request"],
            authentication_response=authentication_response,
            recaptcha_token=recaptcha_token,
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
        result = await auth_service.request_sudo_mode_with_password(
            request=info.context["request"],
            password=password,
            recaptcha_token=recaptcha_token,
            account=info.context["current_user"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()
                case InvalidSignInMethodError() as err:
                    return InvalidSignInMethodErrorType.marshal(
                        available_providers=err.available_providers
                    )

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=SetAccount2FAPayload,
        description="Set two factor authentication.",
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
    async def set_account_2fa(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        token: Annotated[
            str,
            strawberry.argument(
                description="The 2FA token.",
            ),
        ],
    ) -> SetAccount2FAPayload:
        """Set two factor authentication."""
        result = await auth_service.set_account_2fa(
            account=info.context["current_user"],
            request=info.context["request"],
            response=info.context["response"],
            token=token,
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()
                case TwoFactorAuthenticationChallengeNotFoundError():
                    return TwoFactorAuthenticationChallengeNotFoundErrorType()

        (account, recovery_codes) = result.ok_value

        return SetAccount2FASuccessType(
            account=AccountType.marshal(account), recovery_codes=recovery_codes
        )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DisableAccount2FAPayload,
        description="Disable two factor authentication.",
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
    async def disable_account_2fa(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> DisableAccount2FAPayload:
        """Disable two factor authentication."""
        result = await auth_service.disable_account_2fa(
            account=info.context["current_user"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case TwoFactorAuthenticationNotEnabledError():
                    return TwoFactorAuthenticationNotEnabledErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=GenerateAccount2FAOTPURIPayload,
        description="Generate account 2FA OTP URI.",
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
    async def generate_account_2fa_otp_uri(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
    ) -> GenerateAccount2FAOTPURIPayload:
        """Generate account 2FA OTP URI."""
        result = await auth_service.generate_account_2fa_otp_uri(
            account=info.context["current_user"],
            request=info.context["request"],
            response=info.context["response"],
        )

        otp_uri, secret = result.ok_value

        return GenerateAccount2FAOTPURISuccessType(
            otp_uri=otp_uri,
            secret=secret,
        )

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=VerifyAccount2FATokenPayload,
        description="Verify Account 2FA challenge.",
    )
    @inject
    async def verify_2fa_challenge(
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
    ) -> VerifyAccount2FATokenPayload:
        """Verify Account 2FA challenge."""
        result = await auth_service.verify_2fa_challenge(
            response=info.context["response"],
            request=info.context["request"],
            token=token,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case TwoFactorAuthenticationNotEnabledError():
                    return TwoFactorAuthenticationNotEnabledErrorType()
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()
                case TwoFactorAuthenticationChallengeNotFoundError():
                    return TwoFactorAuthenticationChallengeNotFoundErrorType()
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=VerifyAccount2FATokenPayload,
        description="Verify Account 2FA recovery code.",
    )
    @inject
    async def verify_2fa_recovery_code(
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
    ) -> VerifyAccount2FATokenPayload:
        """Verify Account 2FA recovery code."""
        result = await auth_service.verify_2fa_recovery_code(
            response=info.context["response"],
            request=info.context["request"],
            token=token,
            recaptcha_token=recaptcha_token,
            user_agent=info.context["user_agent"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case TwoFactorAuthenticationNotEnabledError():
                    return TwoFactorAuthenticationNotEnabledErrorType()
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()
                case TwoFactorAuthenticationChallengeNotFoundError():
                    return TwoFactorAuthenticationChallengeNotFoundErrorType()
                case InvalidRecaptchaTokenError():
                    return InvalidRecaptchaTokenErrorType()

        return AccountType.marshal(result.ok_value)

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
        result = await auth_service.generate_2fa_recovery_codes(
            account=info.context["current_user"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case TwoFactorAuthenticationNotEnabledError():
                    return TwoFactorAuthenticationNotEnabledErrorType()

        return Generate2FARecoveryCodesSuccessType(
            recovery_codes=result.ok_value,
        )
