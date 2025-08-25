from email.message import Message


class DummyMailbox:
    def __init__(self) -> None:
        self._messages: list[Message] = []

    def add_message(self, message: Message) -> None:
        self._messages.append(message)

    def get_messages(self) -> list[Message]:
        return self._messages

    def clear_messages(self) -> None:
        self._messages.clear()
