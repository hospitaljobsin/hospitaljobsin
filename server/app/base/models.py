from pydantic import BaseModel, Field
from pydantic_extra_types.country import CountryAlpha2


class BaseInputModel(BaseModel):
    model_config = {
        "extra": "allow",
    }


class GeoObject(BaseModel):
    type: str = "Point"
    coordinates: tuple[float, float]


class BoundingBox(BaseModel):
    """Geographic bounding box for map viewport queries."""

    sw_lat: float = Field(description="Southwest latitude")
    sw_lng: float = Field(description="Southwest longitude")
    ne_lat: float = Field(description="Northeast latitude")
    ne_lng: float = Field(description="Northeast longitude")


class Address(BaseModel):
    display_name: str | None = None
    street_address: str | None = None
    address_locality: str | None = None
    address_region: str | None = None
    postal_code: str | None = None
    country: CountryAlpha2 | None = None


class BaseSearchable(BaseModel):
    pagination_token: str
