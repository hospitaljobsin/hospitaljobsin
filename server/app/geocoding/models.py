from pydantic import BaseModel


class SearchLocation(BaseModel):
    place_id: str
    display_name: str


class GeocodeResult(BaseModel):
    latitude: float
    longitude: float
