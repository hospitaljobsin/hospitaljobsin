class EmailInUseError:
    """Raised when an user with an email address already exists."""

    pass


class InvalidCredentialsError:
    """Raised when an user provides invalid credentials."""

    pass


class InvalidPasswordResetTokenError:
    """Raised when an invalid password reset token is provided."""

    pass


class EmailVerificationTokenCooldownError:
    """Raised when an user tries to request a new email verification token too soon."""

    pass


class InvalidEmailVerificationTokenError:
    """Raised when an invalid email verification token is provided."""

    pass


class InvalidRecaptchaTokenError:
    """Raised when an invalid recaptcha token is provided."""

    pass
