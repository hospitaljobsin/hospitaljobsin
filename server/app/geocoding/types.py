from typing import Self

import strawberry

from .models import (
    Coordinates,
    GeocodeResult,
    LocationAutocompleteSuggestion,
)


@strawberry.type(
    name="Coordinates",
    description="Geographic coordinates.",
)
class CoordinatesType:
    longitude: float = strawberry.field(
        description="Longitude of the location.",
    )
    latitude: float = strawberry.field(
        description="Latitude of the location.",
    )

    @classmethod
    def marshal(cls, data: GeocodeResult) -> Self:
        return cls(
            longitude=data.longitude,
            latitude=data.latitude,
        )


@strawberry.input(
    name="CoordinatesInput",
    description="Geographic coordinates input.",
)
class CoordinatesInputType:
    longitude: float = strawberry.field(
        description="Longitude of the location.",
    )
    latitude: float = strawberry.field(
        description="Latitude of the location.",
    )

    @classmethod
    def to_document(cls, data: Self) -> Coordinates:
        return Coordinates(longitude=data.longitude, latitude=data.latitude)


@strawberry.type(
    name="LocationAutocompleteSuggestion",
    description="Search location entity.",
)
class LocationAutocompleteSuggestionType:
    place_id: str = strawberry.field(
        description="Place ID of the location",
    )
    display_name: str = strawberry.field(
        description="Display name of the location",
    )

    @classmethod
    def marshal(cls, data: LocationAutocompleteSuggestion) -> Self:
        return cls(
            place_id=data.place_id,
            display_name=data.display_name,
        )


@strawberry.type(
    name="SearchLocationsPayload",
    description="The payload for the search locations query.",
)
class SearchLocationsPayloadType:
    locations: list[LocationAutocompleteSuggestionType] = strawberry.field(
        description="List of search locations.",
    )
