from datetime import UTC, datetime
from typing import Annotated, ClassVar

import pymongo
from beanie import Document, Indexed
from pydantic import Field

from app.base.models import Address
from app.core.constants import RegionLevel
from app.geocoding.models import GeoJSONMultiPolygon, GeoJSONPoint, GeoJSONPolygon


class Region(Document):
    name: Annotated[str, Indexed()]
    address: Address
    aliases: list[str] = Field(default_factory=list)
    level: RegionLevel

    geometry: GeoJSONPolygon | GeoJSONMultiPolygon | None = None
    coordinates: GeoJSONPoint
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "regions"
        indexes: ClassVar[list[pymongo.IndexModel]] = [
            pymongo.IndexModel(
                [("geometry", pymongo.GEOSPHERE)], name="region_geometry_2dsphere_index"
            ),
            pymongo.IndexModel(
                [("coordinates", pymongo.GEOSPHERE)],
                name="region_coordinates_2dsphere_index",
            ),
            pymongo.IndexModel(
                [("aliases", pymongo.TEXT)], name="region_aliases_text_index"
            ),
        ]
