from app.config import Settings  # noqa: INP001
from app.logger import setup_logging
from app.mcp_server import mcp

if __name__ == "__main__":
    settings = Settings()  # type: ignore[call-arg]
    # set up logging
    setup_logging(
        human_readable=settings.debug,
    )

    # run application
    mcp.run(transport="sse")
