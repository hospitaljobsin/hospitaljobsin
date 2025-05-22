from pydantic import BaseModel


class CreateTestUserSchema(BaseModel):
    username: str
    password: str | None = None
    email: str
    two_factor_secret: str | None = None
    enable_sudo_mode: bool = True


class WebAuthnCredentialSchema(BaseModel):
    credential_id: bytes
    public_key: bytes
    sign_count: int
    device_type: str
    backed_up: bool
    nickname: str = "My Passkey"
    transports: list[str] | None = None
    last_used_at: str


class TestUserSchema(BaseModel):
    id: str
    username: str
    email: str
    is_active: bool = True
    two_factor_secret: str | None = None
    created_at: str
    updated_at: str | None = None
    profile: dict | None = None
    webauthn_credentials: list[WebAuthnCredentialSchema] = []
    recovery_codes: list[str] = []
    auth_providers: list[str] = []
    has_2fa_enabled: bool = False
    two_factor_providers: list[str] = []
