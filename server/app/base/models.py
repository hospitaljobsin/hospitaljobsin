from pydantic import BaseModel


class GeoObject(BaseModel):
    type: str = "Point"
    coordinates: tuple[float, float]


class Address(BaseModel):
    line1: str | None = None
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    pincode: str | None = None
