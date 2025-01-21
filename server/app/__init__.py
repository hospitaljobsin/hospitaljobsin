from aioinject.ext.fastapi import AioInjectMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.container import create_container
from app.database import initialize_database
from app.graphql_app import create_graphql_router


def add_routes(app: FastAPI) -> None:
    """Register routes for the app."""
    app.include_router(
        create_graphql_router(),
        prefix="/graphql",
    )


def add_middleware(app: FastAPI) -> None:
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

    # sessions are needed to store temporary code & state
    # needed for OAuth2 authorization code flows
    app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

    app.add_middleware(
        AioInjectMiddleware,
        container=create_container(),
    )


async def app_lifespan(app: FastAPI):
    async with initialize_database(
        database_url=str(settings.database_url),
    ):
        yield


def create_app() -> FastAPI:
    app = FastAPI(
        version="0.0.1",
        debug=settings.debug,
        openapi_url=settings.openapi_url,
        root_path=settings.root_path,
        lifespan=app_lifespan,
    )
    add_routes(app)
    add_middleware(app)
    return app
