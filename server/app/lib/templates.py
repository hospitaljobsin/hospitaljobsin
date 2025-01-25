from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.config import settings
from app.lib.constants import (
    APP_NAME,
    SUPPORT_EMAIL,
)


def register_globals(environment: Environment) -> None:
    """Register global variables for the environment."""
    environment.globals["app_name"] = APP_NAME
    environment.globals["app_url"] = settings.app_url
    environment.globals["support_email"] = SUPPORT_EMAIL


def create_environment() -> Environment:
    """Initialize an environment for template rendering."""
    environment = Environment(
        loader=FileSystemLoader(
            "templates",
        ),
        autoescape=select_autoescape(),
    )
    register_globals(environment)
    return environment


environment = create_environment()
