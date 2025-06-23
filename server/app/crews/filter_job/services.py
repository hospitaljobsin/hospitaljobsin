from app.core.constants import JobApplicantStatus
from app.crews.filter_job.crew import FilterJobCrew
from app.crews.filter_job.models import FilterJobResultData


class AgenticProfileFilterService:
    """Service for filtering job profiles using AI crew."""

    def __init__(self) -> None:
        self._crew = FilterJobCrew()

    async def filter_profiles(
        self,
        query: str,
        job_id: str,
        status: JobApplicantStatus | None = None,
        max_results: int = 10,
    ) -> FilterJobResultData:
        """Filter profiles based on natural language query."""
        return await self._crew.run(
            query=query, job_id=job_id, max_results=max_results, status=status
        )
