from datetime import datetime

from beanie import Document, Indexed


class Account(Document):
    email: Indexed(str)
    password_hash: str
    has_onboarded: str
    updated_at: datetime | None

    class Settings:
        name = "accounts"
