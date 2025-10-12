from unittest.mock import AsyncMock, MagicMock, Mock

import pytest
from app.database.paginator import Paginator
from beanie import Document
from beanie.odm.queries.aggregation import AggregationQuery
from beanie.odm.queries.find import FindMany
from bson import ObjectId
from pydantic import BaseModel


class MockDocument(Document):
    name: str
    created_at: str

    class Settings:
        name = "mock_collection"


class MockProjection(BaseModel):
    name: str
    created_at: str


class TestPaginatorValidateArguments:
    def test_first_only_valid(self):
        result = Paginator.validate_arguments(
            first=10, last=None, before=None, after=None
        )
        assert result == 10

    def test_last_only_valid(self):
        result = Paginator.validate_arguments(
            first=None, last=10, before=None, after=None
        )
        assert result == 10

    def test_first_with_after_valid(self):
        result = Paginator.validate_arguments(
            first=10, last=None, before=None, after="cursor"
        )
        assert result == 10

    def test_last_with_before_valid(self):
        result = Paginator.validate_arguments(
            first=None, last=10, before="cursor", after=None
        )
        assert result == 10

    def test_first_and_last_raises_error(self):
        with pytest.raises(ValueError, match="Cannot provide both `first` and `last`"):
            Paginator.validate_arguments(first=10, last=10, before=None, after=None)

    def test_after_and_before_raises_error(self):
        with pytest.raises(
            ValueError, match="Cannot provide both `after` and `before`"
        ):
            Paginator.validate_arguments(
                first=10, last=None, before="cursor", after="cursor"
            )

    def test_first_negative_raises_error(self):
        with pytest.raises(ValueError, match="`first` must be a positive integer"):
            Paginator.validate_arguments(first=-1, last=None, before=None, after=None)

    def test_first_zero_raises_error(self):
        with pytest.raises(ValueError, match="`first` must be a positive integer"):
            Paginator.validate_arguments(first=0, last=None, before=None, after=None)

    def test_first_exceeds_limit_raises_error(self):
        with pytest.raises(ValueError, match="`first` exceeds pagination limit"):
            Paginator.validate_arguments(first=101, last=None, before=None, after=None)

    def test_first_at_limit_valid(self):
        result = Paginator.validate_arguments(
            first=100, last=None, before=None, after=None
        )
        assert result == 100

    def test_first_with_before_raises_error(self):
        with pytest.raises(
            ValueError, match="`first` cannot be provided with `before`"
        ):
            Paginator.validate_arguments(
                first=10, last=None, before="cursor", after=None
            )

    def test_last_negative_raises_error(self):
        with pytest.raises(ValueError, match="`last` must be a positive integer"):
            Paginator.validate_arguments(first=None, last=-1, before=None, after=None)

    def test_last_zero_raises_error(self):
        with pytest.raises(ValueError, match="`last` must be a positive integer"):
            Paginator.validate_arguments(first=None, last=0, before=None, after=None)

    def test_last_exceeds_limit_raises_error(self):
        with pytest.raises(ValueError, match="`last` exceeds pagination limit"):
            Paginator.validate_arguments(first=None, last=101, before=None, after=None)

    def test_last_at_limit_valid(self):
        result = Paginator.validate_arguments(
            first=None, last=100, before=None, after=None
        )
        assert result == 100

    def test_last_with_after_raises_error(self):
        with pytest.raises(ValueError, match="`last` cannot be provided with `after`"):
            Paginator.validate_arguments(
                first=None, last=10, before=None, after="cursor"
            )

    def test_no_first_or_last_raises_error(self):
        with pytest.raises(
            ValueError, match="You must provide either `first` or `last` to paginate"
        ):
            Paginator.validate_arguments(first=None, last=None, before=None, after=None)


class TestPaginatorEmpty:
    def test_empty_without_total_count(self):
        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = paginator.empty()

        assert result.entities == []
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None
        assert result.total_count is None

    def test_empty_with_total_count(self):
        paginator = Paginator(
            document_cls=MockDocument,
            paginate_by="created_at",
            calculate_total_count=True,
        )
        result = paginator.empty()

        assert result.entities == []
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None
        assert result.total_count == 0


class TestPaginatorPaginate:
    @pytest.fixture
    def mock_find_many(self):
        find_many = Mock(spec=FindMany)
        find_many.build_aggregation_pipeline = Mock(return_value=[])
        find_many.get_projection_model = Mock(return_value=None)
        return find_many

    @pytest.fixture
    def mock_aggregation_query(self):
        agg_query = Mock(spec=AggregationQuery)
        agg_query.get_aggregation_pipeline.return_value = []
        agg_query.get_projection_model.return_value = MockProjection
        return agg_query

    @pytest.fixture
    def mock_document_aggregate(self, monkeypatch):
        mock_agg = AsyncMock()
        mock_agg.to_list = AsyncMock()

        def aggregate_side_effect(*args, **kwargs):
            return mock_agg

        monkeypatch.setattr(
            MockDocument, "aggregate", Mock(side_effect=aggregate_side_effect)
        )
        return mock_agg

    async def test_forward_pagination_first_page(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
            MockProjection(name="item2", created_at="2024-01-02"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, first=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor == "2024-01-01"
        assert result.page_info.end_cursor == "2024-01-02"
        assert result.total_count is None

    async def test_forward_pagination_has_next_page(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
            MockProjection(name="item2", created_at="2024-01-02"),
            MockProjection(name="item3", created_at="2024-01-03"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, first=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is True
        assert result.page_info.has_previous_page is False

    async def test_forward_pagination_with_after(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item2", created_at="2024-01-02"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(
            search_criteria=mock_find_many, first=2, after="2024-01-01"
        )

        assert len(result.entities) == 1
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is True

    async def test_backward_pagination_last_page(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
            MockProjection(name="item2", created_at="2024-01-02"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, last=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False

    async def test_backward_pagination_has_previous_page(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
            MockProjection(name="item2", created_at="2024-01-02"),
            MockProjection(name="item3", created_at="2024-01-03"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, last=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is True

    async def test_backward_pagination_with_before(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(
            search_criteria=mock_find_many, last=2, before="2024-01-02"
        )

        assert len(result.entities) == 1
        assert result.page_info.has_next_page is True
        assert result.page_info.has_previous_page is False

    async def test_empty_results(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, first=10)

        assert len(result.entities) == 0
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None

    async def test_with_total_count(
        self, initialize_test_database, mock_document_aggregate
    ):
        mock_find_many = MagicMock(
            spec=FindMany
        )  # Unsubscripted spec for generic runtime_checkable protocols
        mock_find_many.build_aggregation_pipeline = []
        mock_find_many.get_projection_model = None
        # No need for manual 'model' or __class__; spec handles the structure

        mock_document_aggregate.to_list.return_value = [
            {
                "data": [{"name": "item1", "created_at": "2024-01-01"}],
                "totalCount": 5,
            }
        ]

        paginator = Paginator(
            document_cls=MockDocument,
            paginate_by="created_at",
            calculate_total_count=True,
        )
        result = await paginator.paginate(search_criteria=mock_find_many, first=1)

        assert len(result.entities) == 1
        assert result.total_count == 5

    async def test_reverse_ordering(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item2", created_at="2024-01-02"),
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(
            document_cls=MockDocument, paginate_by="created_at", reverse=True
        )
        result = await paginator.paginate(search_criteria=mock_find_many, first=2)

        assert len(result.entities) == 2

    async def test_no_ordering(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(
            document_cls=MockDocument, paginate_by="created_at", apply_ordering=False
        )
        result = await paginator.paginate(search_criteria=mock_find_many, first=1)

        assert len(result.entities) == 1

    async def test_custom_entity_paginate_by(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(
            document_cls=MockDocument,
            paginate_by="created_at",
            entity_paginate_by="name",
        )
        result = await paginator.paginate(search_criteria=mock_find_many, first=1)

        assert result.page_info.start_cursor == "item1"
        assert result.page_info.end_cursor == "item1"

    async def test_callable_search_criteria(
        self, initialize_test_database, mock_document_aggregate
    ):
        mock_find_many = Mock(spec=FindMany)
        mock_find_many.build_aggregation_pipeline.return_value = []
        mock_find_many.get_projection_model.return_value = None

        def search_criteria_factory(limit: int):
            return mock_find_many

        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(
            search_criteria=search_criteria_factory, first=1
        )

        assert len(result.entities) == 1

    async def test_async_callable_search_criteria(
        self, initialize_test_database, mock_document_aggregate
    ):
        mock_find_many = Mock(spec=FindMany)
        mock_find_many.build_aggregation_pipeline.return_value = []
        mock_find_many.get_projection_model.return_value = None

        async def search_criteria_factory(limit: int):
            return mock_find_many

        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(
            search_criteria=search_criteria_factory, first=1
        )

        assert len(result.entities) == 1

    async def test_aggregation_query(
        self, initialize_test_database, mock_aggregation_query, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(
            search_criteria=mock_aggregation_query, first=1
        )

        assert len(result.entities) == 1

    async def test_objectid_cursor(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        class MockDocWithId(BaseModel):
            model_config = {"arbitrary_types_allowed": True}
            id: ObjectId
            name: str

        obj_id = ObjectId()
        mock_document_aggregate.to_list.return_value = [
            MockDocWithId(id=obj_id, name="item1"),
        ]

        paginator = Paginator(
            document_cls=MockDocument, paginate_by="id", entity_paginate_by="id"
        )
        result = await paginator.paginate(search_criteria=mock_find_many, first=1)

        assert result.page_info.start_cursor == obj_id
        assert result.page_info.end_cursor == obj_id

    async def test_backward_pagination_reverses_entities(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item3", created_at="2024-01-03"),
            MockProjection(name="item2", created_at="2024-01-02"),
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, last=2)

        assert len(result.entities) == 2
        assert result.entities[0].name == "item1"
        assert result.entities[1].name == "item2"

    async def test_single_result(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name="item1", created_at="2024-01-01"),
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, first=10)

        assert len(result.entities) == 1
        assert result.page_info.start_cursor == result.page_info.end_cursor

    async def test_exact_limit_results(
        self, initialize_test_database, mock_find_many, mock_document_aggregate
    ):
        mock_document_aggregate.to_list.return_value = [
            MockProjection(name=f"item{i}", created_at=f"2024-01-{i:02d}")
            for i in range(1, 11)
        ]

        paginator = Paginator(document_cls=MockDocument, paginate_by="created_at")
        result = await paginator.paginate(search_criteria=mock_find_many, first=10)

        assert len(result.entities) == 10
        assert result.page_info.has_next_page is False
