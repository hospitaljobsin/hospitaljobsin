from unittest.mock import AsyncMock, Mock

import pytest
from app.database.paginator import TextSearchPaginator
from bson import ObjectId
from pydantic import BaseModel


class MockDocument(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    id: ObjectId
    name: str
    description: str


@pytest.fixture
def mock_document_cls():
    mock_cls = Mock()
    mock_cls.__name__ = "MockDocument"
    return mock_cls


@pytest.fixture
def mock_aggregate(mock_document_cls):
    mock_agg = AsyncMock()
    mock_agg.to_list = AsyncMock()
    mock_document_cls.aggregate = Mock(return_value=mock_agg)
    return mock_agg


def test_validate_arguments_first_only():
    result = TextSearchPaginator.validate_arguments(
        first=10, last=None, before=None, after=None
    )
    assert result == 10


def test_validate_arguments_last_only():
    result = TextSearchPaginator.validate_arguments(
        first=None, last=10, before=None, after=None
    )
    assert result == 10


def test_validate_arguments_first_and_last_raises_error():
    with pytest.raises(ValueError, match="Cannot provide both `first` and `last`"):
        TextSearchPaginator.validate_arguments(
            first=10, last=10, before=None, after=None
        )


def test_validate_arguments_no_first_or_last_raises_error():
    with pytest.raises(
        ValueError, match="You must provide either `first` or `last` to paginate"
    ):
        TextSearchPaginator.validate_arguments(
            first=None, last=None, before=None, after=None
        )


def test_empty_without_total_count(mock_document_cls):
    paginator = TextSearchPaginator(document_cls=mock_document_cls, paginate_by="_id")
    result = paginator.empty()

    assert result.entities == []
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is False
    assert result.page_info.start_cursor is None
    assert result.page_info.end_cursor is None
    assert result.total_count is None


def test_empty_with_total_count(mock_document_cls):
    paginator = TextSearchPaginator(
        document_cls=mock_document_cls,
        paginate_by="_id",
        calculate_total_count=True,
    )
    result = paginator.empty()

    assert result.entities == []
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is False
    assert result.page_info.start_cursor is None
    assert result.page_info.end_cursor is None
    assert result.total_count == 0


async def test_forward_pagination_first_page(mock_document_cls, mock_aggregate):
    obj_id_1 = ObjectId()
    obj_id_2 = ObjectId()
    mock_aggregate.to_list.return_value = [
        MockDocument(id=obj_id_1, name="item1", description="desc1"),
        MockDocument(id=obj_id_2, name="item2", description="desc2"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=2)

    assert len(result.entities) == 2
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is False
    assert result.page_info.start_cursor == obj_id_1
    assert result.page_info.end_cursor == obj_id_2
    assert result.total_count is None


async def test_forward_pagination_has_next_page(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name="item1", description="desc1"),
        MockDocument(id=ObjectId(), name="item2", description="desc2"),
        MockDocument(id=ObjectId(), name="item3", description="desc3"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=2)

    assert len(result.entities) == 2
    assert result.page_info.has_next_page is True
    assert result.page_info.has_previous_page is False


async def test_forward_pagination_with_after(mock_document_cls, mock_aggregate):
    obj_id = ObjectId()
    mock_aggregate.to_list.return_value = [
        MockDocument(id=obj_id, name="item2", description="desc2"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=2, after=ObjectId())

    assert len(result.entities) == 1
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is True


async def test_backward_pagination_last_page(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name="item1", description="desc1"),
        MockDocument(id=ObjectId(), name="item2", description="desc2"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", last=2)

    assert len(result.entities) == 2
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is False


async def test_backward_pagination_has_previous_page(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name="item1", description="desc1"),
        MockDocument(id=ObjectId(), name="item2", description="desc2"),
        MockDocument(id=ObjectId(), name="item3", description="desc3"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", last=2)

    assert len(result.entities) == 2
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is True


async def test_backward_pagination_with_before(mock_document_cls, mock_aggregate):
    obj_id = ObjectId()
    mock_aggregate.to_list.return_value = [
        MockDocument(id=obj_id, name="item1", description="desc1"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", last=2, before=ObjectId())

    assert len(result.entities) == 1
    assert result.page_info.has_next_page is True
    assert result.page_info.has_previous_page is False


async def test_empty_results(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = []

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=10)

    assert len(result.entities) == 0
    assert result.page_info.has_next_page is False
    assert result.page_info.has_previous_page is False
    assert result.page_info.start_cursor is None
    assert result.page_info.end_cursor is None


async def test_with_total_count(mock_document_cls, mock_aggregate):
    obj_id = ObjectId()
    mock_aggregate.to_list.return_value = [
        {
            "data": [{"_id": obj_id, "name": "item1", "description": "desc1"}],
            "totalCount": 5,
        }
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls,
        paginate_by="_id",
        entity_paginate_by="id",
        calculate_total_count=True,
    )
    result = await paginator.paginate(search_term="test", first=1)

    assert len(result.entities) == 1
    assert result.total_count == 5


async def test_backward_pagination_reverses_entities(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name="item3", description="desc3"),
        MockDocument(id=ObjectId(), name="item2", description="desc2"),
        MockDocument(id=ObjectId(), name="item1", description="desc1"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", last=2)

    assert len(result.entities) == 2
    assert result.entities[0].name == "item1"
    assert result.entities[1].name == "item2"


async def test_single_result(mock_document_cls, mock_aggregate):
    obj_id = ObjectId()
    mock_aggregate.to_list.return_value = [
        MockDocument(id=obj_id, name="item1", description="desc1"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=10)

    assert len(result.entities) == 1
    assert result.page_info.start_cursor == result.page_info.end_cursor


async def test_exact_limit_results(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name=f"item{i}", description=f"desc{i}")
        for i in range(1, 11)
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls, paginate_by="_id", entity_paginate_by="id"
    )
    result = await paginator.paginate(search_term="test", first=10)

    assert len(result.entities) == 10
    assert result.page_info.has_next_page is False


async def test_custom_entity_paginate_by(mock_document_cls, mock_aggregate):
    mock_aggregate.to_list.return_value = [
        MockDocument(id=ObjectId(), name="item1", description="desc1"),
    ]

    paginator = TextSearchPaginator(
        document_cls=mock_document_cls,
        paginate_by="_id",
        entity_paginate_by="name",
    )
    result = await paginator.paginate(search_term="test", first=1)

    assert result.page_info.start_cursor == "item1"
    assert result.page_info.end_cursor == "item1"
