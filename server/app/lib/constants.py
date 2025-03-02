# branding

from typing import Literal

from authlib.integrations.flask_client import OAuth

SUPPORT_EMAIL = "support@example.com"

APP_NAME = "PulseWork"

# pagination

MAX_PAGINATION_LIMIT = 100

# user sessions

USER_SESSION_EXPIRES_IN = 60 * 60 * 24 * 30  # 30 days


# Email verification
EMAIL_VERIFICATION_EXPIRES_IN = 60 * 60 * 1  # 1 hour

EMAIL_VERIFICATION_TOKEN_COOLDOWN = 60 * 3  # 3 minutes

EMAIL_VERIFICATION_TOKEN_LENGTH = 6


# Password reset
PASSWORD_RESET_EXPIRES_IN = 60 * 60 * 1  # 1 hour

# WebAuthn challenge
WEBAUTHN_CHALLENGE_EXPIRES_IN = 60 * 5  # 5 minutes


# Sudo Mode (elevated privileges)
SUDO_MODE_EXPIRES_IN = 60 * 15  # 15 minutes


# Auth Providers
AuthProvider = Literal["password", "webauthn_credential", "oauth_google"]

OAuthProvider = Literal["google"]
