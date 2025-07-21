import multiprocessing  # noqa: INP001

import uvicorn
from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation
from app.logger import build_server_log_config, setup_logging

if __name__ == "__main__":
    settings = get_settings(AppSettings)

    initialize_instrumentation(settings=settings)

    # set up logging
    setup_logging(
        human_readable=settings.debug,
    )

    # run application
    uvicorn.run(
        app="app:create_app",
        factory=True,
        host=settings.host,
        port=settings.port,
        server_header=False,
        date_header=False,
        workers=multiprocessing.cpu_count() * 2,
        reload=settings.debug,
        access_log=settings.debug,
        reload_includes=["*.json", "*.py"],
        log_config=build_server_log_config(
            log_level=settings.log_level,
            human_readable=settings.debug,
        ),
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
