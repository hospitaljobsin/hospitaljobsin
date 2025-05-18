from mangum import Mangum

from app import create_app
from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation

initialize_instrumentation(settings=get_settings(AppSettings))

app = create_app()
handler = Mangum(app, lifespan="auto")
