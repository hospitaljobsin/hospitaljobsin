from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.config import AppSettings
from app.core.constants import (
    APP_NAME,
    AUTOMATION_BOT_NAME,
    SUPPORT_EMAIL,
)


def register_globals(environment: Environment, settings: AppSettings) -> None:
    """Register global variables for the environment."""
    environment.globals["app_name"] = APP_NAME
    environment.globals["app_url"] = settings.seeker_portal_base_url
    environment.globals["support_email"] = SUPPORT_EMAIL
    environment.globals["automation_bot_name"] = AUTOMATION_BOT_NAME


def create_jinja2_environment(settings: AppSettings) -> Environment:
    """Create an environment for template rendering."""
    environment = Environment(
        loader=FileSystemLoader(
            "templates",
        ),
        autoescape=select_autoescape(),
    )
    register_globals(environment, settings=settings)
    return environment
