import asyncio
from collections.abc import AsyncGenerator
from typing import Any

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo

from tests.helpers.pagination import (
    assert_backward_pagination_has_previous,
    assert_empty_results,
    assert_forward_pagination_has_next,
    assert_forward_pagination_with_after,
    assert_full_pagination_flow,
)
from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

ORGANIZATIONS_QUERY = """
query OrganizationsQuery($first: Int, $last: Int, $before: ID, $after: ID, $searchTerm: String) {
    organizations(first: $first, last: $last, before: $before, after: $after, searchTerm: $searchTerm) {
        edges {
            node {
                id
                name
                slug
                website
                description
                logoUrl
                bannerUrl
                location
                email
                createdAt
            }
            cursor
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        totalCount
    }
}
"""


@pytest.fixture(scope="module")
async def valid_organizations(
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> AsyncGenerator[list[Organization]]:
    """Create multiple test organizations."""
    orgs = []
    org_members = []

    org1 = await organization_repo.create(
        name="Apollo Hospital",
        slug=generate_test_slug(),
        description="Leading healthcare provider in cardiology",
        website="https://apollo.com/",
        location="Chennai, Tamil Nadu",
    )
    orgs.append(org1)
    org_members.append(
        await organization_member_repo.create(
            account=password_account,
            organization_id=org1.id,
            role="admin",
        )
    )

    org2 = await organization_repo.create(
        name="Fortis Healthcare",
        slug=generate_test_slug(),
        description="Multi-specialty hospital chain",
        website="https://fortis.com/",
        location="Mumbai, Maharashtra",
    )
    orgs.append(org2)
    org_members.append(
        await organization_member_repo.create(
            account=password_account,
            organization_id=org2.id,
            role="admin",
        )
    )

    org3 = await organization_repo.create(
        name="Max Healthcare",
        slug=generate_test_slug(),
        description="Premium healthcare services",
        website="https://max.com/",
        location="Delhi, NCR",
    )
    orgs.append(org3)
    org_members.append(
        await organization_member_repo.create(
            account=password_account,
            organization_id=org3.id,
            role="admin",
        )
    )

    await asyncio.sleep(1.5)
    yield orgs

    for org_member in org_members:
        await organization_member_repo.delete(org_member)
    for org in orgs:
        await organization_repo.delete(org)


async def test_organizations_query_without_search_term(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query without search term returns all organizations."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 3
    assert data["totalCount"] >= 3
    assert data["pageInfo"]["hasNextPage"] is False
    assert data["pageInfo"]["hasPreviousPage"] is False


async def test_organizations_query_search_by_name(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term matching organization name."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "Apollo"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1
    assert any(edge["node"]["name"] == "Apollo Hospital" for edge in data["edges"])


async def test_organizations_query_search_by_description(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term matching description."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "cardiology"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1
    assert any(
        "cardiology" in edge["node"]["description"].lower()
        for edge in data["edges"]
        if edge["node"]["description"]
    )


async def test_organizations_query_search_by_location(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term matching location."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "Chennai"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1
    assert any(
        "Chennai" in edge["node"]["location"]
        for edge in data["edges"]
        if edge["node"]["location"]
    )


async def test_organizations_query_search_partial_match(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with partial search term."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "Healthcare"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1
    matching_names = [edge["node"]["name"] for edge in data["edges"]]
    assert any("Healthcare" in name for name in matching_names)


async def test_organizations_query_search_case_insensitive(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query search is case-insensitive."""
    response_lower = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "apollo"},
    )
    response_upper = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "APOLLO"},
    )

    data_lower = response_lower["data"]["organizations"]
    data_upper = response_upper["data"]["organizations"]

    assert len(data_lower["edges"]) == len(data_upper["edges"])
    assert len(data_lower["edges"]) >= 1


async def test_organizations_query_search_no_results(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term that matches nothing."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    await assert_empty_results(
        paginate_orgs, {"searchTerm": "nonexistentorganization12345"}
    )


async def test_organizations_query_search_empty_string(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with empty search term returns all organizations."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": ""},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 3


async def test_organizations_query_search_with_special_characters(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with special characters in search term."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "@#$%^&*()"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) == 0


async def test_organizations_query_search_with_pagination_first(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term and forward pagination."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    await assert_forward_pagination_has_next(
        paginate_orgs, {"searchTerm": "Healthcare"}, 1, 2
    )


async def test_organizations_query_search_with_pagination_after(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term and after cursor."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    first_page = await paginate_orgs({"first": 1, "searchTerm": "Healthcare"})
    end_cursor = first_page["pageInfo"]["endCursor"]

    second_page = await assert_forward_pagination_with_after(
        paginate_orgs, {"searchTerm": "Healthcare"}, end_cursor, 1
    )

    first_ids = {edge["node"]["id"] for edge in first_page["edges"]}
    second_ids = {edge["node"]["id"] for edge in second_page["edges"]}
    assert first_ids.isdisjoint(second_ids)


async def test_organizations_query_search_with_pagination_last(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term and backward pagination."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    await assert_backward_pagination_has_previous(
        paginate_orgs, {"searchTerm": "Healthcare"}, 1
    )


async def test_organizations_query_search_with_pagination_before(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with search term and before cursor."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    last_page = await paginate_orgs({"last": 1, "searchTerm": "Healthcare"})
    start_cursor = last_page["pageInfo"]["startCursor"]

    prev_response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"last": 1, "before": start_cursor, "searchTerm": "Healthcare"},
    )
    assert "errors" not in prev_response
    prev_data = prev_response["data"]["organizations"]

    last_ids = {edge["node"]["id"] for edge in last_page["edges"]}
    prev_ids = {edge["node"]["id"] for edge in prev_data["edges"]}
    assert last_ids.isdisjoint(prev_ids)


async def test_organizations_query_search_multiple_words(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with multi-word search term."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "Apollo Hospital"},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1
    assert any(edge["node"]["name"] == "Apollo Hospital" for edge in data["edges"])


async def test_organizations_query_search_with_whitespace(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test organizations query with whitespace in search term."""
    response = await graphql_client(
        ORGANIZATIONS_QUERY,
        variables={"first": 10, "searchTerm": "  Apollo  "},
    )

    data = response["data"]["organizations"]
    assert len(data["edges"]) >= 1


async def test_organizations_query_search_total_count_accuracy(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test that totalCount is accurate when using search term."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    result = await paginate_orgs({"first": 1, "searchTerm": "Healthcare"})
    total_count = result["totalCount"]

    all_result = await paginate_orgs({"first": 100, "searchTerm": "Healthcare"})
    assert len(all_result["edges"]) == total_count


async def test_organizations_query_pagination_consistency(
    graphql_client: GraphQLClient,
    valid_organizations: list[Organization],
) -> None:
    """Test pagination consistency across multiple requests."""

    async def paginate_orgs(params: dict[str, Any]) -> dict[str, Any]:
        response = await graphql_client(ORGANIZATIONS_QUERY, variables=params)
        assert "errors" not in response
        return response["data"]["organizations"]

    await assert_full_pagination_flow(paginate_orgs, {}, 2, 3)
