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
                            # Exact match on name (highest priority)
                            {
                                "text": {
                                    "query": name,
                                    "path": "name",
                                    "score": {"boost": {"value": 10}},
                                }
                            },
                            # Autocomplete match on name (high priority)
                            {
                                "autocomplete": {
                                    "query": name,
                                    "path": "name",
                                    "score": {"boost": {"value": 5}},
                                }
                            },
                            # Autocomplete match on aliases (lower priority)
                            {
                                "autocomplete": {
                                    "query": name,
                                    "path": "aliases",
                                    "score": {"boost": {"value": 1}},
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
                    # Add exact match bonus for the primary name
                    "exactMatchBonus": {
                        "$cond": {
                            "if": {"$eq": [{"$toLower": "$name"}, {"$toLower": name}]},
                            "then": 1000,  # High bonus for exact matches
                            "else": 0,
                        }
                    },
                }
            },
            {
                "$addFields": {
                    "finalScore": {"$add": ["$searchScore", "$exactMatchBonus"]}
                }
            },
            {
                "$sort": {"finalScore": -1, "levelPriority": 1}
            },  # Sort by final score first, then level priority
            {"$limit": 1},  # Get the highest priority match
        ]

        results = await Region.aggregate(pipeline, projection_model=Region).to_list()

        if results:
            return results[0]
        return None

    async def get_autocomplete_suggestions(
        self, search_term: str
    ) -> list[LocationAutocompleteSuggestion]:
        search_term = search_term.strip()
        if not search_term:
            return []
        pipeline = [
            {
                "$search": {
                    "index": REGION_SEARCH_INDEX_NAME,
                    "compound": {
                        "should": [
                            # Exact match on name (highest priority)
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "name",
                                    "score": {"boost": {"value": 10}},
                                }
                            },
                            # Exact match on aliases (high priority for colloquial names)
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "aliases",
                                    "score": {"boost": {"value": 8}},
                                }
                            },
                            # Autocomplete match on name (high priority)
                            {
                                "autocomplete": {
                                    "query": search_term,
                                    "path": "name",
                                    "score": {"boost": {"value": 5}},
                                }
                            },
                            # Autocomplete match on aliases (medium priority)
                            {
                                "autocomplete": {
                                    "query": search_term,
                                    "path": "aliases",
                                    "score": {"boost": {"value": 3}},
                                }
                            },
                            # Fuzzy match on name (lower priority for typo tolerance)
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "name",
                                    "fuzzy": {"maxEdits": 1},
                                    "score": {"boost": {"value": 2}},
                                }
                            },
                            # Fuzzy match on aliases (lowest priority)
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "aliases",
                                    "fuzzy": {"maxEdits": 1},
                                    "score": {"boost": {"value": 1}},
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
                    # Bonus for exact match on primary name
                    "nameExactMatchBonus": {
                        "$cond": {
                            "if": {
                                "$eq": [
                                    {"$toLower": "$name"},
                                    {"$toLower": search_term},
                                ]
                            },
                            "then": 1000,
                            "else": 0,
                        }
                    },
                    # Bonus for exact match on any alias
                    "aliasExactMatchBonus": {
                        "$cond": {
                            "if": {
                                "$in": [
                                    {"$toLower": search_term},
                                    {
                                        "$map": {
                                            "input": {"$ifNull": ["$aliases", []]},
                                            "as": "alias",
                                            "in": {"$toLower": "$$alias"},
                                        }
                                    },
                                ]
                            },
                            "then": 800,  # Slightly less than name match
                            "else": 0,
                        }
                    },
                    # Bonus for starts-with on primary name
                    "nameStartsWithBonus": {
                        "$cond": {
                            "if": {
                                "$regexMatch": {
                                    "input": {"$toLower": "$name"},
                                    "regex": f"^{search_term.lower()}",
                                }
                            },
                            "then": 100,
                            "else": 0,
                        }
                    },
                    # Build contextual display name (e.g., "Velacheri, Chennai, Tamil Nadu")
                    "contextualName": {
                        "$concat": [
                            "$name",
                            {
                                "$cond": {
                                    "if": {"$ne": ["$address.address_locality", None]},
                                    "then": {
                                        "$concat": [
                                            ", ",
                                            {
                                                "$ifNull": [
                                                    "$address.address_locality",
                                                    "",
                                                ]
                                            },
                                        ]
                                    },
                                    "else": "",
                                }
                            },
                            {
                                "$cond": {
                                    "if": {"$ne": ["$address.address_region", None]},
                                    "then": {
                                        "$concat": [
                                            ", ",
                                            {
                                                "$ifNull": [
                                                    "$address.address_region",
                                                    "",
                                                ]
                                            },
                                        ]
                                    },
                                    "else": "",
                                }
                            },
                        ]
                    },
                }
            },
            {
                "$addFields": {
                    "finalScore": {
                        "$add": [
                            "$searchScore",
                            "$nameExactMatchBonus",
                            "$aliasExactMatchBonus",
                            "$nameStartsWithBonus",
                        ]
                    }
                }
            },
            {
                "$project": {
                    "searchScore": 1,
                    "levelPriority": 1,
                    "finalScore": 1,
                    "level": 1,
                    "name": 1,
                    "contextualName": 1,
                    "aliases": 1,
                    "coordinates": 1,
                    "geometry": 1,
                    "address": 1,
                }
            },
            # Sort by final score (including bonuses) and then by level priority
            {"$sort": {"finalScore": -1, "levelPriority": 1}},
            # Fetch exactly what we need (no over-fetching)
            {"$limit": DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT},
        ]

        results = await Region.aggregate(pipeline).to_list()

        # Build suggestions with contextual display names
        suggestions: list[LocationAutocompleteSuggestion] = []
        seen_coordinates: set[tuple[float, float]] = set()

        for result in results:
            # Extract coordinates from GeoJSON Point format
            coords = result["coordinates"]["coordinates"]  # [longitude, latitude]
            coords_tuple = (coords[0], coords[1])

            # Skip if we've already seen this exact coordinate
            if coords_tuple in seen_coordinates:
                continue

            # Mark these coordinates as seen
            seen_coordinates.add(coords_tuple)

            place_id = str(uuid.uuid4())

            # Use contextual name for better UX
            display_name = result.get("contextualName", result["name"])

            suggestions.append(
                LocationAutocompleteSuggestion(
                    place_id=place_id,
                    level=result["level"],
                    address=Address(
                        display_name=display_name,
                        street_address=result["address"].get("street_address"),
                        address_locality=result["address"].get("address_locality"),
                        address_region=result["address"].get("address_region"),
                        country=result["address"].get("country"),
                        postal_code=result["address"].get("postal_code"),
                    ),
                    coordinates=coords_tuple,  # (longitude, latitude)
                )
            )

        return suggestions
