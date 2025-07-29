class AccountNotFoundError:
    """Raised when an account is not found."""


class AccountProfileIncompleteError(Exception):
    """Raised when an account profile is incomplete."""


class InvalidPhoneNumberError:
    """Raised when an invalid phone number is provided."""


class InvalidPhoneNumberVerificationTokenError:
    """Raised when an invalid phone number verification token is provided."""


class PhoneNumberAlreadyExistsError:
    """Raised when the phone number provided already exists."""


class PhoneNumberDoesNotExistError:
    """Raised when the phone number doesn't exist on an account."""


class PhoneNumberVerificationTokenCooldownError:
    """Raised when a phone number verification token hasn't cooled down."""

    remaining_seconds: int

    def __init__(self, remaining_seconds: int) -> None:
        self.remaining_seconds = remaining_seconds
