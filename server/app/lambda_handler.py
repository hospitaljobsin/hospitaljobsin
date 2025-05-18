from mangum import Mangum

from app import create_app
from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation
from app.logger import setup_logging

settings = get_settings(AppSettings)

# setup instrumentation
initialize_instrumentation(settings=settings)

# set up logging
setup_logging(
    human_readable=settings.debug,
)

app = create_app()
handler = Mangum(app, lifespan="auto")
