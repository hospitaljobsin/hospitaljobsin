from pydantic import BaseModel


class GeocodeResult(BaseModel):
    latitude: float
    longitude: float
    postal_code: str | None = None
    address_region: str | None = None
    street_address: str | None = None
    address_locality: str | None = None
    country: str | None = None


class SearchLocation(BaseModel):
    place_id: str
    display_name: str
    coordinates: GeocodeResult
