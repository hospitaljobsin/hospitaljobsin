from pydantic import BaseModel, Field


class LocationAutocompleteSuggestion(BaseModel):
    place_id: str
    display_name: str

    class Config:
        frozen = True

    def __hash__(self):
        return hash((self.place_id, self.display_name))


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class GeocodeResult(BaseModel):
    display_name: str | None = None
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


# GeoJSON models for spatial data
class GeoJSONPoint(BaseModel):
    """GeoJSON Point geometry."""

    type: str = Field(default="Point", description="Geometry type")
    coordinates: list[float] = Field(
        ..., description="[longitude, latitude] coordinates"
    )


class GeoJSONPolygon(BaseModel):
    """GeoJSON Polygon geometry."""

    type: str = Field(default="Polygon", description="Geometry type")
    coordinates: list[list[list[float]]] = Field(
        ..., description="Array of linear rings"
    )
