import uvicorn
from app.config import settings
from app.logger import build_server_log_config, setup_logging

if __name__ == "__main__":
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
        reload=settings.debug,
        access_log=settings.debug,
        log_config=build_server_log_config(
            log_level=settings.log_level,
            human_readable=settings.debug,
        ),
    )
