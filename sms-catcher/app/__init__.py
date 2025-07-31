from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import AppSettings, get_settings
from app.routes import router


def add_routes(app: FastAPI) -> None:
    """Register routes for the app."""
    app.include_router(router)


def add_middleware(
    app: FastAPI,
    app_settings: AppSettings,
) -> None:
    """Register middleware for the app."""
    app.add_middleware(
        CorrelationIdMiddleware,
        header_name="X-Request-ID",
    )
    app.add_middleware(GZipMiddleware)


def create_app() -> FastAPI:
    """Create an application instance."""
    app_settings = get_settings(AppSettings)
    app = FastAPI(
        version="0.0.1",
        debug=app_settings.debug,
        openapi_url=app_settings.openapi_url,
        root_path=app_settings.root_path,
    )
    add_routes(app)
    add_middleware(
        app,
        app_settings=app_settings,
    )
    return app
