from datetime import datetime
from typing import Annotated

from beanie import Document, Indexed, Link
from pydantic import Field

from app.accounts.documents import Account


class Session(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    user_agent: str
    expires_at: datetime = Field(default_factory=datetime.utcnow)
    account: Link[Account]

    class Settings:
        name = "sessions"  # MongoDB collection name
