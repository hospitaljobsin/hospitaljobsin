from email.message import Message

messages: list[Message] = []


def add_message(message: Message) -> None:
    messages.append(message)


def get_messages() -> list[Message]:
    return messages


def clear_messages() -> None:
    messages.clear()
