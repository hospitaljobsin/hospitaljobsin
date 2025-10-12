from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

import pytest

T = TypeVar("T")


async def assert_forward_pagination_first_page(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    expected_count: int,
) -> dict[str, Any]:
    """Test forward pagination on first page."""
    result = await paginate_fn({"first": expected_count, **filters})
    assert len(result["edges"]) == expected_count
    assert result["pageInfo"]["hasNextPage"] is False
    assert result["pageInfo"]["hasPreviousPage"] is False
    assert result["pageInfo"]["startCursor"] is not None
    assert result["pageInfo"]["endCursor"] is not None
    return result


async def assert_forward_pagination_has_next(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    page_size: int,
    total_count: int,
) -> dict[str, Any]:
    """Test forward pagination when more pages exist."""
    result = await paginate_fn({"first": page_size, **filters})
    assert len(result["edges"]) == page_size
    assert result["pageInfo"]["hasNextPage"] is True
    assert result["pageInfo"]["hasPreviousPage"] is False
    return result


async def assert_forward_pagination_with_after(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    after_cursor: str,
    expected_count: int,
) -> dict[str, Any]:
    """Test forward pagination with after cursor."""
    result = await paginate_fn(
        {"first": expected_count, "after": after_cursor, **filters}
    )
    assert len(result["edges"]) == expected_count, (
        f"Expected {expected_count} edges, got {len(result['edges'])}"
    )
    assert result["pageInfo"]["hasPreviousPage"] is True
    return result


async def assert_backward_pagination_last_page(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    expected_count: int,
) -> dict[str, Any]:
    """Test backward pagination on last page."""
    result = await paginate_fn({"last": expected_count, **filters})
    assert len(result["edges"]) == expected_count
    assert result["pageInfo"]["hasNextPage"] is False
    assert result["pageInfo"]["hasPreviousPage"] is False
    return result


async def assert_backward_pagination_has_previous(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    page_size: int,
) -> dict[str, Any]:
    """Test backward pagination when previous pages exist."""
    result = await paginate_fn({"last": page_size, **filters})
    assert len(result["edges"]) == page_size
    assert result["pageInfo"]["hasPreviousPage"] is True
    assert result["pageInfo"]["hasNextPage"] is False
    return result


async def assert_backward_pagination_with_before(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    before_cursor: str,
    expected_count: int,
) -> dict[str, Any]:
    """Test backward pagination with before cursor."""
    result = await paginate_fn(
        {"last": expected_count, "before": before_cursor, **filters}
    )
    assert len(result["edges"]) == expected_count
    assert result["pageInfo"]["hasNextPage"] is True
    return result


async def assert_empty_results(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> dict[str, Any]:
    """Test pagination with no results."""
    result = await paginate_fn({"first": 10, **filters})
    assert len(result["edges"]) == 0
    assert result["pageInfo"]["hasNextPage"] is False
    assert result["pageInfo"]["hasPreviousPage"] is False
    assert result["pageInfo"]["startCursor"] is None
    assert result["pageInfo"]["endCursor"] is None
    return result


async def assert_pagination_validates_first_and_last(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that providing both first and last raises error."""
    with pytest.raises(Exception, match="Cannot provide both"):
        await paginate_fn({"first": 10, "last": 10, **filters})


async def assert_pagination_validates_after_and_before(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that providing both after and before raises error."""
    with pytest.raises(Exception, match="Cannot provide both"):
        await paginate_fn(
            {"first": 10, "after": "cursor", "before": "cursor", **filters}
        )


async def assert_pagination_validates_first_positive(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that first must be positive."""
    with pytest.raises(Exception, match="must be a positive integer"):
        await paginate_fn({"first": 0, **filters})
    with pytest.raises(Exception, match="must be a positive integer"):
        await paginate_fn({"first": -1, **filters})


async def assert_pagination_validates_last_positive(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that last must be positive."""
    with pytest.raises(Exception, match="must be a positive integer"):
        await paginate_fn({"last": 0, **filters})
    with pytest.raises(Exception, match="must be a positive integer"):
        await paginate_fn({"last": -1, **filters})


async def assert_pagination_validates_limit(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    max_limit: int = 100,
) -> None:
    """Test that pagination limit is enforced."""
    with pytest.raises(Exception, match="exceeds pagination limit"):
        await paginate_fn({"first": max_limit + 1, **filters})
    with pytest.raises(Exception, match="exceeds pagination limit"):
        await paginate_fn({"last": max_limit + 1, **filters})


async def assert_pagination_validates_first_with_before(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that first cannot be used with before."""
    with pytest.raises(Exception, match="cannot be provided with"):
        await paginate_fn({"first": 10, "before": "cursor", **filters})


async def assert_pagination_validates_last_with_after(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that last cannot be used with after."""
    with pytest.raises(Exception, match="cannot be provided with"):
        await paginate_fn({"last": 10, "after": "cursor", **filters})


async def assert_pagination_requires_first_or_last(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
) -> None:
    """Test that either first or last is required."""
    with pytest.raises(Exception, match="must provide either"):
        await paginate_fn({**filters})


async def assert_full_pagination_flow(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    page_size: int,
    total_items: int,
) -> None:
    """Test complete forward pagination flow through all pages."""
    collected_items = []
    after_cursor = None
    page_count = 0

    while True:
        params = {"first": page_size, **filters}
        if after_cursor:
            params["after"] = after_cursor

        result = await paginate_fn(params)
        edges = result["edges"]
        collected_items.extend(edges)
        page_count += 1

        if not result["pageInfo"]["hasNextPage"]:
            break

        after_cursor = result["pageInfo"]["endCursor"]

    assert len(collected_items) == total_items, (
        f"Expected {total_items} items, got {len(collected_items)}"
    )
    assert page_count == (total_items + page_size - 1) // page_size, (
        f"Expected {(total_items + page_size - 1) // page_size} pages, got {page_count}"
    )


async def test_full_backward_pagination_flow(
    paginate_fn: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]],
    filters: dict[str, Any],
    page_size: int,
    total_items: int,
) -> None:
    """Test complete backward pagination flow through all pages."""
    collected_items = []
    before_cursor = None
    page_count = 0

    while True:
        params = {"last": page_size, **filters}
        if before_cursor:
            params["before"] = before_cursor

        result = await paginate_fn(params)
        edges = result["edges"]
        collected_items = edges + collected_items
        page_count += 1

        if not result["pageInfo"]["hasPreviousPage"]:
            break

        before_cursor = result["pageInfo"]["startCursor"]

    assert len(collected_items) == total_items, (
        f"Expected {total_items} items, got {len(collected_items)}"
    )
    assert page_count == (total_items + page_size - 1) // page_size, (
        f"Expected {(total_items + page_size - 1) // page_size} pages, got {page_count}"
    )
