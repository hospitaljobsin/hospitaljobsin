from collections.abc import Awaitable, Callable
from typing import TypeVar

from bson import ObjectId
from strawberry.dataloader import DataLoader

T = TypeVar("T")
U = TypeVar(
    "U", str, tuple[str, str]
)  # the original key type (input), assumed to be a string
K = TypeVar(
    "K", str, ObjectId, tuple[ObjectId, ObjectId]
)  # the transformed key type (could be a str or an ObjectId)


async def load_many_entities(
    keys: list[U],
    repo_method: Callable[[list[K]], Awaitable[list[T | None]]],
    key_transform: Callable[[U], K | None],
) -> list[T | None]:
    """
    Load entities by keys (IDs, slugs, etc.).

    :param keys: A list of keys (e.g., IDs or slugs) as strings.
    :param repo_method: The repository method to fetch data.
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
    key_to_entity_map = dict(zip(valid_keys, fetched_entities, strict=False))

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


def transform_valid_object_id_tuple(
    key: tuple[str, str],
) -> tuple[ObjectId, ObjectId] | None:
    """Check if a string tuple is a valid ObjectId tuple."""
    if len(key) == 2 and ObjectId.is_valid(key[0]) and ObjectId.is_valid(key[1]):  # noqa: PLR2004
        return (ObjectId(key[0]), ObjectId(key[1]))
    return None


def transform_default(key: str) -> str | None:
    """Return the key as is."""
    return key


def create_dataloader(
    repo_method: Callable[[list[K]], Awaitable[list[T | None]]],
    key_transform: Callable[[U], K | None],
) -> DataLoader[U, T | None]:
    async def load_entities(entity_keys: list[U]) -> list[T | None]:
        """Load multiple entities by their keys."""
        return await load_many_entities(
            keys=entity_keys,
            repo_method=repo_method,
            key_transform=key_transform,
        )

    return DataLoader(load_fn=load_entities)
