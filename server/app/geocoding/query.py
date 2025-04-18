from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.core.geocoding import BaseLocationService

from .types import (
    SearchLocationsPayloadType,
    SearchLocationType,
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
        location_service: Annotated[BaseLocationService, Inject],
        search_term: Annotated[
            str,
            strawberry.argument(
                description="The search (query) term",
            ),
        ],
        limit: Annotated[
            int,
            strawberry.argument(
                description="How many items to return",
            ),
        ] = 5,
    ) -> SearchLocationsPayloadType:
        results = await location_service.get_locations(
            search_term=search_term,
            limit=limit,
        )

        return SearchLocationsPayloadType(
            locations=[SearchLocationType.marshal(location) for location in results],
        )
