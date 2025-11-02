from pydantic import BaseModel, Field

from app.base.models import Address
from app.core.constants import RegionLevel


class LocationAutocompleteSuggestion(BaseModel):
    place_id: str
    level: RegionLevel
    address: Address
    coordinates: tuple[float, float]  # (longitude, latitude)

    class Config:
        frozen = True

    def __hash__(self) -> int:
        return hash((self.place_id, self.address.display_name))


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


class GeoJSONMultiPolygon(BaseModel):
    """GeoJSON MultiPolygon geometry."""

    type: str = Field(default="MultiPolygon", description="Geometry type")
    coordinates: list[list[list[list[float]]]] = Field(
        ..., description="Array of linear rings"
    )
