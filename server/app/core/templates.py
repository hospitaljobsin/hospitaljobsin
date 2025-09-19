from typing import Any

import mjml
from jinja2 import Environment, FileSystemLoader, Template, select_autoescape

from app.config import FrontendSettings
from app.core.constants import (
    APP_NAME,
    APP_TAGLINE,
    AUTOMATION_BOT_NAME,
    SUPPORT_EMAIL,
)


class MJMLTemplate(Template):
    def render(self, *args: Any, **kwargs: Any) -> str:
        # Render MJML markup
        markup = super().render(*args, **kwargs)

        # Convert MJML markup to HTML
        return mjml.mjml2html(
            markup,
            fonts={
                "Work Sans": "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
            },
        )


class MJMLEnvironment(Environment):
    template_class = MJMLTemplate


def register_globals(environment: Environment, settings: FrontendSettings) -> None:
    """Register global variables for the environment."""
    environment.globals["app_name"] = APP_NAME
    environment.globals["app_logo_url"] = (
        f"{settings.seeker_portal_base_url}/favicon.ico"
    )
    environment.globals["hero_image_1_url"] = (
        f"{settings.seeker_portal_base_url}/hero-model.png"
    )
    environment.globals["hero_image_2_url"] = (
        f"{settings.seeker_portal_base_url}/hero-model-2.png"
    )
    environment.globals["app_tagline"] = APP_TAGLINE
    environment.globals["app_url"] = settings.seeker_portal_base_url
    environment.globals["support_email"] = SUPPORT_EMAIL
    environment.globals["automation_bot_name"] = AUTOMATION_BOT_NAME


def create_jinja2_mjml_environment(settings: FrontendSettings) -> MJMLEnvironment:
    """Create an environment for MJML template rendering."""
    environment = MJMLEnvironment(
        loader=FileSystemLoader(
            "templates",
        ),
        autoescape=select_autoescape(),
    )
    register_globals(environment, settings=settings)
    return environment


def create_jinja2_environment(settings: FrontendSettings) -> Environment:
    """Create an environment for template rendering."""
    environment = Environment(
        loader=FileSystemLoader(
            "templates",
        ),
        autoescape=select_autoescape(),
    )
    register_globals(environment, settings=settings)
    return environment
