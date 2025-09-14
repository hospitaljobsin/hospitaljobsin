import uuid

from app.base.models import Address
from app.core.constants import (
    DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT,
    REGION_SEARCH_INDEX_NAME,
)
from app.geocoding.documents import Region
from app.geocoding.models import (
    LocationAutocompleteSuggestion,
)


class RegionRepo:
    async def get_by_name(self, name: str) -> Region | None:
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
            {
                "$addFields": {
                    "searchScore": {"$meta": "searchScore"},
                    # Assign priority based on level (lower number = higher priority)
                    "levelPriority": {
                        "$switch": {
                            "branches": [
                                {"case": {"$eq": ["$level", "continent"]}, "then": 1},
                                {"case": {"$eq": ["$level", "country"]}, "then": 2},
                                {"case": {"$eq": ["$level", "state"]}, "then": 3},
                                {"case": {"$eq": ["$level", "locality"]}, "then": 4},
                                {
                                    "case": {"$eq": ["$level", "neighbourhood"]},
                                    "then": 5,
                                },
                                {"case": {"$eq": ["$level", "city"]}, "then": 6},
                            ],
                            "default": 7,  # Any other level gets lowest priority
                        }
                    },
                }
            },
            {
                "$sort": {"levelPriority": 1, "searchScore": -1}
            },  # Sort by level priority first, then search relevance
            {"$limit": 1},  # Get the highest priority match
        ]

        results = await Region.aggregate(pipeline, projection_model=Region).to_list()

        if results:
            return results[0]
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
            {
                "$addFields": {
                    "searchScore": {"$meta": "searchScore"},
                    # Assign priority based on level (lower number = higher priority)
                    "levelPriority": {
                        "$switch": {
                            "branches": [
                                {"case": {"$eq": ["$level", "continent"]}, "then": 1},
                                {"case": {"$eq": ["$level", "country"]}, "then": 2},
                                {"case": {"$eq": ["$level", "state"]}, "then": 3},
                                {"case": {"$eq": ["$level", "locality"]}, "then": 4},
                            ],
                            "default": 5,  # Any other level gets lowest priority
                        }
                    },
                }
            },
            {"$sort": {"levelPriority": 1, "searchScore": -1}},
            {"$limit": DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT},
        ]

        results = await Region.aggregate(pipeline, projection_model=Region).to_list()

        print(f"Autocomplete raw results: {results}")

        # Collect all names and aliases, avoiding duplicates by place_id
        suggestions_dict: dict[str, LocationAutocompleteSuggestion] = {}
        for result in results:
            # Generate a new UUID for the main name
            if result.name:
                place_id = str(uuid.uuid4())
                suggestions_dict[place_id] = LocationAutocompleteSuggestion(
                    place_id=place_id,
                    level=result.level,
                    address=Address(
                        display_name=result.address.display_name,
                        country=result.address.country,
                        street_address=result.address.street_address,
                        address_locality=result.address.address_locality,
                        address_region=result.address.address_region,
                        postal_code=result.address.postal_code,
                    ),
                )

            # Generate a new UUID for each alias
            if result.aliases:
                for alias in result.aliases:
                    place_id = str(uuid.uuid4())
                    suggestions_dict[place_id] = LocationAutocompleteSuggestion(
                        place_id=place_id,
                        level=result.level,
                        address=Address(
                            display_name=alias,
                            country=result.address.country,
                            street_address=result.address.street_address,
                            address_locality=result.address.address_locality,
                            address_region=result.address.address_region,
                            postal_code=result.address.postal_code,
                        ),
                    )

        # Convert to list and sort by display_name for consistent ordering
        return list(suggestions_dict.values())
