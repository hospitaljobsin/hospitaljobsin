"""
Dynamic Lambda handler router.

This allows a single Lambda function to handle multiple handlers
by passing the handler name in the event.
"""

import importlib
from typing import Any

from aws_lambda_powertools.utilities.typing import LambdaContext


def lambda_handler(event: dict[str, Any], context: LambdaContext) -> Any:
    """
    Dynamic handler router for Lambda functions.

    Event should contain:
    {
        "handler": "module_name.function_name",
        "payload": {...}  # Optional payload to pass to the handler
    }
    """
    handler_path = event.get("handler")

    if not handler_path:
        raise ValueError("Event must contain 'handler' field")

    # Parse handler path (e.g., "send_resume_upload_reminders.lambda_handler")
    module_name, function_name = handler_path.rsplit(".", 1)

    # Import the module dynamically
    module = importlib.import_module(f"lambda_handlers.{module_name}")

    # Get the handler function
    handler_func = getattr(module, function_name)

    # Call the handler with the payload (or original event if no payload)
    payload = event.get("payload", event)

    return handler_func(payload, context)
