from enum import StrEnum
from typing import Annotated

from pydantic import Field, MongoDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(StrEnum):
    development = "development"
    testing = "testing"
    production = "production"


class Settings(BaseSettings):
    debug: bool

    environment: Environment = Environment.development

    secret_key: str

    host: Annotated[
        str,
        Field(
            examples=[
                "127.0.0.1",
            ],
        ),
    ] = "127.0.0.1"

    port: Annotated[
        int,
        Field(
            examples=[
                8000,
            ],
        ),
    ] = 8000

    log_level: Annotated[
        str,
        Field(
            examples=[
                "INFO",
                "NOTSET",
                "DEBUG",
            ],
        ),
    ] = "DEBUG"

    cors_allow_origins: Annotated[
        list[str],
        Field(
            examples=[
                {
                    "example.com",
                },
            ],
        ),
    ] = ["*"]

    # database config

    database_url: Annotated[
        MongoDsn,
        Field(
            examples=[
                "mongodb://localhost:27017/medical-jobs",
            ],
        ),
    ]

    # session cookies config
    user_session_cookie_name: str = "user_session"

    session_cookie_domain: str | None = None

    # Oauth2 config
    google_client_id: str

    google_client_secret: str

    openapi_url: str | None = None

    root_path: str = ""

    # email config

    email_port: Annotated[
        int,
        Field(
            examples=[
                587,
            ],
        ),
    ] = 587

    email_host: Annotated[
        str,
        Field(
            examples=[
                "localhost",
            ],
        ),
    ]

    email_username: str | None = None

    email_password: SecretStr | None = None

    email_from: Annotated[
        str,
        Field(
            examples=[
                "aryaniyaps@example.com",
            ],
        ),
    ]

    # app config

    app_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
    )

    def _is_environment(self, environment: Environment) -> bool:
        """Check whether the current environment is the given environment."""
        return self.environment == environment

    def is_development(self) -> bool:
        """Check whether the current environment is development."""
        return self._is_environment(Environment.development)

    def is_testing(self) -> bool:
        """Check whether the current environment is testing."""
        return self._is_environment(Environment.testing)

    def is_production(self) -> bool:
        """Check whether the current environment is production."""
        return self._is_environment(Environment.production)


settings = Settings()  # type: ignore[call-arg]
