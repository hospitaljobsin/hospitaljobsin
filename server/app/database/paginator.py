import operator
from collections.abc import Awaitable, Callable, Mapping, Sequence
from dataclasses import dataclass
from inspect import isawaitable
from typing import Any, Generic, TypeVar

from beanie import Document
from beanie.odm.queries.aggregation import AggregationQuery
from beanie.odm.queries.find import FindMany
from bson import ObjectId

from app.core.constants import MAX_PAGINATION_LIMIT

ModelType = TypeVar("ModelType", bound=Document)

ProjectionModelType = TypeVar("ProjectionModelType", bound=Document, default=ModelType)

CursorType = TypeVar("CursorType", str, ObjectId)


@dataclass
class PageInfo(Generic[CursorType]):
    has_next_page: bool
    has_previous_page: bool
    start_cursor: CursorType | None
    end_cursor: CursorType | None
    total_count: int | None


@dataclass
class PaginatedResult(Generic[ModelType, CursorType]):
    entities: Sequence[ModelType]
    page_info: PageInfo[CursorType]


class Paginator(Generic[ModelType, CursorType, ProjectionModelType]):
    def __init__(
        self,
        *,
        document_cls: type[ModelType],
        paginate_by: str,
        reverse: bool = False,
        apply_ordering: bool = True,
        calculate_total_count: bool = False,
    ) -> None:
        self._document_cls = document_cls
        self._reverse = reverse
        self._paginate_by = paginate_by
        self._apply_ordering = apply_ordering
        self._calculate_total_count = calculate_total_count

    @staticmethod
    def __validate_arguments(  # noqa: C901
        *,
        first: int | None,
        last: int | None,
        before: CursorType | None,
        after: CursorType | None,
    ) -> int:
        """Validate pagination arguments."""
        if first is not None and last is not None:
            first_and_last_error = "Cannot provide both `first` and `last`"
            raise ValueError(first_and_last_error)

        if after is not None and before is not None:
            after_and_before_error = "Cannot provide both `after` and `before`"
            raise ValueError(after_and_before_error)

        if first is not None:
            if first < 0:
                first_not_positive_error = "`first` must be a positive integer"
                raise ValueError(first_not_positive_error)
            if first > MAX_PAGINATION_LIMIT:
                max_pagination_limit_error = f"`first` exceeds pagination limit of {MAX_PAGINATION_LIMIT} records"
                raise ValueError(max_pagination_limit_error)
            if before is not None:
                first_and_before_error = "`first` cannot be provided with `before`"
                raise ValueError(first_and_before_error)
            return first

        if last is not None:
            if last < 0:
                last_not_positive_error = "`last` must be a positive integer"
                raise ValueError(last_not_positive_error)
            if last > MAX_PAGINATION_LIMIT:
                max_pagination_limit_error = (
                    f"`last` exceeds pagination limit of {MAX_PAGINATION_LIMIT} records"
                )
                raise ValueError(max_pagination_limit_error)
            if after is not None:
                last_and_after_error = "`last` cannot be provided with `after`"
                raise ValueError(last_and_after_error)
            return last

        no_first_and_last_error = (
            "You must provide either `first` or `last` to paginate"
        )
        raise ValueError(no_first_and_last_error)

    def __apply_ordering(
        self,
        *,
        pipeline: list[Mapping[str, Any]],
        last: int | None,
    ) -> list[Mapping[str, Any]]:
        """Apply ordering on the search criteria."""
        if not self._apply_ordering:
            return pipeline

        if (self._reverse and last is None) or (last is not None and not self._reverse):
            pipeline.append({"$sort": {self._paginate_by: -1}})
            return pipeline

        pipeline.append({"$sort": {self._paginate_by: 1}})
        return pipeline

    def __apply_filters(
        self,
        *,
        pipeline: list[Mapping[str, Any]],
        before: CursorType | None,
        after: CursorType | None,
    ) -> list[Mapping[str, Any]]:
        """Apply pagination filters on the search criteria."""
        if after is not None:
            search_filter = (
                {"$match": {self._paginate_by: {"$lt": after}}}
                if self._reverse
                else {"$match": {self._paginate_by: {"$gt": after}}}
            )
            pipeline.append(search_filter)
            return pipeline
        if before is not None:
            search_filter = (
                {"$match": {self._paginate_by: {"$gt": before}}}
                if self._reverse
                else {"$match": {self._paginate_by: {"$lt": before}}}
            )
            pipeline.append(search_filter)
            return pipeline
        return pipeline

    async def paginate(
        self,
        *,
        search_criteria: FindMany[ProjectionModelType]
        | AggregationQuery[ProjectionModelType]
        | Callable[
            [int],
            FindMany[ProjectionModelType]
            | AggregationQuery[ProjectionModelType]
            | Awaitable[FindMany[ProjectionModelType]]
            | Awaitable[AggregationQuery[ProjectionModelType]],
        ],
        last: int | None = None,
        first: int | None = None,
        before: CursorType | None = None,
        after: CursorType | None = None,
    ) -> PaginatedResult[ProjectionModelType, CursorType]:
        """Paginate the given search criteria."""
        pagination_limit = self.__validate_arguments(
            first=first,
            last=last,
            before=before,
            after=after,
        )

        resolved_search_criteria: (
            FindMany[ProjectionModelType] | AggregationQuery[ProjectionModelType]
        )

        if callable(search_criteria):
            temp_search_criteria = search_criteria(pagination_limit)
            if isawaitable(temp_search_criteria):
                temp_search_criteria = await temp_search_criteria
            resolved_search_criteria = temp_search_criteria
        else:
            resolved_search_criteria = search_criteria

        if isinstance(resolved_search_criteria, FindMany):
            pipeline = resolved_search_criteria.build_aggregation_pipeline()
            projection_model = (
                resolved_search_criteria.get_projection_model() or self._document_cls
            )
        else:
            pipeline = resolved_search_criteria.get_aggregation_pipeline()
            projection_model = resolved_search_criteria.get_projection_model()
        pipeline = self.__apply_ordering(pipeline=pipeline, last=last)
        pipeline = self.__apply_filters(pipeline=pipeline, before=before, after=after)

        pipeline.append({"$limit": pagination_limit + 1})

        total_count = None

        if self._calculate_total_count:
            facet_pipeline = [
                {
                    "$facet": {
                        "data": pipeline,
                        "totalCount": [{"$count": "count"}],
                    }
                },
                {
                    "$project": {
                        "data": 1,
                        "totalCount": {
                            "$ifNull": [{"$arrayElemAt": ["$totalCount.count", 0]}, 0]
                        },
                    }
                },
            ]

            facet_results = await self._document_cls.aggregate(
                facet_pipeline, projection_model=None
            ).to_list()
            results = [
                projection_model(**result)
                for result in facet_results[0].get("data", [])
            ]
            total_count = facet_results[0]["totalCount"]
        else:
            results = await self._document_cls.aggregate(
                pipeline, projection_model=projection_model
            ).to_list()
        entities = results[:pagination_limit]

        if last is not None:
            entities = list(reversed(entities))
            has_next_page = before is not None
            has_previous_page = len(results) > pagination_limit
        else:
            # we are paginating forwards by default
            has_next_page = len(results) > pagination_limit
            has_previous_page = after is not None

        start_cursor = (
            operator.attrgetter(self._paginate_by)(entities[0]) if entities else None
        )
        end_cursor = (
            operator.attrgetter(self._paginate_by)(entities[-1]) if entities else None
        )

        return PaginatedResult(
            entities=entities,
            page_info=PageInfo(
                has_next_page=has_next_page,
                has_previous_page=has_previous_page,
                start_cursor=start_cursor,
                end_cursor=end_cursor,
                total_count=total_count,
            ),
        )
