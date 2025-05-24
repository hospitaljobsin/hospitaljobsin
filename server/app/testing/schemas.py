from datetime import datetime

from pydantic import Base64Bytes, BaseModel, ConfigDict
from webauthn.helpers.structs import AuthenticatorTransport

from app.core.constants import AuthProvider, TwoFactorProvider


def _snake_to_camel(name: str) -> str:
    """Convert the given name from snake case to camel case."""
    first, *rest = name.split("_")
    return first + "".join(map(str.capitalize, rest))


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        alias_generator=_snake_to_camel,
        ser_json_bytes="base64",
    )


class CreateTestUserSchema(BaseSchema):
    password: str | None = None
    full_name: str
    email: str
    two_factor_secret: str | None = None
    enable_sudo_mode: bool = True
    auth_providers: list[AuthProvider]


class WebAuthnCredentialSchema(BaseSchema):
    credential_id: Base64Bytes
    public_key: bytes
    sign_count: int
    device_type: str
    backed_up: bool
    nickname: str = "My Passkey"
    transports: list[AuthenticatorTransport] | None = None
    last_used_at: datetime


class TestUserSchema(BaseSchema):
    id: str
    email: str
    full_name: str
    two_factor_secret: str | None
    created_at: datetime
    updated_at: datetime | None
    webauthn_credentials: list[WebAuthnCredentialSchema]
    recovery_codes: list[str]
    auth_providers: list[AuthProvider]
    has_2fa_enabled: bool
    two_factor_providers: list[TwoFactorProvider]
