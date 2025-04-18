from enum import StrEnum
from typing import Annotated, Literal

from pydantic import Field, SecretStr, UrlConstraints
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(StrEnum):
    development = "development"
    testing = "testing"
    production = "production"


MongoSRVDsn = Annotated[MultiHostUrl, UrlConstraints(allowed_schemes=["mongodb+srv"])]


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
        MongoSRVDsn,
        Field(
            examples=[
                "mongodb://localhost:27017/medical-jobs",
            ],
        ),
    ]

    default_database_name: str = "medicaljobs"

    # session cookies config

    session_user_cookie_name: str = "user_session"

    session_cookie_domain: str | None = None

    jwe_secret_key: SecretStr

    # Oauth2 config
    google_client_id: str

    google_client_secret: str

    openapi_url: str | None = None

    root_path: str = ""

    # email config

    email_provider: Literal["smtp", "aws_ses"] = "smtp"

    email_port: Annotated[
        int | None,
        Field(
            examples=[
                587,
            ],
        ),
    ] = 587

    email_host: Annotated[
        str | None,
        Field(
            examples=[
                "localhost",
            ],
        ),
    ] = None

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

    # Recaptcha config
    recaptcha_secret_key: SecretStr

    # AWS Config

    s3_bucket_name: str

    aws_endpoint_url: str | None = None

    aws_secret_access_key: SecretStr | None = None

    aws_access_key_id: str | None = None

    # accounts config
    accounts_base_url: str = "http://localhost:5002"

    # recruiter portal config
    recruiter_portal_base_url: str = "http://localhost:5001"

    # seeker portal config
    seeker_portal_base_url: str = "http://localhost:5000"

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

    # tokens cooldown config
    email_verification_token_cooldown: int = 60 * 3

    password_reset_token_cooldown: int = 60 * 3

    # geocoder config
    geocoding_provider: Literal["nominatim", "aws_location"] = "nominatim"

    location_place_index_name: str | None = None

    geocoder_domain: str | None = None

    geocoder_user_agent: str | None = None

    geocoder_scheme: str = "http"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
    )

    def _is_environment(self, environment: Environment) -> bool:
        """Check whether the current environment is the given environment."""
        return self.environment == environment

    @property
    def is_development(self) -> bool:
        """Check whether the current environment is development."""
        return self._is_environment(Environment.development)

    @property
    def is_testing(self) -> bool:
        """Check whether the current environment is testing."""
        return self._is_environment(Environment.testing)

    @property
    def is_production(self) -> bool:
        """Check whether the current environment is production."""
        return self._is_environment(Environment.production)

    @classmethod
    def model_validate(cls, values):
        # Pydantic v2+ custom validation
        email_provider = values.get("email_provider")
        environment = values.get("environment")
        email_port = values.get("email_port")
        email_host = values.get("email_host")
        email_username = values.get("email_username")
        email_password = values.get("email_password")

        if email_provider == "smtp":
            if email_port is None:
                raise ValueError("email_port is required when email_provider is smtp")
            if email_host is None:
                raise ValueError("email_host is required when email_provider is smtp")
            if environment == "production":
                if email_username is None:
                    raise ValueError(
                        "email_username is required when email_provider is smtp and environment is production"
                    )
                if email_password is None:
                    raise ValueError(
                        "email_password is required when email_provider is smtp and environment is production"
                    )
        elif email_provider == "aws_ses":
            if email_port is not None:
                raise ValueError("email_port must be None when email_provider is ses")
            if email_host is not None:
                raise ValueError("email_host must be None when email_provider is ses")
            if email_username is not None:
                raise ValueError(
                    "email_username must be None when email_provider is ses"
                )
            if email_password is not None:
                raise ValueError(
                    "email_password must be None when email_provider is ses"
                )

        geocoding_provider = values.get("geocoding_provider")
        if geocoding_provider == "nominatim":
            if not values.get("geocoder_domain"):
                raise ValueError(
                    "geocoder_domain is required when geocoding_provider is nominatim"
                )
            if not values.get("geocoder_user_agent"):
                raise ValueError(
                    "geocoder_user_agent is required when geocoding_provider is nominatim"
                )
        elif geocoding_provider == "aws_location":
            if not values.get("location_place_index_name"):
                raise ValueError(
                    "location_place_index_name is required when geocoding_provider is aws_location"
                )
        return values
