from datetime import datetime
from typing import Annotated

from beanie import Document, Indexed, Link

from app.accounts.documents import Account


class Session(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    user_agent: str
    expires_at: datetime
    account: Link[Account]

    class Settings:
        name = "sessions"  # MongoDB collection name


class PasswordResetToken(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    expires_at: datetime
    account: Link[Account]

    class Settings:
        name = "password_reset_tokens"  # MongoDB collection name
