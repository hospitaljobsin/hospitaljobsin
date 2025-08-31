from pydantic import BaseModel, Field


class LocationAutocompleteSuggestion(BaseModel):
    place_id: str
    display_name: str

    class Config:
        frozen = True

    def __hash__(self):
        return hash((self.place_id, self.display_name))


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
