# branding

from typing import Literal

SUPPORT_EMAIL = "support@hospitaljobs.in"

APP_NAME = "Hospital Jobs"

# pagination

MAX_PAGINATION_LIMIT = 100

DEFAULT_PAGINATION_LIMIT = 10

# user sessions

USER_SESSION_EXPIRES_IN = 60 * 60 * 24 * 30  # 30 days


# Email verification
EMAIL_VERIFICATION_EXPIRES_IN = 60 * 60 * 1  # 1 hour

EMAIL_VERIFICATION_TOKEN_LENGTH = 6

# Organization invites
ORGANIZATION_INVITE_EXPIRES_IN = 60 * 60 * 24 * 7  # 7 days


# Password reset
PASSWORD_RESET_EXPIRES_IN = 60 * 60 * 1  # 1 hour

# WebAuthn challenge
WEBAUTHN_CHALLENGE_EXPIRES_IN = 60 * 5  # 5 minutes


# Sudo Mode (elevated privileges)
SUDO_MODE_EXPIRES_IN = 60 * 15  # 15 minutes

# Two-factor authentication
TWO_FACTOR_AUTHENTICATION_CHALLENGE_EXPIRES_IN = 60 * 5  # 5 minutes

# session tokens
SESSION_TOKEN_KEY = "session_token"  # noqa: S105


# Auth Providers
AuthProvider = Literal["password", "webauthn_credential", "oauth_google"]

OAuthProvider = Literal["google"]

TwoFactorProvider = Literal["authenticator",]


# Job Applications
JobApplicantStatus = Literal[
    "applied", "shortlisted", "interviewed", "onhold", "offered"
]


# Job metrics
CoreJobMetricEventType = Literal["impression", "save", "unsave", "apply"]

ImpressionJobMetricEventType = Literal["view_start", "view_end"]

# Organization names
# (subdomains which are in use/ might be needed in the future)
RESERVED_ORGANIZATION_NAMES = [
    "www",
    "api",
    "recruiter",
    "seeker",
    "settings",
    "accounts",
    "legal",
]


# Embeddings
# Gemini text-embedding-004
# https://ai.google.dev/gemini-api/docs/models#text-embedding
JOB_EMBEDDING_DIMENSIONS = 3072

RELATED_JOBS_SIMILARITY_THRESHOLD = 0.92

JOB_APPLICANT_EMBEDDING_DIMENSIONS = 3072

RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD = 0.7
