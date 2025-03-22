from collections.abc import Awaitable, Callable
from typing import TypeVar

from bson import ObjectId

T = TypeVar("T")

K = TypeVar("K")


async def load_many_entities(
    keys: list[K],
    repo_method: Callable[[list[K]], Awaitable[list[T]]],
    key_transform: Callable[[K], K | None] = lambda x: x,
) -> list[T | None]:
    """
    Load entities by keys (IDs, slugs, etc.).

    :param keys: A list of keys (e.g., IDs or slugs).
    :param repo_method: The repository method to fetch data (e.g., repo.get_many_by_ids).
    :param key_transform: Function to transform keys (e.g., convert to ObjectId).
    :return: A list of entities matching the keys, preserving the original order.
    """
    # Transform and validate keys
    valid_keys: list[K] = [
        key for key in (key_transform(key) for key in keys) if key is not None
    ]

    # Fetch data using the provided repo method
    fetched_entities = await repo_method(valid_keys)

    # Map results back to original keys
    key_to_entity_map = dict(
        zip(
            valid_keys,
            fetched_entities,
            strict=False,
        )
    )

    # Return entities in the original key order, with None for invalid/missing keys
    return [
        key_to_entity_map.get(transformed_key)
        if (transformed_key := key_transform(key)) is not None
        else None
        for key in keys
    ]


def transform_valid_object_id(key: str) -> ObjectId | None:
    """Check if a string is a valid ObjectId."""
    return ObjectId(key) if ObjectId.is_valid(key) else None
