from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.geocoding.repositories import RegionRepo

from .types import (
    AutocompleteLocationsPayloadType,
    LocationAutocompleteSuggestionType,
)


@strawberry.type
class GeocodingQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=AutocompleteLocationsPayloadType,
        description="Get available autocomplete locations for the given search term.",
    )
    @inject
    async def autocomplete_locations(
        self,
        region_repo: Annotated[RegionRepo, Inject],
        search_term: Annotated[
            str,
            strawberry.argument(
                description="The search (query) term",
            ),
        ],
    ) -> AutocompleteLocationsPayloadType:
        results = await region_repo.get_autocomplete_suggestions(
            search_term=search_term,
        )

        return AutocompleteLocationsPayloadType(
            locations=[
                LocationAutocompleteSuggestionType.marshal(location)
                for location in results
            ],
        )
