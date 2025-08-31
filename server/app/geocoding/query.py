from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.geocoding.repositories import RegionRepo

from .types import (
    LocationAutocompleteSuggestionType,
    SearchLocationsPayloadType,
)


@strawberry.type
class GeocodingQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=SearchLocationsPayloadType,
        description="Get available locations for the given search term.",
    )
    @inject
    async def search_locations(
        self,
        region_repo: Annotated[RegionRepo, Inject],
        search_term: Annotated[
            str,
            strawberry.argument(
                description="The search (query) term",
            ),
        ],
    ) -> SearchLocationsPayloadType:
        results = await region_repo.get_autocomplete_suggestions(
            search_term=search_term,
        )

        return SearchLocationsPayloadType(
            locations=[
                LocationAutocompleteSuggestionType.marshal(location)
                for location in results
            ],
        )
