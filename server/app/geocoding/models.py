from pydantic import BaseModel


class SearchLocation(BaseModel):
    latitude: float
    longitude: float
    display_name: str
    place_id: int
