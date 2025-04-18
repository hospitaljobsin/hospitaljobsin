from typing import Self

import strawberry

from .models import SearchLocation


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

    @classmethod
    def marshal(cls, data: SearchLocation) -> Self:
        return cls(
            place_id=data.place_id,
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
