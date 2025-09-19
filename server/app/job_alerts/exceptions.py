class JobAlertAlreadyExistsError:
    """Raised when a job alert with the same parameters already exists for the user."""


class JobAlertNotFoundError:
    """Raised when a job alert is not found."""


class MaxJobAlertsReachedError:
    """Raised when the maximum number of job alerts for an account is reached."""
