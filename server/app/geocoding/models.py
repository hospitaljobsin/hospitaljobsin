from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


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


class GeoJSONMultiPolygon(BaseModel):
    """GeoJSON MultiPolygon geometry for complex boundaries."""

    type: str = Field(default="MultiPolygon", description="Geometry type")
    coordinates: list[list[list[list[float]]]] = Field(
        ..., description="Array of polygons"
    )


# Location type enum for query optimization
class LocationType(str, Enum):
    """Enumeration of location types for query optimization."""

    COUNTRY = "country"
    STATE = "state"
    CITY = "city"
    TOWN = "town"
    VILLAGE = "village"
    SUBURB = "suburb"
    NEIGHBORHOOD = "neighborhood"


# New models for geographic hierarchy
class GeographicLocation(BaseModel):
    """Base model for geographic locations with common fields."""

    id: str = Field(..., description="Unique identifier for the location")
    name: str = Field(..., description="Display name of the location")
    code: str | None = Field(None, description="ISO or standard code for the location")
    location_type: LocationType = Field(
        ..., description="Type of location for query optimization"
    )
    coordinates: Coordinates | None = Field(
        None, description="Geographic coordinates (for point-based locations)"
    )
    geojson: GeoJSONPolygon | GeoJSONMultiPolygon | None = Field(
        None, description="GeoJSON boundary (for polygon-based locations)"
    )
    population: int | None = Field(None, description="Population count if available")
    timezone: str | None = Field(None, description="Timezone identifier")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def is_point_based(self) -> bool:
        """Check if this location uses point-based coordinates."""
        return self.location_type in [
            LocationType.CITY,
            LocationType.TOWN,
            LocationType.VILLAGE,
            LocationType.SUBURB,
            LocationType.NEIGHBORHOOD,
        ]

    def is_polygon_based(self) -> bool:
        """Check if this location uses polygon-based boundaries."""
        return self.location_type in [LocationType.COUNTRY, LocationType.STATE]

    def get_center_coordinates(self) -> Coordinates | None:
        """Get center coordinates for polygon-based locations."""
        if self.is_point_based():
            return self.coordinates
        elif self.is_polygon_based() and self.geojson:
            # Calculate centroid from GeoJSON
            if isinstance(self.geojson, GeoJSONPolygon):
                coords = self.geojson.coordinates[0]  # First ring
            else:  # MultiPolygon
                coords = self.geojson.coordinates[0][0]  # First polygon, first ring

            if coords:
                # Simple centroid calculation (can be improved with proper geometric algorithms)
                lats = [coord[1] for coord in coords]
                lons = [coord[0] for coord in coords]
                return Coordinates(
                    latitude=sum(lats) / len(lats), longitude=sum(lons) / len(lons)
                )
        return None


class City(GeographicLocation):
    """Model for city/locality data."""

    state_id: str = Field(..., description="Reference to parent state")
    country_id: str = Field(..., description="Reference to parent country")
    postal_codes: list[str] | None = Field(None, description="List of postal codes")
    area_km2: float | None = Field(None, description="Area in square kilometers")
    elevation_m: float | None = Field(None, description="Elevation in meters")

    def __init__(self, **data):
        super().__init__(**data)
        # Cities are always point-based
        if not self.location_type:
            self.location_type = LocationType.CITY


class State(GeographicLocation):
    """Model for state/province/region data."""

    country_id: str = Field(..., description="Reference to parent country")
    type: str = Field(
        ...,
        description="Type of administrative division (state, province, region, etc.)",
    )
    cities_count: int | None = Field(None, description="Number of cities in this state")

    def __init__(self, **data):
        super().__init__(**data)
        # States are always polygon-based
        if not self.location_type:
            self.location_type = LocationType.STATE


class Country(GeographicLocation):
    """Model for country data."""

    iso_code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    iso_code_3: str = Field(..., description="ISO 3166-1 alpha-3 country code")
    numeric_code: str = Field(..., description="ISO 3166-1 numeric country code")
    phone_code: str | None = Field(None, description="International calling code")
    currency_code: str | None = Field(None, description="ISO 4217 currency code")
    languages: list[str] | None = Field(None, description="List of official languages")
    states_count: int | None = Field(
        None, description="Number of states in this country"
    )

    def __init__(self, **data):
        super().__init__(**data)
        # Countries are always polygon-based
        if not self.location_type:
            self.location_type = LocationType.COUNTRY


class GeographicHierarchy(BaseModel):
    """Model for representing the complete geographic hierarchy."""

    country: Country
    states: list[State]
    cities: list[City]


class GeographicSearchResult(BaseModel):
    """Model for geographic search results."""

    type: str = Field(..., description="Type of result: country, state, or city")
    location: GeographicLocation
    relevance_score: float = Field(..., description="Search relevance score (0-1)")


class GeospatialQuery(BaseModel):
    """Model for geospatial queries."""

    location_type: LocationType | None = Field(
        None, description="Filter by location type"
    )
    coordinates: Coordinates | None = Field(
        None, description="Center point for radius search"
    )
    radius_km: float | None = Field(None, description="Search radius in kilometers")
    polygon: GeoJSONPolygon | None = Field(
        None, description="Polygon for intersection search"
    )
    country_code: str | None = Field(None, description="Filter by country ISO code")
    state_code: str | None = Field(None, description="Filter by state code")
