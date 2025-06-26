import logging.config

from mangum import Mangum

from app import create_app
from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation
from app.logger import build_server_log_config, setup_logging

settings = get_settings(AppSettings)


# set up logging
# Apply the logging config
logging.config.dictConfig(
    build_server_log_config(
        log_level=settings.log_level,
        human_readable=not settings.is_production,
    )
)
setup_logging(
    human_readable=not settings.is_production,
)

# setup instrumentation
initialize_instrumentation(settings=settings)


app = create_app()
handler = Mangum(app, lifespan="on")
