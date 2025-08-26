from typing import Self

import strawberry

from .models import GeocodeResult, SearchLocation


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
    def to_document(cls, data: Self) -> GeocodeResult:
        return GeocodeResult(
            longitude=data.longitude,
            latitude=data.latitude,
        )


@strawberry.type(
    name="SearchLocation",
    description="Search location entity.",
)
class SearchLocationType:
    place_id: str = strawberry.field(
        description="Place ID of the location",
    )
    display_name: str = strawberry.field(
        description="Display name of the location",
    )

    coordinates: CoordinatesType = strawberry.field(
        description="Coordinates of the location",
    )

    @classmethod
    def marshal(cls, data: SearchLocation) -> Self:
        return cls(
            place_id=data.place_id,
            display_name=data.display_name,
            coordinates=CoordinatesType.marshal(data.coordinates),
        )


@strawberry.type(
    name="SearchLocationsPayload",
    description="The payload for the search locations query.",
)
class SearchLocationsPayloadType:
    locations: list[SearchLocationType] = strawberry.field(
        description="List of search locations.",
    )
