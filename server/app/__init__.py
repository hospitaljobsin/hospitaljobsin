from collections.abc import AsyncGenerator

from aioinject.ext.fastapi import AioInjectMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import auth_router
from app.config import Settings
from app.container import create_container
from app.database import initialize_database
from app.graphql_app import create_graphql_router
from app.middleware import SessionMiddleware


def add_routes(app: FastAPI) -> None:
    """Register routes for the app."""
    app.include_router(
        create_graphql_router(),
        prefix="/graphql",
    )
    app.include_router(auth_router)


def add_middleware(app: FastAPI, settings: Settings) -> None:
    """Register middleware for the app."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
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
        jwe_secret_key=settings.jwe_secret_key.get_secret_value(),
        session_cookie=settings.session_user_cookie_name,
        path="/",
        same_site="lax",
        secure=False,
        domain=settings.session_cookie_domain,
    )

    app.add_middleware(
        AioInjectMiddleware,
        container=create_container(),
    )


async def app_lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize the database when the app starts."""
    settings = Settings()
    async with initialize_database(database_url=str(settings.database_url)):
        yield


def create_app() -> FastAPI:
    settings = Settings()
    app = FastAPI(
        version="0.0.1",
        debug=settings.debug,
        openapi_url=settings.openapi_url,
        root_path=settings.root_path,
        lifespan=app_lifespan,
    )
    add_routes(app)
    add_middleware(app, settings=settings)
    return app
