from enum import StrEnum
from functools import lru_cache
from typing import TYPE_CHECKING, Annotated, TypeVar

from pydantic import Field, UrlConstraints
from pydantic_core import MultiHostUrl
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


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

    openapi_url: str | None = None

    root_path: str = ""

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


TSettings = TypeVar("TSettings", bound=BaseSettings)


def get_settings(cls: type[TSettings]) -> TSettings:
    return cls()


if not TYPE_CHECKING:  # pragma: no cover
    get_settings = lru_cache(get_settings)
