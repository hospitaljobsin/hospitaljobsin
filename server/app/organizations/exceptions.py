class OrganizationSlugInUseError:
    """Raised when an organization slug is already in use."""


class MemberAlreadyExistsError:
    """Raised when a member already exists in the organization."""


class OrganizationInviteNotFoundError:
    """Raised when an organization invite is not found."""


class OrganizationMemberNotFoundError:
    """Raised when an organization member is not found."""


class InsufficientOrganizationAdminsError:
    """Raised when there are not enough organization admins to remove an admin."""


class OrganizationAuthorizationError:
    """Raised when an organization authorization fails (insufficient role privileges)."""
