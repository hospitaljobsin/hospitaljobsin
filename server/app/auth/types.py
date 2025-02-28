from ast import Delete
from datetime import datetime
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import Private, relay
from strawberry.scalars import JSON

from app.accounts.types import AccountType
from app.auth.documents import PasswordResetToken, Session
from app.auth.repositories import SessionRepo
from app.base.types import BaseConnectionType, BaseEdgeType, BaseErrorType, BaseNodeType
from app.context import AuthInfo
from app.scalars import ID


@strawberry.type(name="EmailInUseError")
class EmailInUseErrorType(BaseErrorType):
    message: str = "Email address is already in use."


@strawberry.type(name="InvalidEmailError")
class InvalidEmailErrorType(BaseErrorType):
    message: str = "Invalid email address provided."


@strawberry.type(name="InvalidCredentialsError")
class InvalidCredentialsErrorType(BaseErrorType):
    message: str = "Invalid credentials provided."


@strawberry.type(name="InvalidPasswordResetTokenError")
class InvalidPasswordResetTokenErrorType(BaseErrorType):
    message: str = "Invalid password reset token provided."


@strawberry.type(name="InvalidEmailVerificationTokenError")
class InvalidEmailVerificationTokenErrorType(BaseErrorType):
    message: str = "Invalid email verification token provided."


@strawberry.type(name="InvalidRecaptchaTokenError")
class InvalidRecaptchaTokenErrorType(BaseErrorType):
    message: str = "Invalid recaptcha token provided."


@strawberry.type(name="InvalidSignInMethodError")
class InvalidSignInMethodErrorType(BaseErrorType):
    message: str = "User's password is not set."


@strawberry.type(name="PasswordResetToken")
class PasswordResetTokenType(BaseNodeType[PasswordResetToken]):
    email: str

    @classmethod
    def marshal(cls, reset_token: PasswordResetToken) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(reset_token.id),
            email=reset_token.account.email,
        )


@strawberry.type(name="Session")
class SessionType(BaseNodeType[Session]):
    user_agent: str
    ip_address: str
    created_at: datetime

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

    @strawberry.field
    @inject
    def is_current_session(
        self, info: AuthInfo, session_repo: Annotated[SessionRepo, Inject]
    ) -> bool:
        """Return whether the session is the current session."""
        return self.token_hash == session_repo.hash_session_token(
            info.context["session_token"]
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
    node_type = SessionType
    edge_type = SessionEdgeType


@strawberry.type(name="PasswordResetTokenNotFoundError")
class PasswordResetTokenNotFoundErrorType(BaseErrorType):
    message: str = "Password reset token not found."


@strawberry.type(name="PasswordNotStrongError")
class PasswordNotStrongErrorType(BaseErrorType):
    message: str = "Password is not strong enough."


@strawberry.type(name="EmailVerificationTokenCooldownError")
class EmailVerificationTokenCooldownErrorType(BaseErrorType):
    message: str = "Please wait before requesting a new email verification token."
    remaining_seconds: Annotated[
        int,
        strawberry.field(
            description="Remaining seconds before requesting another email verification token."
        ),
    ]


@strawberry.type(name="RequestEmailVerificationSuccess")
class RequestEmailVerificationTokenSuccessType:
    message: str = "Email verification token requested."
    remaining_seconds: Annotated[
        int,
        strawberry.field(
            description="Remaining seconds before requesting another email verification token."
        ),
    ]


@strawberry.type(name="VerifyEmailSuccess")
class VerifyEmailSuccessType:
    message: str = "Email successfully verified."


@strawberry.type(name="InvalidPasskeyRegistrationCredentialError")
class InvalidPasskeyRegistrationCredentialErrorType(BaseErrorType):
    message: str = "Invalid passkey registration credential provided."


@strawberry.type(name="InvalidPasskeyAuthenticationCredentialError")
class InvalidPasskeyAuthenticationCredentialErrorType(BaseErrorType):
    message: str = "Invalid passkey authentication credential provided."


@strawberry.type(name="WebAuthnChallengeNotFoundError")
class WebAuthnChallengeNotFoundErrorType(BaseErrorType):
    message: str = "WebAuthn challenge not found."


RequestEmailVerificationTokenPayload = Annotated[
    RequestEmailVerificationTokenSuccessType
    | EmailInUseErrorType
    | EmailVerificationTokenCooldownErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidEmailErrorType,
    strawberry.union(name="RequestEmailVerificationTokenPayload"),
]

VerifyEmailPayload = Annotated[
    VerifyEmailSuccessType
    | InvalidRecaptchaTokenErrorType
    | InvalidEmailVerificationTokenErrorType
    | EmailInUseErrorType,
    strawberry.union(name="VerifyEmailPayload"),
]

RegisterWithPasswordPayload = Annotated[
    AccountType
    | EmailInUseErrorType
    | InvalidEmailVerificationTokenErrorType
    | InvalidRecaptchaTokenErrorType
    | PasswordNotStrongErrorType,
    strawberry.union(name="RegisterWithPasswordPayload"),
]

RegisterWithPasskeyPayload = Annotated[
    AccountType
    | EmailInUseErrorType
    | InvalidEmailVerificationTokenErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidPasskeyRegistrationCredentialErrorType,
    strawberry.union(name="RegisterWithPasskeyPayload"),
]

LoginWithPasswordPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidSignInMethodErrorType,
    strawberry.union(name="LoginWithPasswordPayload"),
]

LoginWithPasskeyPayload = Annotated[
    AccountType
    | InvalidPasskeyAuthenticationCredentialErrorType
    | InvalidRecaptchaTokenErrorType
    | WebAuthnChallengeNotFoundErrorType,
    strawberry.union(name="LoginWithPasskeyPayload"),
]


@strawberry.type(name="LogoutPayload")
class LogoutPayloadType:
    message: str = "Successfully logged out."


@strawberry.type(name="RequestPasswordResetSuccess")
class RequestPasswordResetSuccessType:
    message: str = "Password reset requested."


RequestPasswordResetPayload = Annotated[
    RequestPasswordResetSuccessType | InvalidRecaptchaTokenErrorType,
    strawberry.union(name="RequestPasswordResetPayload"),
]

ResetPasswordPayload = Annotated[
    AccountType | InvalidPasswordResetTokenErrorType | PasswordNotStrongErrorType,
    strawberry.union(name="ResetPasswordPayload"),
]

PasswordResetTokenPayload = Annotated[
    PasswordResetTokenType | PasswordResetTokenNotFoundErrorType,
    strawberry.union(name="PasswordResetTokenPayload"),
]


@strawberry.type(name="GeneratePasskeyRegistrationOptionsSuccess")
class GeneratePasskeyRegistrationOptionsSuccessType:
    registration_options: JSON


GeneratePasskeyRegistrationOptionsPayload = Annotated[
    GeneratePasskeyRegistrationOptionsSuccessType
    | InvalidRecaptchaTokenErrorType
    | EmailInUseErrorType,
    strawberry.union(name="GeneratePasskeyRegistrationOptionsPayload"),
]


@strawberry.type(name="GenerateAuthenticationOptionsSuccess")
class GenerateAuthenticationOptionsSuccessType:
    authentication_options: JSON


GenerateAuthenticationOptionsPayload = Annotated[
    GenerateAuthenticationOptionsSuccessType | InvalidRecaptchaTokenErrorType,
    strawberry.union(name="GenerateAuthenticationOptionsPayload"),
]


@strawberry.type(name="DeleteOtherSessionsPayload")
class DeleteOtherSessionsPayloadType:
    deleted_session_ids: list[ID]

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


@strawberry.type(name="SessionNotFoundError")
class SessionNotFoundErrorType(BaseErrorType):
    message: str = "Session not found."


@strawberry.type(name="DeleteSessionSuccess")
class DeleteSessionSuccessType:
    session_edge: SessionEdgeType


DeleteSessionPayload = Annotated[
    DeleteSessionSuccessType | SessionNotFoundErrorType,
    strawberry.union(name="DeleteSessionPayload"),
]
