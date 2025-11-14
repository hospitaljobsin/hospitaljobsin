from tests.integration.graphql_client import GraphQLClient

AUTOCOMPLETE_LOCATIONS_QUERY = """
query AutocompleteLocationsQuery($searchTerm: String!) {
    autocompleteLocations(searchTerm: $searchTerm) {
        locations {
            placeId
            level
            address {
                displayName
                streetAddress
                addressLocality
                addressRegion
                country
                postalCode
            }
        }
    }
}
"""


async def test_autocomplete_exact_match(
    graphql_client: GraphQLClient,
) -> None:
    """Test exact match returns the location."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "Mumbai"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    assert any("Mumbai" in loc["address"]["displayName"] for loc in data["locations"])
    assert data["locations"][0]["level"] == "LOCALITY"


async def test_autocomplete_partial_match(
    graphql_client: GraphQLClient,
) -> None:
    """Test partial match returns matching locations."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "Mum"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    assert any("Mumbai" in loc["address"]["displayName"] for loc in data["locations"])


async def test_autocomplete_alias_match(
    graphql_client: GraphQLClient,
) -> None:
    """Test alias match returns the location."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "Bombay"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    assert any("Mumbai" in loc["address"]["displayName"] for loc in data["locations"])


async def test_autocomplete_case_insensitive(
    graphql_client: GraphQLClient,
) -> None:
    """Test case insensitive search."""
    response_lower = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "mumbai"},
    )

    response_upper = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "MUMBAI"},
    )

    assert "errors" not in response_lower
    assert "errors" not in response_upper

    lower_locations = response_lower["data"]["autocompleteLocations"]["locations"]
    upper_locations = response_upper["data"]["autocompleteLocations"]["locations"]

    assert len(lower_locations) == len(upper_locations)
    assert (
        lower_locations[0]["address"]["displayName"]
        == upper_locations[0]["address"]["displayName"]
    )


async def test_autocomplete_multiple_results(
    graphql_client: GraphQLClient,
) -> None:
    """Test search returning multiple results."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "India"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1


async def test_autocomplete_no_results(
    graphql_client: GraphQLClient,
) -> None:
    """Test search with no matching results."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "NonExistentCity"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) == 0


async def test_autocomplete_empty_search_term(
    graphql_client: GraphQLClient,
) -> None:
    """Test search with empty string."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": ""},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) == 0


async def test_autocomplete_priority_by_level(
    graphql_client: GraphQLClient,
) -> None:
    """Test that results are prioritized by level."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "India"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    assert data["locations"][0]["level"] == "COUNTRY"


async def test_autocomplete_starts_with_bonus(
    graphql_client: GraphQLClient,
) -> None:
    """Test that names starting with search term are prioritized."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "Ban"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    assert "Bangalore" in data["locations"][0]["address"]["displayName"]


async def test_autocomplete_all_region_levels(
    graphql_client: GraphQLClient,
) -> None:
    """Test that all region levels are returned correctly."""
    test_cases = [
        ("India", "COUNTRY"),
        ("Maharashtra", "STATE"),
        ("Mumbai", "LOCALITY"),
    ]

    for search_term, expected_level in test_cases:
        response = await graphql_client(
            AUTOCOMPLETE_LOCATIONS_QUERY,
            variables={"searchTerm": search_term},
        )

        assert "errors" not in response
        data = response["data"]["autocompleteLocations"]

        assert len(data["locations"]) >= 1
        assert data["locations"][0]["level"] == expected_level


async def test_autocomplete_address_fields(
    graphql_client: GraphQLClient,
) -> None:
    """Test that address fields are populated correctly."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "Mumbai"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) >= 1
    location = data["locations"][0]

    assert "Mumbai" in location["address"]["displayName"]
    assert location["address"]["addressLocality"] == "Mumbai"
    assert location["address"]["addressRegion"] == "Maharashtra"
    assert location["address"]["country"] == "IN"


async def test_autocomplete_place_id_unique(
    graphql_client: GraphQLClient,
) -> None:
    """Test that each location has a unique place ID."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "India"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    place_ids = [loc["placeId"] for loc in data["locations"]]
    assert len(place_ids) == len(set(place_ids))


async def test_autocomplete_results_limit(
    graphql_client: GraphQLClient,
) -> None:
    """Test that results are limited to a reasonable number."""
    response = await graphql_client(
        AUTOCOMPLETE_LOCATIONS_QUERY,
        variables={"searchTerm": "a"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteLocations"]

    assert len(data["locations"]) <= 10
