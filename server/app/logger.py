from typing import Any

import structlog
from asgi_correlation_id import correlation_id
from structlog.dev import ConsoleRenderer
from structlog.processors import JSONRenderer
from structlog.types import EventDict, Processor, WrappedLogger


def add_correlation_id(
    _logger: WrappedLogger,
    _method_name: str,
    event_dict: EventDict,
) -> EventDict:
    """Add the correlation ID to log message."""
    if request_id := correlation_id.get():
        event_dict["request_id"] = request_id
    return event_dict


def remove_color_message(
    _logger: WrappedLogger,
    _method_name: str,
    event_dict: EventDict,
) -> EventDict:
    """
    Remove `color_message` from the event dict.

    Uvicorn logs the message a second time in the extra
    `color_message`, but we don't need it. This processor
    removes the key from the event dict if it exists.
    """

    event_dict.pop("color_message", None)
    return event_dict


def get_logging_renderer(*, human_readable: bool) -> JSONRenderer | ConsoleRenderer:
    """Get the logging renderer."""
    if human_readable:
        return ConsoleRenderer()
    return JSONRenderer(indent=1, sort_keys=True)


def build_shared_processors(*, human_readable: bool) -> list[Processor]:
    """Build shared logging processors."""
    time_stamper = structlog.processors.TimeStamper(fmt="iso", utc=True)
    shared_processors: list[Processor] = [
        add_correlation_id,  # Add correlation ID
        time_stamper,  # Add timestamps
        structlog.stdlib.add_log_level,  # Add log level
        structlog.stdlib.add_logger_name,  # Add logger name
        remove_color_message,  # Drop color message
        structlog.stdlib.PositionalArgumentsFormatter(),  # Add positional arguments
        structlog.processors.StackInfoRenderer(),  # Add stack information
        structlog.stdlib.ExtraAdder(),  # Add extra attributes
    ]

    if not human_readable:
        # Format the exception only in production
        # (we want to pretty-print them when using the ConsoleRenderer in development)
        shared_processors.append(structlog.processors.format_exc_info)
    return shared_processors


def build_base_log_config(log_level: str, *, human_readable: bool) -> dict[str, Any]:
    """Build base logging config."""
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "structlog": {
                "()": structlog.stdlib.ProcessorFormatter,
                "processors": [
                    structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                    get_logging_renderer(
                        human_readable=human_readable,
                    ),
                ],
                "foreign_pre_chain": build_shared_processors(
                    human_readable=human_readable,
                ),
            },
        },
        "handlers": {
            "default": {
                "formatter": "structlog",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "sqlalchemy": {
                "handlers": ["default"],
                "level": log_level,
                "propagate": False,
            },
        },
    }


def build_server_log_config(log_level: str, *, human_readable: bool) -> dict[str, Any]:
    """Build server logging config."""
    base_config = build_base_log_config(log_level, human_readable=human_readable)
    # Extend base config with server-specific loggers
    base_config["loggers"].update(
        {
            "uvicorn": {
                "handlers": ["default"],
                "level": log_level,
                "propagate": False,
            },
            "fastapi": {
                "handlers": ["default"],
                "level": log_level,
                "propagate": False,
            },
        }
    )
    return base_config


def setup_logging(*, human_readable: bool) -> None:
    """Set up application logging."""
    structlog_processors = [
        *build_shared_processors(
            human_readable=human_readable,
        ),
        # Prepare event dict for `ProcessorFormatter`.
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ]

    structlog.configure_once(
        processors=structlog_processors,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
