from pydantic import BaseModel


class Address(BaseModel):
    line1: str | None
    line2: str | None
    city: str | None
    state: str | None
    country: str | None
    pincode: str | None
