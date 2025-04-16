from typing import Self

import strawberry

from .models import SearchLocation


@strawberry.type(
    name="SearchLocation",
    description="Search location entity.",
)
class SearchLocationType:
    latitude: float = strawberry.field(
        description="Latitude of the location",
    )
    longitude: float = strawberry.field(
        description="Longitude of the location",
    )
    display_name: str = strawberry.field(
        description="Display name of the location",
    )

    @classmethod
    def marshal(cls, data: SearchLocation) -> Self:
        return cls(
            latitude=data.latitude,
            longitude=data.longitude,
            display_name=data.display_name,
        )


@strawberry.type(
    name="SearchLocationsPayload",
    description="The payload for the search locations query.",
)
class SearchLocationsPayloadType:
    locations: list[SearchLocationType] = strawberry.field(
        description="List of search locations.",
    )
