import multiprocessing

from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation
from app.logger import build_server_log_config, setup_logging
from granian.constants import Interfaces
from granian.server import Granian
from watchfiles import BaseFilter


class PyJsonFilter(BaseFilter):
    def __call__(self, change, path: str) -> bool:
        return path.endswith((".py", ".json"))


if __name__ == "__main__":
    settings = get_settings(AppSettings)

    initialize_instrumentation(settings=settings)

    # set up logging
    setup_logging(
        human_readable=settings.debug,
    )

    Granian(
        "app:create_app",
        factory=True,
        address=settings.host,
        port=settings.port,
        workers=multiprocessing.cpu_count(),
        reload=settings.debug,
        reload_filter=PyJsonFilter,
        log_enabled=True,
        log_dictconfig=build_server_log_config(
            log_level=settings.log_level,
            human_readable=settings.debug,
        ),
        log_access=settings.debug,
        interface=Interfaces.ASGI,
    ).serve()
