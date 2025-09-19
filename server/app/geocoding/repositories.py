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
                            {
                                "autocomplete": {
                                    "query": name,
                                    "path": "name",
                                    "score": {
                                        "boost": {"value": 3}
                                    },  # <-- Give higher weight to name
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": name,
                                    "path": "aliases",
                                    "score": {
                                        "boost": {"value": 1}
                                    },  # <-- Lower weight to aliases
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
                                    "score": {
                                        "boost": {"value": 3}
                                    },  # <-- Give higher weight to name
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": search_term,
                                    "path": "aliases",
                                    "score": {
                                        "boost": {"value": 1}
                                    },  # <-- Lower weight to aliases
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
                    "levelPriority": {
                        "$switch": {
                            "branches": [
                                {"case": {"$eq": ["$level", "continent"]}, "then": 1},
                                {"case": {"$eq": ["$level", "country"]}, "then": 2},
                                {"case": {"$eq": ["$level", "state"]}, "then": 3},
                                {"case": {"$eq": ["$level", "locality"]}, "then": 4},
                            ],
                            "default": 5,
                        }
                    },
                }
            },
            {
                "$project": {
                    "searchScore": 1,
                    "levelPriority": 1,
                    "level": 1,
                    "coordinates": 1,
                    "geometry": 1,
                    "address": {
                        "street_address": "$address.street_address",
                        "address_locality": "$address.address_locality",
                        "address_region": "$address.address_region",
                        "country": "$address.country",
                        "postal_code": "$address.postal_code",
                    },
                    "names": {"$setUnion": [["$name"], {"$ifNull": ["$aliases", []]}]},
                }
            },
            {"$unwind": "$names"},
            {
                "$group": {
                    "_id": {
                        "name": "$names",
                        "country": "$address.country",
                        "region": "$address.address_region",
                        "locality": "$address.address_locality",
                        "street": "$address.street_address",
                        "level": "$level",
                    },
                    "doc": {
                        "$first": {
                            "name": "$names",
                            "coordinates": "$coordinates",
                            "geometry": "$geometry",
                            "address": "$address",
                            "level": "$level",
                            "levelPriority": "$levelPriority",
                            "searchScore": "$searchScore",
                        }
                    },
                }
            },
            {"$replaceRoot": {"newRoot": "$doc"}},
            {"$sort": {"levelPriority": 1, "searchScore": -1}},
            {"$limit": DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT},
        ]

        results = await Region.aggregate(pipeline).to_list()

        suggestions: list[LocationAutocompleteSuggestion] = []
        for result in results:
            place_id = str(uuid.uuid4())
            suggestions.append(
                LocationAutocompleteSuggestion(
                    place_id=place_id,
                    level=result["level"],
                    address=Address(
                        display_name=result["name"],
                        street_address=result["address"].get("street_address"),
                        address_locality=result["address"].get("address_locality"),
                        address_region=result["address"].get("address_region"),
                        country=result["address"].get("country"),
                        postal_code=result["address"].get("postal_code"),
                    ),
                )
            )

        return suggestions
