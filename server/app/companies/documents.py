from beanie import Document


class Company(Document):
    name: str
    description: str
    address: str
    city: str
    postcode: int
    country: str
    phone: str
    website: str
    email: str

    class Settings:
        name = "companies"
