from pydantic import BaseModel


class Address(BaseModel):
    line1: str | None = None
    line2: str | None = None
    city: str
    state: str
    country: str
    pincode: str | None = None
