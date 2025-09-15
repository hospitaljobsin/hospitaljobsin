from enum import Enum
from typing import Self

import strawberry

from app.base.types import AddressType

from .models import (
    LocationAutocompleteSuggestion,
)


@strawberry.enum(name="RegionLevel", description="The level of the region.")
class RegionLevel(Enum):
    CONTINENT = "continent"
    COUNTRY = "country"
    STATE = "state"
    LOCALITY = "locality"


@strawberry.type(
    name="LocationAutocompleteSuggestion",
    description="Location autocomplete suggestion.",
)
class LocationAutocompleteSuggestionType:
    place_id: str = strawberry.field(
        description="Place ID of the location",
    )
    level: RegionLevel = strawberry.field(
        description="The level of the region.",
    )
    address: AddressType = strawberry.field(
        description="Display name of the location",
    )

    @classmethod
    def marshal(cls, data: LocationAutocompleteSuggestion) -> Self:
        return cls(
            place_id=data.place_id,
            address=AddressType.marshal(data.address),
            level=RegionLevel(data.level),
        )


@strawberry.type(
    name="AutocompleteLocationsPayload",
    description="The payload for the search locations query.",
)
class AutocompleteLocationsPayloadType:
    locations: list[LocationAutocompleteSuggestionType] = strawberry.field(
        description="List of search locations.",
    )
