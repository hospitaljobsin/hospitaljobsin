import pytest
from app.config import AuthSettings, DatabaseSettings, SecretSettings, get_settings


@pytest.fixture(scope="session")
def db_settings() -> DatabaseSettings:
    return get_settings(DatabaseSettings)


@pytest.fixture(scope="session")
def auth_settings() -> AuthSettings:
    return get_settings(AuthSettings)


@pytest.fixture(scope="session")
async def secret_settings() -> SecretSettings:
    return get_settings(SecretSettings)
