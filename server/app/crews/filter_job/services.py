from app.crews.filter_job.crew import FilterJobCrew
from app.crews.filter_job.models import FilterJobResultData


class AgenticProfileFilterService:
    """Service for filtering job profiles using AI crew."""

    def __init__(self) -> None:
        self._crew = FilterJobCrew()

    async def filter_profiles(
        self,
        query: str,
        max_results: int | None = 10,
    ) -> FilterJobResultData:
        """Filter profiles based on natural language query."""
        return await self._crew.run(query=query, max_results=max_results)
