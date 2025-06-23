from app.core.constants import JobApplicantStatus
from app.crews.filter_job.crew import FilterJobCrew
from app.database.paginator import PageInfo, PaginatedResult
from app.jobs.documents import JobApplicant


class AgenticProfileFilterService:
    """Service for filtering job profiles using AI crew."""

    def __init__(self) -> None:
        self._crew = FilterJobCrew()

    async def filter_profiles(
        self,
        query: str,
        job_id: str,
        status: JobApplicantStatus | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobApplicant, str]:
        """Filter profiles based on natural language query."""
        # Since the crew doesn't support pagination, we fetch all results
        # and paginate in memory. This is not ideal for very large datasets.
        all_applicants = await self._crew.run(query=query, job_id=job_id, status=status)

        print("all applicants", all_applicants)

        total_count = len(all_applicants)
        start_index = 0
        end_index = total_count

        if after:
            try:
                after_index = next(
                    i for i, app in enumerate(all_applicants) if app.slug == after
                )
                start_index = after_index + 1
            except StopIteration:
                start_index = total_count  # slug not found, return empty list

        if before:
            try:
                before_index = next(
                    i for i, app in enumerate(all_applicants) if app.slug == before
                )
                end_index = before_index
            except StopIteration:
                end_index = 0  # slug not found, return empty list

        if first is not None:
            end_index = min(end_index, start_index + first)

        if last is not None:
            start_index = max(0, end_index - last)

        items = all_applicants[start_index:end_index]

        has_next_page = end_index < total_count
        has_previous_page = start_index > 0

        start_cursor = items[0].slug if items else None
        end_cursor = items[-1].slug if items else None

        return PaginatedResult(
            entities=items,
            page_info=PageInfo(
                has_next_page=has_next_page,
                has_previous_page=has_previous_page,
                start_cursor=start_cursor,
                end_cursor=end_cursor,
            ),
        )
