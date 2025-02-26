from typing import Annotated, Self

import strawberry
from strawberry.scalars import JSON

from app.accounts.types import AccountType
from app.auth.documents import PasswordResetToken
from app.base.types import BaseErrorType, BaseNodeType


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

LoginPayload = Annotated[
    AccountType
    | InvalidCredentialsErrorType
    | InvalidRecaptchaTokenErrorType
    | InvalidSignInMethodErrorType,
    strawberry.union(name="LoginPayload"),
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
