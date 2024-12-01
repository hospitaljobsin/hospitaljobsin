from collections.abc import Sequence
from dataclasses import dataclass
from typing import Generic, TypeVar

from beanie import Document
from beanie.odm.queries.find import FindMany

from app.lib.constants import MAX_PAGINATION_LIMIT

ModelType = TypeVar("ModelType", bound=Document)

CursorType = TypeVar("CursorType", int, str)


@dataclass
class PageInfo(Generic[CursorType]):
    has_next_page: bool
    has_previous_page: bool
    start_cursor: CursorType | None
    end_cursor: CursorType | None


@dataclass
class PaginatedResult(Generic[ModelType, CursorType]):
    entities: Sequence[ModelType]
    page_info: PageInfo[CursorType]


class Paginator(Generic[ModelType, CursorType]):
    def __init__(
        self,
        *,
        document_cls: type[Document],
        reverse: bool = False,
    ) -> None:
        self._document_cls = document_cls
        self._reverse = reverse

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
        self, *, search_criteria: FindMany[ModelType], last: int | None
    ) -> FindMany[ModelType]:
        """Apply ordering on the search criteria."""
        if (self._reverse and last is None) or (last is not None and not self._reverse):
            return search_criteria.sort("-id")
        return search_criteria.sort("+id")

    def __apply_filters(
        self,
        *,
        search_criteria: FindMany[ModelType],
        before: CursorType | None,
        after: CursorType | None,
    ) -> FindMany[ModelType]:
        """Apply pagination filters on the search criteria."""
        if after is not None:
            direction = (
                self._document_cls.id < after
                if self._reverse
                else self._document_cls.id > after
            )
            return search_criteria.find(direction)
        if before is not None:
            direction = (
                self._document_cls.id > before
                if self._reverse
                else self._document_cls.id < before
            )
            return search_criteria.find(direction)
        return search_criteria

    async def paginate(
        self,
        *,
        search_criteria: FindMany[ModelType],
        last: int | None = None,
        first: int | None = None,
        before: CursorType | None = None,
        after: CursorType | None = None,
    ) -> PaginatedResult[ModelType, CursorType]:
        """Paginate the given search criteria."""
        pagination_limit = self.__validate_arguments(
            first=first,
            last=last,
            before=before,
            after=after,
        )

        search_criteria = self.__apply_ordering(
            search_criteria=search_criteria, last=last
        )
        search_criteria = self.__apply_filters(
            search_criteria=search_criteria, before=before, after=after
        )
        search_criteria = search_criteria.limit(pagination_limit + 1)

        results = await search_criteria.to_list()
        entities = results[:pagination_limit]

        if last is not None:
            entities = list(reversed(entities))
            has_next_page = before is not None
            has_previous_page = len(results) > pagination_limit
        else:
            # we are paginating forwards by default
            has_next_page = len(results) > pagination_limit
            has_previous_page = after is not None

        start_cursor = getattr(entities[0], "id") if entities else None
        end_cursor = getattr(entities[-1], "id") if entities else None

        return PaginatedResult(
            entities=entities,
            page_info=PageInfo(
                has_next_page=has_next_page,
                has_previous_page=has_previous_page,
                start_cursor=start_cursor,
                end_cursor=end_cursor,
            ),
        )
