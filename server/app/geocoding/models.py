from pydantic import BaseModel


class SearchLocation(BaseModel):
    latitude: float
    longitude: float
    display_name: str


class GeocodeResult(BaseModel):
    latitude: float
    longitude: float
