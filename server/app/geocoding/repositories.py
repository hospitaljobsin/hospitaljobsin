import uuid

from app.core.constants import (
    DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT,
    REGION_SEARCH_INDEX_NAME,
)
from app.geocoding.documents import Region
from app.geocoding.models import LocationAutocompleteSuggestion


class RegionRepo:
    async def get_by_name(self, name: str) -> Region | None:
        # TODO: cache this if needed in the future
        # Use Atlas Search for exact matching and alias searching
        pipeline = [
            {
                "$search": {
                    "index": REGION_SEARCH_INDEX_NAME,
                    "compound": {
                        "should": [
                            {"text": {"query": name, "path": "name"}},
                            {"text": {"query": name, "path": "aliases"}},
                        ],
                        "minimumShouldMatch": 1,
                    },
                }
            },
            {"$limit": 1},  # Get the best match
            {"$addFields": {"searchScore": {"$meta": "searchScore"}}},
            {"$sort": {"searchScore": -1}},  # Sort by relevance score
        ]

        results = await Region.aggregate(pipeline).to_list()

        if results:
            # Convert the raw result back to a Region document
            region_data = results[0]
            return Region(**region_data)

        return None

    async def get_autocomplete_suggestions(
        self, search_term: str
    ) -> list[LocationAutocompleteSuggestion]:
        pipeline = [
            {
                "$search": {
                    "index": REGION_SEARCH_INDEX_NAME,
                    "compound": {
                        "should": [
                            {
                                "autocomplete": {
                                    "query": search_term,
                                    "path": "name",
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": search_term,
                                    "path": "aliases",
                                }
                            },
                        ],
                        "minimumShouldMatch": 1,
                    },
                }
            },
            {"$limit": DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT},
        ]

        results = await Region.aggregate(pipeline, projection_model=None).to_list()

        # Collect all names and aliases, avoiding duplicates by place_id
        suggestions_dict = {}
        for result in results:
            # Generate a new UUID for the main name
            if "name" in result:
                place_id = str(uuid.uuid4())
                suggestions_dict[place_id] = LocationAutocompleteSuggestion(
                    place_id=place_id,
                    display_name=result["name"],
                )

            # Generate a new UUID for each alias
            if result.get("aliases"):
                for alias in result["aliases"]:
                    place_id = str(uuid.uuid4())
                    suggestions_dict[place_id] = LocationAutocompleteSuggestion(
                        place_id=place_id,
                        display_name=alias,
                    )

        # Convert to list and sort by display_name for consistent ordering
        return sorted(suggestions_dict.values(), key=lambda x: x.display_name)
