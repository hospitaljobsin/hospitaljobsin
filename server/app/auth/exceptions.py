class EmailInUseError:
    """Raised when an user with an email address already exists."""

    pass


class InvalidCredentialsError:
    """Raised when an user provides invalid credentials."""

    pass


class InvalidPasswordResetTokenError:
    """Raised when an invalid password reset token is provided."""

    pass
