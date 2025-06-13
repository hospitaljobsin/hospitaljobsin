from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from aioinject.ext.fastapi import AioInjectMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from structlog import get_logger

from app.auth.routes import auth_router
from app.config import (
    AppSettings,
    AuthSettings,
    DatabaseSettings,
    SecretSettings,
    get_settings,
)
from app.container import create_container
from app.crews.create_job.crew import CreateJobCrew
from app.database import initialize_database
from app.graphql_app import create_graphql_router
from app.health.routes import health_router
from app.jobs.routes import jobs_router
from app.middleware import SessionMiddleware
from app.testing.routes import test_setup_router


def add_routes(app: FastAPI, app_settings: AppSettings) -> None:
    """Register routes for the app."""
    if app_settings.is_testing:
        # add E2E Setup API routes during testing
        app.include_router(test_setup_router)
    app.include_router(
        create_graphql_router(app_settings=app_settings),
        prefix="/graphql",
    )
    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(jobs_router)


def add_middleware(
    app: FastAPI,
    app_settings: AppSettings,
    auth_settings: AuthSettings,
) -> None:
    """Register middleware for the app."""
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
        CORSMiddleware,
        allow_origins=app_settings.cors_allow_origins,
        allow_origin_regex=app_settings.cors_allow_origin_regex,
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
        expose_headers=["*"],
    )
    app.add_middleware(
        AioInjectMiddleware,
        container=create_container(),
    )


@asynccontextmanager
async def app_lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    logger = get_logger(__name__)
    logger.debug("Initializing application secrets")
    # load secrets during startup
    get_settings(SecretSettings)
    database_settings = get_settings(DatabaseSettings)
    logger.debug("Initializing database connection")
    async with initialize_database(
        database_url=str(database_settings.database_url),
        default_database_name=database_settings.default_database_name,
    ) as _:
        yield


def create_app() -> FastAPI:
    """Create an application instance."""
    app_settings = get_settings(AppSettings)
    app = FastAPI(
        version="0.0.1",
        debug=app_settings.debug,
        openapi_url=app_settings.openapi_url,
        root_path=app_settings.root_path,
        lifespan=app_lifespan,
    )
    add_routes(app, app_settings=app_settings)
    add_middleware(
        app,
        app_settings=app_settings,
        auth_settings=get_settings(AuthSettings),
    )
    return app
