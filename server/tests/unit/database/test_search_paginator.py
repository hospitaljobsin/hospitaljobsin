from unittest.mock import AsyncMock, Mock

import pytest
from app.base.models import BaseSearchable
from app.database.paginator import SearchPaginator
from beanie import Document


class MockDocument(Document):
    name: str
    score: float

    class Settings:
        name = "mock_collection"


class MockSearchProjection(BaseSearchable):
    name: str
    score: float


class TestSearchPaginatorValidateArguments:
    def test_first_only_valid(self):
        result = SearchPaginator.validate_arguments(
            first=10, last=None, before=None, after=None
        )
        assert result == 10

    def test_last_only_valid(self):
        result = SearchPaginator.validate_arguments(
            first=None, last=10, before=None, after=None
        )
        assert result == 10

    def test_first_with_after_valid(self):
        result = SearchPaginator.validate_arguments(
            first=10, last=None, before=None, after="token"
        )
        assert result == 10

    def test_last_with_before_valid(self):
        result = SearchPaginator.validate_arguments(
            first=None, last=10, before="token", after=None
        )
        assert result == 10

    def test_first_and_last_raises_error(self):
        with pytest.raises(ValueError, match="Cannot provide both `first` and `last`"):
            SearchPaginator.validate_arguments(
                first=10, last=10, before=None, after=None
            )

    def test_after_and_before_raises_error(self):
        with pytest.raises(
            ValueError, match="Cannot provide both `after` and `before`"
        ):
            SearchPaginator.validate_arguments(
                first=10, last=None, before="token", after="token"
            )

    def test_first_negative_raises_error(self):
        with pytest.raises(ValueError, match="`first` must be a positive integer"):
            SearchPaginator.validate_arguments(
                first=-1, last=None, before=None, after=None
            )

    def test_first_zero_raises_error(self):
        with pytest.raises(ValueError, match="`first` must be a positive integer"):
            SearchPaginator.validate_arguments(
                first=0, last=None, before=None, after=None
            )

    def test_first_exceeds_limit_raises_error(self):
        with pytest.raises(ValueError, match="`first` exceeds pagination limit"):
            SearchPaginator.validate_arguments(
                first=101, last=None, before=None, after=None
            )

    def test_first_at_limit_valid(self):
        result = SearchPaginator.validate_arguments(
            first=100, last=None, before=None, after=None
        )
        assert result == 100

    def test_first_with_before_raises_error(self):
        with pytest.raises(
            ValueError, match="`first` cannot be provided with `before`"
        ):
            SearchPaginator.validate_arguments(
                first=10, last=None, before="token", after=None
            )

    def test_last_negative_raises_error(self):
        with pytest.raises(ValueError, match="`last` must be a positive integer"):
            SearchPaginator.validate_arguments(
                first=None, last=-1, before=None, after=None
            )

    def test_last_zero_raises_error(self):
        with pytest.raises(ValueError, match="`last` must be a positive integer"):
            SearchPaginator.validate_arguments(
                first=None, last=0, before=None, after=None
            )

    def test_last_exceeds_limit_raises_error(self):
        with pytest.raises(ValueError, match="`last` exceeds pagination limit"):
            SearchPaginator.validate_arguments(
                first=None, last=101, before=None, after=None
            )

    def test_last_at_limit_valid(self):
        result = SearchPaginator.validate_arguments(
            first=None, last=100, before=None, after=None
        )
        assert result == 100

    def test_last_with_after_raises_error(self):
        with pytest.raises(ValueError, match="`last` cannot be provided with `after`"):
            SearchPaginator.validate_arguments(
                first=None, last=10, before=None, after="token"
            )

    def test_no_first_or_last_raises_error(self):
        with pytest.raises(
            ValueError, match="You must provide either `first` or `last` to paginate"
        ):
            SearchPaginator.validate_arguments(
                first=None, last=None, before=None, after=None
            )


class TestSearchPaginatorEmpty:
    def test_empty_without_total_count(self):
        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = paginator.empty()

        assert result.entities == []
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None
        assert result.total_count is None

    def test_empty_with_total_count(self):
        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            calculate_total_count=True,
        )
        result = paginator.empty()

        assert result.entities == []
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None
        assert result.total_count == 0


class TestSearchPaginatorPaginate:
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

    @pytest.fixture
    def search_query(self):
        return {
            "$search": {
                "index": "test_index",
                "text": {"query": "test", "path": "name"},
            }
        }

    async def test_forward_pagination_first_page(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor == "token1"
        assert result.page_info.end_cursor == "token2"
        assert result.total_count is None

    async def test_forward_pagination_has_next_page(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
            {"name": "item3", "score": 0.7, "pagination_token": "token3"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is True
        assert result.page_info.has_previous_page is False

    async def test_forward_pagination_with_after(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(
            search_query=search_query, first=2, after="token1"
        )

        assert len(result.entities) == 1
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is True

    async def test_backward_pagination_last_page(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, last=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False

    async def test_backward_pagination_has_previous_page(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
            {"name": "item3", "score": 0.7, "pagination_token": "token3"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, last=2)

        assert len(result.entities) == 2
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is True

    async def test_backward_pagination_with_before(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(
            search_query=search_query, last=2, before="token2"
        )

        assert len(result.entities) == 1
        assert result.page_info.has_next_page is True
        assert result.page_info.has_previous_page is False

    async def test_empty_results(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=10)

        assert len(result.entities) == 0
        assert result.page_info.has_next_page is False
        assert result.page_info.has_previous_page is False
        assert result.page_info.start_cursor is None
        assert result.page_info.end_cursor is None

    async def test_with_total_count(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {
                "data": [{"name": "item1", "score": 0.9, "pagination_token": "token1"}],
                "meta": [{"count": {"total": 5}}],
            }
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            calculate_total_count=True,
        )
        result = await paginator.paginate(search_query=search_query, first=1)

        assert len(result.entities) == 1
        assert result.total_count == 5

    async def test_with_total_count_empty_meta(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [{"data": [], "meta": []}]

        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            calculate_total_count=True,
        )
        result = await paginator.paginate(search_query=search_query, first=1)

        assert len(result.entities) == 0
        assert result.total_count == 0

    async def test_with_minimum_score(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            minimum_score=0.8,
        )
        result = await paginator.paginate(search_query=search_query, first=1)

        assert len(result.entities) == 1

    async def test_backward_pagination_reverses_entities(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item3", "score": 0.7, "pagination_token": "token3"},
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, last=2)

        assert len(result.entities) == 2
        assert result.entities[0].name == "item1"
        assert result.entities[1].name == "item2"

    async def test_single_result(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=10)

        assert len(result.entities) == 1
        assert result.page_info.start_cursor == result.page_info.end_cursor

    async def test_exact_limit_results(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {
                "name": f"item{i}",
                "score": 1.0 - i * 0.1,
                "pagination_token": f"token{i}",
            }
            for i in range(1, 11)
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=10)

        assert len(result.entities) == 10
        assert result.page_info.has_next_page is False

    async def test_search_after_token_in_pipeline(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        await paginator.paginate(search_query=search_query, first=1, after="test_token")

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]
        assert pipeline[0]["$search"]["searchAfter"] == "test_token"

    async def test_search_before_token_in_pipeline(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        await paginator.paginate(search_query=search_query, last=1, before="test_token")

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]
        assert pipeline[0]["$search"]["searchBefore"] == "test_token"

    async def test_count_added_to_search_when_calculate_total_count(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [{"data": [], "meta": []}]

        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            calculate_total_count=True,
        )
        await paginator.paginate(search_query=search_query, first=1)

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]
        assert "count" in pipeline[0]["$search"]
        assert pipeline[0]["$search"]["count"]["type"] == "total"

    async def test_minimum_score_adds_score_filter(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument,
            projection_model=MockSearchProjection,
            minimum_score=0.5,
        )
        await paginator.paginate(search_query=search_query, first=1)

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]

        has_score_field = any(
            "$addFields" in stage and "searchScore" in stage["$addFields"]
            for stage in pipeline
        )
        assert has_score_field

        has_score_filter = any(
            "$match" in stage and "searchScore" in stage["$match"] for stage in pipeline
        )
        assert has_score_filter

    async def test_pagination_token_added_to_results(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        await paginator.paginate(search_query=search_query, first=1)

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]

        has_pagination_token = any(
            "$addFields" in stage and "pagination_token" in stage["$addFields"]
            for stage in pipeline
        )
        assert has_pagination_token

    async def test_limit_plus_one_applied(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = []

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        await paginator.paginate(search_query=search_query, first=5)

        call_args = MockDocument.aggregate.call_args
        pipeline = call_args[0][0]

        limit_stage = next((stage for stage in pipeline if "$limit" in stage), None)
        assert limit_stage is not None
        assert limit_stage["$limit"] == 6

    async def test_non_dict_results_filtered_out(
        self, initialize_test_database, mock_document_aggregate, search_query
    ):
        mock_document_aggregate.to_list.return_value = [
            {"name": "item1", "score": 0.9, "pagination_token": "token1"},
            "invalid_result",
            {"name": "item2", "score": 0.8, "pagination_token": "token2"},
        ]

        paginator = SearchPaginator(
            document_cls=MockDocument, projection_model=MockSearchProjection
        )
        result = await paginator.paginate(search_query=search_query, first=3)

        assert len(result.entities) == 2
        assert result.entities[0].name == "item1"
        assert result.entities[1].name == "item2"
