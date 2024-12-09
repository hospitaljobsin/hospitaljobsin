from datetime import datetime

from beanie import Document, Indexed


class Account(Document):
    username: Indexed(str)
    email: Indexed(str)
    password_hash: str
    has_onboarded: str
    updated_at: datetime

    class Settings:
        name = "accounts"
