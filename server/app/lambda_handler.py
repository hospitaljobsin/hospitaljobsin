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

# FIXME: tracked down the issue- lifespan is executing on every call, which takes around 1s every time (because of DB initialization)

# TODO: probably init database outside, over here??
# but then we won't get access to secret settings, which is fine for now ig..
# But for now, we cannot even see the lifespan logs...


# async def init_database() -> None:
#     logger = get_logger(__name__)
#     database_settings = get_settings(DatabaseSettings)
#     logger.debug("Initializing database connection")

#     await initialize_database(
#         database_url=str(database_settings.database_url),
#         default_database_name=database_settings.default_database_name,
#     )


# asyncio.run(init_database())

app = create_app()
handler = Mangum(app, lifespan="on")
