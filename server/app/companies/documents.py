from beanie import Document

from app.base.models import Address


class Company(Document):
    name: str
    description: str
    address: Address
    phone: str
    website: str
    email: str
    logo_url: str | None = None

    class Settings:
        name = "companies"
