import json
import os
from collections.abc import Mapping
from enum import StrEnum
from functools import lru_cache
from http import HTTPStatus
from pathlib import Path
from typing import TYPE_CHECKING, Annotated, Literal, TypeVar

import httpx
from pydantic import Field, SecretStr, UrlConstraints
from pydantic_core import MultiHostUrl
from pydantic_settings import (
    BaseSettings,
    EnvSettingsSource,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
)
from tenacity import retry, retry_if_result


class AWSSecretsManagerExtensionSettingsSource(EnvSettingsSource):
    _secret_id: str

    def __init__(
        self,
        settings_cls: type[BaseSettings],
        secret_id: str,
        env_prefix: str | None = None,
        env_parse_none_str: str | None = None,
        env_parse_enums: bool | None = None,
    ) -> None:
        self._secret_id = secret_id
        super().__init__(
            settings_cls,
            case_sensitive=True,
            env_prefix=env_prefix,
            env_nested_delimiter="--",
            env_ignore_empty=False,
            env_parse_none_str=env_parse_none_str,
            env_parse_enums=env_parse_enums,
        )

    @retry(
        retry=retry_if_result(
            lambda response: response.status_code != HTTPStatus.OK,
        )
    )
    def _fetch_secret_payload(self):
        port = os.environ.get("PARAMETERS_SECRETS_EXTENSION_HTTP_PORT", 2773)
        url = f"http://localhost:{port}/secretsmanager/get?secretId={self._secret_id}"
        headers = {"X-Aws-Parameters-Secrets-Token": os.getenv("AWS_SESSION_TOKEN", "")}
        with httpx.Client() as client:
            response = client.get(url, headers=headers)
        return response

    def _load_env_vars(self) -> Mapping[str, str | None]:
        response = self._fetch_secret_payload()

        payload = response.json()

        if "SecretString" not in payload:
            raise Exception("SecretString missing in extension response")

        return json.loads(payload["SecretString"])


class Environment(StrEnum):
    development = "development"
    testing = "testing"
    production = "production"


MongoSRVDsn = Annotated[
    MultiHostUrl, UrlConstraints(allowed_schemes=["mongodb+srv", "mongodb"])
]


class AppSettings(BaseSettings):
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
    ]

    cors_allow_origin_regex: str | None = None

    openapi_url: str | None = None

    root_path: str = ""

    # accounts config
    accounts_base_url: str = "http://localtest.me:5002"

    # recruiter portal config
    recruiter_portal_base_url: str = "http://localtest.me:5001"

    # seeker portal config
    seeker_portal_base_url: str = "http://localtest.me:5000"

    # persisted queries config
    persisted_queries_path: Path = Path("query_map.json")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
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


class DatabaseSettings(BaseSettings):
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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )


class SentrySettings(BaseSettings):
    # sentry dsn
    sentry_dsn: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )


class SecretSettings(BaseSettings):
    google_api_key: SecretStr

    captcha_secret_key: SecretStr

    jwe_secret_key: SecretStr

    # Oauth2 config
    google_client_id: str

    google_client_secret: SecretStr

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        sources = [init_settings, env_settings, dotenv_settings, file_secret_settings]
        aws_secret_id = os.environ.get("AWS_SECRETS_MANAGER_SECRET_ID")

        if aws_secret_id is not None:
            sources.append(
                AWSSecretsManagerExtensionSettingsSource(
                    settings_cls,
                    secret_id=aws_secret_id,
                )
            )
        return tuple(sources)


class EmailSettings(BaseSettings):
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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )

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
        return values


class AWSSettings(BaseSettings):
    # AWS Config

    s3_bucket_name: str

    aws_endpoint_url: str | None = None

    aws_secret_access_key: SecretStr | None = None

    aws_access_key_id: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )


class AuthSettings(BaseSettings):
    session_user_cookie_name: str = "user_session"

    session_cookie_domain: str | None = None
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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )


class GeocoderSettings(BaseSettings):
    # geocoder config
    geocoding_provider: Literal["nominatim", "aws_location"] = "nominatim"

    single_use_location_place_index_name: str | None = None

    storage_location_place_index_name: str | None = None

    geocoder_domain: str | None = None

    geocoder_user_agent: str | None = None

    geocoder_scheme: str = "http"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="server_",
        extra="allow",
    )

    @classmethod
    def model_validate(cls, values):
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
            if not values.get("single_use_location_place_index_name"):
                raise ValueError(
                    "single_use_location_place_index_name is required when geocoding_provider is aws_location"
                )
            if not values.get("storage_location_place_index_name"):
                raise ValueError(
                    "storage_location_place_index_name is required when geocoding_provider is aws_location"
                )
        return values


TSettings = TypeVar("TSettings", bound=BaseSettings)


def get_settings(cls: type[TSettings]) -> TSettings:
    return cls()


if not TYPE_CHECKING:  # pragma: no cover
    get_settings = lru_cache(get_settings)
