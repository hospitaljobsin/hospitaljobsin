import json
from typing import Any

from app.config import SecretSettings
from jose import jwe


def encrypt_session_data(
    secret_settings: SecretSettings, session_data: dict[str, Any]
) -> bytes:
    """Encrypt session data as JWE string."""
    secret_key = secret_settings.jwe_secret_key.get_secret_value()
    return jwe.encrypt(
        json.dumps(session_data),
        key=secret_key,
        algorithm="dir",
    )
