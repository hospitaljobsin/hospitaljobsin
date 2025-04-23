from pydantic import BaseModel


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class SearchLocation(BaseModel):
    place_id: str
    display_name: str
    coordinates: Coordinates
