from datetime import datetime
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import Private, relay
from strawberry.scalars import JSON

from app.accounts.documents import Account
from app.accounts.types import AccountType, AuthProviderEnum, TwoFactorProviderEnum
from app.auth.documents import PasswordResetToken, Session, WebAuthnCredential
from app.auth.repositories import TemporaryTwoFactorChallengeRepo
from app.base.types import BaseConnectionType, BaseEdgeType, BaseErrorType, BaseNodeType
from app.context import Info
from app.core.constants import AuthProvider
from app.scalars import ID


@strawberry.type(
    name="EmailInUseError",
    description="Used when the email address is in use.",
)
class EmailInUseErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Email address is already in use.",
    )


@strawberry.type(
    name="InvalidEmailError",
    description="Used when an invalid email address is provided.",
)
class InvalidEmailErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid email address provided.",
    )


@strawberry.type(
    name="InvalidCredentialsError",
    description="Used when invalid credentials are provided.",
)
class InvalidCredentialsErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid credentials provided.",
    )


@strawberry.type(
    name="InvalidPasswordResetTokenError",
    description="Used when an invalid password reset token is provided.",
)
class InvalidPasswordResetTokenErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid password reset token provided.",
    )


@strawberry.type(
    name="InvalidEmailVerificationTokenError",
    description="Used when an invalid email verification token is provided.",
)
class InvalidEmailVerificationTokenErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid email verification token provided.",
    )


@strawberry.type(
    name="InvalidRecaptchaTokenError",
    description="Used when an invalid recaptcha token is provided.",
)
class InvalidRecaptchaTokenErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid recaptcha token provided.",
    )


@strawberry.type(
    name="InvalidAuthenticationProviderError",
    description="Used when an invalid authentication provider is used.",
)
class InvalidAuthenticationProviderErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid authentication provider used.",
    )
    available_providers: list[AuthProviderEnum] = strawberry.field(
        description="Available authentication providers for the account.",
    )

    @classmethod
    def marshal(cls, available_providers: list[AuthProvider]) -> Self:
        """Marshal into a node instance."""
        return cls(
            available_providers=[
                AuthProviderEnum[provider.upper()] for provider in available_providers
            ],
        )


@strawberry.type(
    name="PasswordResetToken",
    description="A password reset token.",
)
class PasswordResetTokenType(BaseNodeType[PasswordResetToken]):
    email: str = strawberry.field(
        description="Email address of the password reset token's account.",
    )

    auth_providers: list[AuthProviderEnum] = strawberry.field(
        description="Available 2FA providers for the password reset token's account.",
    )

    two_factor_providers: list[TwoFactorProviderEnum] = strawberry.field(
        description="Available 2FA providers for the password reset token's account.",
    )

    account: strawberry.Private[Account]

    @classmethod
    def marshal(cls, reset_token: PasswordResetToken) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(reset_token.id),
            email=reset_token.account.email,
            account=reset_token.account,
            auth_providers=[
                AuthProviderEnum[provider.upper()]
                for provider in reset_token.account.auth_providers
            ],
            two_factor_providers=[
                TwoFactorProviderEnum[provider.upper()]
                for provider in reset_token.account.two_factor_providers
            ],
        )

    @strawberry.field(
        description="Whether the password reset token needs 2FA to be used.",
    )
    @inject
    async def needs_2fa(
        self,
        info: Info,
        temp_two_factor_challenge_repo: Annotated[
            TemporaryTwoFactorChallengeRepo,
            Inject,
        ],
    ) -> bool:
        """Return whether the account needs 2FA."""
        if not self.account.has_2fa_enabled:
            return False
        challenge = info.context["request"].session.get("temp_2fa_challenge")

        return (
            challenge is None
            or await temp_two_factor_challenge_repo.get(
                challenge=challenge, password_reset_token_id=ObjectId(self.id)
            )
            is None
        )


@strawberry.type(
    name="Session",
    description="An account's session.",
)
class SessionType(BaseNodeType[Session]):
    user_agent: str = strawberry.field(
        description="User agent of the session.",
    )
    ip_address: str = strawberry.field(
        description="IP address of the session.",
    )
    created_at: datetime = strawberry.field(
        description="When the session was created.",
    )

    token_hash: Private[str]

    @classmethod
    def marshal(cls, session: Session) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(session.id),
            user_agent=session.user_agent,
            ip_address=session.ip_address,
            created_at=session.id.generation_time,
            token_hash=session.token_hash,
        )


@strawberry.type(name="SessionEdge")
class SessionEdgeType(BaseEdgeType[SessionType, Session]):
    @classmethod
    def marshal(cls, session: Session) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=SessionType.marshal(session),
            cursor=relay.to_base64(SessionType, session.id),
        )


@strawberry.type(name="SessionConnection")
class SessionConnectionType(BaseConnectionType[SessionType, SessionEdgeType]):
    pass


@strawberry.type(
    name="WebAuthnCredential",
    description="A WebAuthn Credential belonging to an account.",
)
class WebAuthnCredentialType(BaseNodeType[WebAuthnCredential]):
    nickname: str = strawberry.field(
        description="Nickname of the webauthn credential.",
    )
    created_at: datetime = strawberry.field(
        description="When the webauthn credential was created.",
    )

    last_used_at: datetime = strawberry.field(
        description="When the webauthn credential was last used.",
    )

    @classmethod
    def marshal(cls, webauthn_credential: WebAuthnCredential) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(webauthn_credential.id),
            nickname=webauthn_credential.nickname,
            created_at=webauthn_credential.id.generation_time,
            last_used_at=webauthn_credential.last_used_at,
        )


@strawberry.type(name="WebAuthnCredentialEdge")
class WebAuthnCredentialEdgeType(
    BaseEdgeType[WebAuthnCredentialType, WebAuthnCredential]
):
    @classmethod
    def marshal(cls, session: WebAuthnCredential) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=WebAuthnCredentialType.marshal(session),
            cursor=relay.to_base64(WebAuthnCredentialType, session.id),
        )


@strawberry.type(name="WebAuthnCredentialConnection")
class WebAuthnCredentialConnectionType(
    BaseConnectionType[WebAuthnCredentialType, WebAuthnCredentialEdgeType]
):
    pass


@strawberry.type(
    name="PasswordResetTokenNotFoundError",
    description="Used when the password reset token is not found.",
)
class PasswordResetTokenNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Password reset token not found.",
    )


@strawberry.type(
    name="PasswordNotStrongError",
    description="Used when the password is not strong enough.",
)
class PasswordNotStrongErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Password is not strong enough.",
    )


@strawberry.type(
    name="EmailVerificationTokenCooldownError",
    description="Used when the email verification token cooldown is active.",
)
class EmailVerificationTokenCooldownErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Please wait before requesting a new email verification token.",
    )
    remaining_seconds: Annotated[
        int,
        strawberry.field(
            description="Remaining seconds before requesting another email verification token."
        ),
    ]


@strawberry.type(
    name="PasswordResetTokenCooldownError",
    description="Used when the password reset token cooldown is active.",
)
class PasswordResetTokenCooldownErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Please wait before requesting a new password reset token.",
    )
    remaining_seconds: Annotated[
        int,
        strawberry.field(
            description="Remaining seconds before requesting another password reset token."
        ),
    ]


@strawberry.type(
    name="RequestEmailVerificationSuccess",
    description="Request email verification success.",
)
class RequestEmailVerificationTokenSuccessType:
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Email verification token requested.",
    )
    remaining_seconds: int = strawberry.field(
        description="Remaining seconds before requesting another email verification token."
    )


@strawberry.type(
    name="VerifyEmailSuccess",
    description="Verify email success.",
)
class VerifyEmailSuccessType:
    message: str = strawberry.field(
        description="Human readable success message.",
        default="Email successfully verified.",
    )


@strawberry.type(
    name="InvalidPasskeyRegistrationCredentialError",
    description="Used when an invalid passkey registration credential is provided.",
)
class InvalidPasskeyRegistrationCredentialErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid passkey registration credential provided.",
    )


@strawberry.type(
    name="InvalidPasskeyAuthenticationCredentialError",
    description="Used when an invalid passkey authentication credential is provided.",
)
class InvalidPasskeyAuthenticationCredentialErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Invalid passkey authentication credential provided.",
    )


@strawberry.type(
    name="WebAuthnChallengeNotFoundError",
    description="Used when the WebAuthn challenge is not found.",
)
class WebAuthnChallengeNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="WebAuthn challenge not found.",
    )


RequestEmailVerificationTokenPayload = Annotated[
    RequestEmailVerificationTokenSuccessType
    | EmailInUseErrorType
    | EmailVerificationTokenCooldownErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidEmailErrorType,
    strawberry.union(
        name="RequestEmailVerificationTokenPayload",
        description="The request email verification token payload.",
    ),
]

VerifyEmailPayload = Annotated[
    VerifyEmailSuccessType
    | InvalidRecaptchaTokenErrorType
    | InvalidEmailVerificationTokenErrorType
    | EmailInUseErrorType,
    strawberry.union(
        name="VerifyEmailPayload",
        description="The verify email payload.",
    ),
]

RegisterWithPasswordPayload = Annotated[
    AccountType
    | EmailInUseErrorType
    | InvalidEmailVerificationTokenErrorType
    | InvalidRecaptchaTokenErrorType
    | PasswordNotStrongErrorType,
    strawberry.union(
        name="RegisterWithPasswordPayload",
        description="The register with password payload.",
    ),
]

RegisterWithPasskeyPayload = Annotated[
    AccountType
    | EmailInUseErrorType
    | InvalidEmailVerificationTokenErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidPasskeyRegistrationCredentialErrorType,
    strawberry.union(
        name="RegisterWithPasskeyPayload",
        description="The register with passkey payload.",
    ),
]


LoginWithPasskeyPayload = Annotated[
    AccountType
    | InvalidPasskeyAuthenticationCredentialErrorType
    | InvalidRecaptchaTokenErrorType
    | WebAuthnChallengeNotFoundErrorType,
    strawberry.union(
        name="LoginWithPasskeyPayload",
        description="The login with passkey payload.",
    ),
]


@strawberry.type(
    name="LogoutPayload",
    description="The logout payload.",
)
class LogoutPayloadType:
    message: str = strawberry.field(
        description="Human readable success message.",
        default="Successfully logged out.",
    )


@strawberry.type(
    name="RequestPasswordResetSuccess",
    description="Request password reset success.",
)
class RequestPasswordResetSuccessType:
    message: str = strawberry.field(
        description="Human readable success message.",
        default="Password reset requested.",
    )


RequestPasswordResetPayload = Annotated[
    RequestPasswordResetSuccessType
    | InvalidRecaptchaTokenErrorType
    | PasswordResetTokenCooldownErrorType,
    strawberry.union(
        name="RequestPasswordResetPayload",
        description="The request password reset payload.",
    ),
]


PasswordResetTokenPayload = Annotated[
    PasswordResetTokenType | PasswordResetTokenNotFoundErrorType,
    strawberry.union(
        name="PasswordResetTokenPayload",
        description="The password reset token payload.",
    ),
]


@strawberry.type(
    name="GeneratePasskeyRegistrationOptionsSuccess",
    description="Generate passkey registration options success.",
)
class GeneratePasskeyRegistrationOptionsSuccessType:
    registration_options: JSON = strawberry.field(
        description="Passkey registration options.",
    )


GeneratePasskeyRegistrationOptionsPayload = Annotated[
    GeneratePasskeyRegistrationOptionsSuccessType
    | InvalidRecaptchaTokenErrorType
    | EmailInUseErrorType,
    strawberry.union(
        name="GeneratePasskeyRegistrationOptionsPayload",
        description="The generate passkey registration options payload.",
    ),
]


@strawberry.type(
    name="GenerateAuthenticationOptionsSuccess",
    description="Generate authentication options success.",
)
class GenerateAuthenticationOptionsSuccessType:
    authentication_options: JSON = strawberry.field(
        description="Passkey authentication options.",
    )


GenerateAuthenticationOptionsPayload = Annotated[
    GenerateAuthenticationOptionsSuccessType | InvalidRecaptchaTokenErrorType,
    strawberry.union(
        name="GenerateAuthenticationOptionsPayload",
        description="The generate authentication options payload.",
    ),
]


@strawberry.type(
    name="DeleteOtherSessionsPayload",
    description="The delete other sessions payload.",
)
class DeleteOtherSessionsPayloadType:
    deleted_session_ids: list[ID] = strawberry.field(
        description="Deleted session IDs.",
    )

    @classmethod
    def marshal(cls, session_ids: list[ObjectId]) -> Self:
        """Marshal into a node instance."""
        return cls(
            deleted_session_ids=[
                relay.to_base64(
                    SessionType,
                    session_id,
                )
                for session_id in session_ids
            ],
        )


@strawberry.type(
    name="SessionNotFoundError",
    description="Used when the session is not found.",
)
class SessionNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Session not found.",
    )


@strawberry.type(
    name="DeleteSessionSuccess",
    description="Delete session success.",
)
class DeleteSessionSuccessType:
    session_edge: SessionEdgeType = strawberry.field(
        description="The Deleted session edge.",
    )


DeleteSessionPayload = Annotated[
    DeleteSessionSuccessType | SessionNotFoundErrorType,
    strawberry.union(
        name="DeleteSessionPayload",
        description="The delete session payload.",
    ),
]


@strawberry.type(
    name="WebAuthnCredentialNotFoundError",
    description="Used when the webauthn credential is not found.",
)
class WebAuthnCredentialNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Webauthn credential not found.",
    )


@strawberry.type(
    name="DeleteWebAuthnCredentialSuccess",
    description="Delete webauthn credential success.",
)
class DeleteWebAuthnCredentialSuccessType:
    web_authn_credential_edge: WebAuthnCredentialEdgeType = strawberry.field(
        description="The Deleted webauthn credential edge.",
    )


@strawberry.type(
    name="InsufficientAuthProvidersError",
    description="Used when at least one authentication provider must be enabled.",
)
class InsufficientAuthProvidersErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="At least one authentication provider must be enabled.",
    )


DeleteWebAuthnCredentialPayload = Annotated[
    DeleteWebAuthnCredentialSuccessType
    | WebAuthnCredentialNotFoundErrorType
    | InsufficientAuthProvidersErrorType,
    strawberry.union(
        name="DeleteWebAuthnCredentialPayload",
        description="The delete webauthn credential payload.",
    ),
]


UpdateWebAuthnCredentialPayload = Annotated[
    WebAuthnCredentialType | WebAuthnCredentialNotFoundErrorType,
    strawberry.union(
        name="UpdateWebAuthnCredentialPayload",
        description="The update webauthn credential payload.",
    ),
]


@strawberry.type(
    name="GeneratePasskeyCreationOptionsSuccess",
    description="Generate passkey creation options success.",
)
class GeneratePasskeyCreationOptionsSuccessType:
    registration_options: JSON = strawberry.field(
        description="Passkey registration options for new passkey creation.",
    )


GeneratePasskeyCreationOptionsPayload = Annotated[
    GeneratePasskeyCreationOptionsSuccessType,
    strawberry.union(
        name="GeneratePasskeyCreationOptionsPayload",
        description="The generate passkey creation options payload.",
    ),
]


@strawberry.type(
    name="CreateWebAuthnCredentialSuccess",
    description="Create webauthn credential success.",
)
class CreateWebAuthnCredentialSuccessType:
    web_authn_credential_edge: WebAuthnCredentialEdgeType = strawberry.field(
        description="The created webauthn credential edge.",
    )


CreateWebAuthnCredentialPayload = Annotated[
    CreateWebAuthnCredentialSuccessType | InvalidPasskeyRegistrationCredentialErrorType,
    strawberry.union(
        name="CreateWebAuthnCredentialPayload",
        description="The create webauthn credential payload.",
    ),
]

RequestSudoModeWithPasskeyPayload = Annotated[
    AccountType
    | InvalidPasskeyAuthenticationCredentialErrorType
    | InvalidRecaptchaTokenErrorType
    | WebAuthnChallengeNotFoundErrorType,
    strawberry.union(
        name="RequestSudoModeWithPasskeyPayload",
        description="The request sudo mode with passkey payload.",
    ),
]


@strawberry.type(
    name="TwoFactorAuthenticationNotEnabledError",
    description="Used when 2FA is not enabled for the account.",
)
class TwoFactorAuthenticationNotEnabledErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Two-factor authentication is not enabled.",
    )


@strawberry.type(
    name="AuthenticatorNotEnabledError",
    description="Used when the authenticator 2FA method is not enabled.",
)
class AuthenticatorNotEnabledErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Authenticator 2FA method is not enabled.",
    )


@strawberry.type(
    name="TwoFactorAuthenticationChallengeNotFoundError",
    description="Used when the 2FA challenge is not found.",
)
class TwoFactorAuthenticationChallengeNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Two-factor authentication challenge not found.",
    )


@strawberry.type(
    name="TwoFactorAuthenticationRequiredError",
    description="Used when 2FA is required.",
)
class TwoFactorAuthenticationRequiredErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Two-factor authentication is required.",
    )


@strawberry.type(
    name="EnableAccount2FAWithAuthenticatorSuccess",
    description="Enable account 2FA with authenticator success.",
)
class EnableAccount2FAWithAuthenticatorSuccessType:
    account: AccountType = strawberry.field(
        description="The account with 2FA enabled.",
    )
    recovery_codes: list[str] = strawberry.field(
        description="The recovery codes for the account.",
    )


EnableAccount2FAWithAuthenticatorPayload = Annotated[
    EnableAccount2FAWithAuthenticatorSuccessType
    | InvalidCredentialsErrorType
    | TwoFactorAuthenticationChallengeNotFoundErrorType,
    strawberry.union(
        name="SetAccount2FAPayload",
        description="The enable account 2FA with authenticator payload.",
    ),
]

DisableAccount2FAWithAuthenticatorPayload = Annotated[
    AccountType | AuthenticatorNotEnabledErrorType,
    strawberry.union(
        name="DisableAccount2FAWithAuthenticatorPayload",
        description="The disable account 2FA payload.",
    ),
]


@strawberry.type(
    name="GenerateAuthenticator2FAChallengeSuccess",
    description="Generate account 2FA Challenge success.",
)
class GenerateAuthenticator2FAChallengeSuccessType:
    otp_uri: str = strawberry.field(
        description="The generated 2FA OTP URI.",
    )
    secret: str = strawberry.field(
        description="The generated 2FA secret.",
    )


GenerateAuthenticator2FAChallengePayload = Annotated[
    GenerateAuthenticator2FAChallengeSuccessType,
    strawberry.union(
        name="GenerateAuthenticator2FAChallengePayload",
        description="The generate authenticator 2FA challenge payload.",
    ),
]


@strawberry.type(
    name="Generate2FARecoveryCodesSuccess",
    description="Generate 2FA recovery codes success.",
)
class Generate2FARecoveryCodesSuccessType:
    recovery_codes: list[str] = strawberry.field(
        description="The generated 2FA recovery codes.",
    )


Generate2FARecoveryCodesPayload = Annotated[
    Generate2FARecoveryCodesSuccessType | TwoFactorAuthenticationNotEnabledErrorType,
    strawberry.union(
        name="Generate2FARecoveryCodesPayload",
        description="The generate 2FA recovery codes payload.",
    ),
]

Verify2FAWithAuthenticatorPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | AuthenticatorNotEnabledErrorType
    | TwoFactorAuthenticationChallengeNotFoundErrorType
    | InvalidRecaptchaTokenErrorType,
    strawberry.union(
        name="Verify2FAWithAuthenticatorPayload",
        description="The verify 2FA with authenticator payload.",
    ),
]

Verify2FAWithRecoveryCodePayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | TwoFactorAuthenticationNotEnabledErrorType
    | TwoFactorAuthenticationChallengeNotFoundErrorType
    | InvalidRecaptchaTokenErrorType,
    strawberry.union(
        name="Verify2FAWithRecoveryCodePayload",
        description="The verify 2FA with recovery code payload.",
    ),
]

LoginWithPasswordPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidAuthenticationProviderErrorType
    | TwoFactorAuthenticationRequiredErrorType,
    strawberry.union(
        name="LoginWithPasswordPayload",
        description="The login with password payload.",
    ),
]


Verify2FAPasswordResetWithAuthenticatorPayload = Annotated[
    PasswordResetTokenType
    | InvalidCredentialsErrorType
    | AuthenticatorNotEnabledErrorType
    | InvalidPasswordResetTokenErrorType
    | InvalidRecaptchaTokenErrorType,
    strawberry.union(
        name="Verify2FAPasswordResetWithAuthenticatorPayload",
        description="The verify 2FA password reset with authenticator payload.",
    ),
]

Verify2FAPasswordResetWithPasskeyPayload = Annotated[
    PasswordResetTokenType
    | InvalidPasskeyAuthenticationCredentialErrorType
    | TwoFactorAuthenticationNotEnabledErrorType
    | InvalidPasswordResetTokenErrorType
    | InvalidRecaptchaTokenErrorType
    | WebAuthnChallengeNotFoundErrorType,
    strawberry.union(
        name="Verify2FAPasswordResetWithPasskeyPayload",
        description="The verify 2FA password reset with passkey payload.",
    ),
]


ResetPasswordPayload = Annotated[
    AccountType
    | InvalidPasswordResetTokenErrorType
    | PasswordNotStrongErrorType
    | TwoFactorAuthenticationChallengeNotFoundErrorType,
    strawberry.union(
        name="ResetPasswordPayload",
        description="The reset password payload.",
    ),
]

UpdatePasswordPayload = Annotated[
    AccountType | PasswordNotStrongErrorType,
    strawberry.union(
        name="UpdatePasswordPayload",
        description="The update password payload.",
    ),
]

DeletePasswordPayload = Annotated[
    AccountType | InsufficientAuthProvidersErrorType,
    strawberry.union(
        name="DeletePasswordPayload",
        description="The delete password payload.",
    ),
]


RequestSudoModeWithAuthenticatorPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | InvalidRecaptchaTokenErrorType
    | AuthenticatorNotEnabledErrorType,
    strawberry.union(
        name="RequestSudoModeWithAuthenticatorPayload",
        description="The request sudo mode with authenticator app payload.",
    ),
]

RequestSudoModeWithPasswordPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidAuthenticationProviderErrorType
    | TwoFactorAuthenticationRequiredErrorType,
    strawberry.union(
        name="RequestSudoModeWithPasswordPayload",
        description="The request sudo mode with password payload.",
    ),
]
