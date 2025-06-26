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

# TODO: probably init database outside, over here??
# but then we won't get access to secret settings, which is fine for now ig..
# But for now, we cannot even see the lifespan logs...

app = create_app()
handler = Mangum(app, lifespan="on")
