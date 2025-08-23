from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import sentry_sdk
from aioinject.ext.fastapi import AioInjectMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from granian.utils.proxies import wrap_asgi_with_proxy_headers
from structlog import get_logger

from app.accounts.routes import accounts_router
from app.auth.routes import auth_router
from app.config import (
    AppSettings,
    AuthSettings,
    DatabaseSettings,
    EnvironmentSettings,
    get_settings,
)
from app.container import create_container
from app.database import initialize_database
from app.graphql_app import create_graphql_router
from app.health.routes import health_router
from app.middleware import SessionMiddleware
from app.middleware.fingerprints import FingerprintMiddleware
from app.testing.routes import test_setup_router


def add_routes(
    app: FastAPI,
    env_settings: EnvironmentSettings,
) -> None:
    """Register routes for the app."""
    if env_settings.is_testing or env_settings.is_staging:
        # add E2E Setup API routes during testing
        app.include_router(test_setup_router)

    app.include_router(
        create_graphql_router(env_settings=env_settings),
        prefix="/graphql",
    )
    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(accounts_router)


def add_middleware(
    app: FastAPI,
    app_settings: AppSettings,
    auth_settings: AuthSettings,
) -> None:
    """Register middleware for the app."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_allow_origins,
        allow_origin_regex=app_settings.cors_allow_origin_regex,
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
        expose_headers=["*"],
    )
    app.add_middleware(
        CorrelationIdMiddleware,
        header_name="X-Request-ID",
    )
    app.add_middleware(
        SessionMiddleware,
        session_cookie=auth_settings.session_user_cookie_name,
        path="/",
        same_site="lax",
        secure=auth_settings.session_cookie_secure,
        domain=auth_settings.session_cookie_domain,
    )
    app.add_middleware(
        FingerprintMiddleware,
        path="/",
        same_site="lax",
        secure=auth_settings.session_cookie_secure,
        domain=auth_settings.session_cookie_domain,
    )
    app.add_middleware(
        AioInjectMiddleware,
        container=create_container(),
    )
    app.add_middleware(GZipMiddleware)


@asynccontextmanager
async def app_lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    with sentry_sdk.start_transaction(name="App Lifespan", op="lifespan"):
        logger = get_logger(__name__)
        database_settings = get_settings(DatabaseSettings)
        logger.debug("Initializing database connection")
        await initialize_database(
            database_url=str(database_settings.database_url),
            default_database_name=database_settings.default_database_name,
        )
        yield


def create_app() -> FastAPI:
    """Create an application instance."""
    app_settings = get_settings(AppSettings)
    env_settings = get_settings(EnvironmentSettings)
    app = FastAPI(
        version="0.0.1",
        debug=env_settings.debug,
        openapi_url=app_settings.openapi_url,
        root_path=app_settings.root_path,
        lifespan=app_lifespan,
    )
    add_routes(app, env_settings=env_settings)
    add_middleware(
        app,
        app_settings=app_settings,
        auth_settings=get_settings(AuthSettings),
    )
    return wrap_asgi_with_proxy_headers(app, trusted_hosts="*")  # type: ignore[return-type]
