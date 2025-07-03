class JobNotFoundError:
    """Raised when a job is not found."""


class SavedJobNotFoundError:
    """Raised when a saved job is not found."""


class CompanyNotFoundError:
    """Raised when a company is not found."""


class OrganizationNotFoundError:
    """Raised when an organization is not found."""


class JobApplicationFormNotFoundError:
    """Raised when a job application form is not found."""


class JobNotPublishedError:
    """Raised when a job is not published."""


class JobApplicantAlreadyExistsError:
    """Raised when a job applicant already exists."""


class JobIsExternalError:
    """Raised when a job is external."""


class AccountProfileNotFoundError:
    """Raised when an account profile is not found."""


class JobApplicantsNotFoundError:
    """Raised when one or more job applicants were not found."""

    def __init__(self, not_found_ids: list[str]) -> None:
        self.not_found_ids = not_found_ids


class InsufficientActiveVacanciesError:
    """Raised when a job has insufficient active vacancies."""
