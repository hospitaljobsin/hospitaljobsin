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

    session_user_cookie_name: str = "user_session"

    session_cookie_domain: str | None = None

    # RSA keys config
    # TODO: replace("\\n", "\n") here
    rsa_private_key: str

    rsa_public_key: str

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

    # Recaptcha config
    recaptcha_secret_key: SecretStr

    # AWS Config

    s3_avatar_bucket_name: str

    # accounts config
    accounts_base_url: str = "http://localhost:5002"

    # webauthn config

    rp_id: Annotated[
        str,
        Field(
            examples=[
                "example.com",
            ],
        ),
    ]

    rp_name: Annotated[
        str,
        Field(
            examples=[
                "Example Inc.",
            ],
        ),
    ]

    rp_expected_origin: Annotated[
        str,
        Field(
            examples=[
                "",
            ],
        ),
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        secrets_dir="./secrets",
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
