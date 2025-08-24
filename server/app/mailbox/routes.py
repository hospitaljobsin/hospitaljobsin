import base64
from typing import Any

from fastapi import APIRouter

from app.mailbox import messages

mailbox_router = APIRouter(prefix="/mailbox")


@mailbox_router.get("/messages")
async def get_messages() -> dict[str, list[dict[str, Any]]]:
    """Get all messages in JSON format with key details."""
    message_list = messages.get_messages()

    json_messages = []
    for i, message in enumerate(message_list):
        # Extract key details from the email message
        json_message = {
            "id": i,  # Using index as ID since messages don't have built-in IDs
            "sender": message.get("from", ""),
            "recipients": message.get("to", ""),
            "subject": message.get("subject", ""),
            "text_body": "",
            "html_body": "",
        }

        # Extract text and HTML body content
        if message.is_multipart():
            for part in message.walk():
                content_type = part.get_content_type()
                payload = part.get_payload()

                # Handle base64 encoded content
                if (
                    isinstance(payload, str)
                    and part.get("Content-Transfer-Encoding") == "base64"
                ):
                    try:
                        decoded_payload = base64.b64decode(payload).decode(
                            "utf-8", errors="ignore"
                        )
                    except:
                        decoded_payload = payload
                elif isinstance(payload, bytes):
                    decoded_payload = payload.decode("utf-8", errors="ignore")
                else:
                    decoded_payload = str(payload)

                if content_type == "text/plain":
                    json_message["text_body"] = decoded_payload
                elif content_type == "text/html":
                    json_message["html_body"] = decoded_payload
        else:
            # Single part message
            content_type = message.get_content_type()
            payload = message.get_payload()

            # Handle base64 encoded content
            if (
                isinstance(payload, str)
                and message.get("Content-Transfer-Encoding") == "base64"
            ):
                try:
                    decoded_payload = base64.b64decode(payload).decode(
                        "utf-8", errors="ignore"
                    )
                except:
                    decoded_payload = payload
            elif isinstance(payload, bytes):
                decoded_payload = payload.decode("utf-8", errors="ignore")
            else:
                decoded_payload = str(payload)

            if content_type == "text/plain":
                json_message["text_body"] = decoded_payload
            elif content_type == "text/html":
                json_message["html_body"] = decoded_payload

        json_messages.append(json_message)

    return {"messages": json_messages}
