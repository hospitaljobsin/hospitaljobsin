import asyncio
import base64
import json
from email.message import Message
from pathlib import Path
from typing import Any

from filelock import FileLock


class DummyMailbox:
    def __init__(self) -> None:
        self.path = Path("shared_mailbox.json")
        self.lock_path = self.path.with_suffix(".lock")
        self.lock = FileLock(str(self.lock_path))
        self._async_lock = asyncio.Lock()
        # Ensure file exists
        if not self.path.exists():
            self.path.write_text("[]")

    def add_message_sync(self, message: Message) -> None:
        with self.lock:
            messages = self.get_messages_sync()  # read current messages
            messages.append(self._format_message(message, len(messages) + 1))
            self.path.write_text(json.dumps(messages))

    def _format_message(self, message: Message, message_id: int) -> dict[str, Any]:
        json_message = {
            "id": message_id,
            "sender": message.get("from", ""),
            "recipients": self._parse_recipients(message.get("to", "")),
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

        return json_message

    def _parse_recipients(self, recipients_str: str) -> list[str]:
        """Parse recipients string into a list, handling various email formats."""
        if not recipients_str:
            return []

        # Split by comma and clean up each recipient
        recipients = []
        for recipient in recipients_str.split(","):
            recipient = recipient.strip()
            if recipient:
                recipients.append(recipient)

        return recipients

    def get_messages_sync(self) -> list[dict[str, Any]]:
        with self.lock:
            content = self.path.read_text()
            return json.loads(content)

    def clear_messages_sync(self) -> None:
        with self.lock:
            self.path.write_text("[]")

    async def add_message(self, message: Message):
        async with self._async_lock:
            await asyncio.to_thread(self.add_message_sync, message)

    async def get_messages(self):
        async with self._async_lock:
            return await asyncio.to_thread(self.get_messages_sync)

    async def clear_messages(self):
        async with self._async_lock:
            await asyncio.to_thread(self.clear_messages_sync)
