import asyncio
from email.message import Message


class DummyMailbox:
    def __init__(self) -> None:
        self._messages: list[Message] = []
        self._lock = asyncio.Lock()

    async def add_message(self, message: Message) -> None:
        async with self._lock:
            self._messages.append(message)

    async def get_messages(self) -> list[Message]:
        async with self._lock:
            return list(self._messages)

    async def clear_messages(self) -> None:
        async with self._lock:
            self._messages.clear()
