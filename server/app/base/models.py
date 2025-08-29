from pydantic import BaseModel
from pydantic_extra_types.country import CountryAlpha2


class GeoObject(BaseModel):
    type: str = "Point"
    coordinates: tuple[float, float]


class Address(BaseModel):
    display_name: str | None = None
    street_address: str | None = None
    address_locality: str | None = None
    address_region: str | None = None
    postal_code: str | None = None
    country: CountryAlpha2 | None = None


class BaseSearchable(BaseModel):
    pagination_token: str
