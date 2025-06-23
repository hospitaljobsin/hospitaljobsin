import time

from app.accounts.repositories import ProfileRepo
from app.config import SecretSettings, get_settings
from app.core.constants import JobApplicantStatus
from app.core.genai_client import create_google_genai_client
from app.crews.filter_job.models import FilterJobResultData, ProfileMatch
from app.embeddings.services import EmbeddingsService
from crewai import Agent, Task
from pydantic import BaseModel

from .tools.job_applicant_vector_search_tool import JobApplicantVectorSearchTool
from .tools.profile_analyzer_tool import ProfileAnalyzerTool
from .tools.query_parser_tool import QueryParserTool


class FilterCriteria(BaseModel):
    """Structured filter criteria for job matching."""

    gender: str | None = None
    marital_status: str | None = None
    category: str | None = None
    min_age: int | None = None
    max_age: int | None = None
    locations: list[str] | None = None
    open_to_relocation: bool | None = None
    min_experience_years: int | None = None
    languages: list[str] | None = None
    min_salary: int | None = None
    max_salary: int | None = None
    job_preferences: list[str] | None = None


class FilterJobCrew:
    """Crew for filtering and matching job profiles based on natural language queries."""

    def __init__(self) -> None:
        secret_settings = get_settings(SecretSettings)
        genai_client = create_google_genai_client(settings=secret_settings)
        embedding_service = EmbeddingsService(genai_client=genai_client)

        self.query_parser = QueryParserTool()
        self.profile_analyzer = ProfileAnalyzerTool()
        self.vector_search = JobApplicantVectorSearchTool(
            embedding_service=embedding_service,
        )
        self.profile_repo = ProfileRepo()

    def create_agents(self) -> list[Agent]:
        """Create the agents for the filter job crew."""
        query_parser_agent = Agent(
            role="Query Parser",
            goal="Parse natural language queries into structured requirements",
            backstory="Expert at understanding and extracting requirements from natural language queries",
            tools=[self.query_parser],
            verbose=True,
        )

        profile_analyzer_agent = Agent(
            role="Profile Analyzer",
            goal="First, use the vector search tool to find relevant applicants. Then, analyze their profiles against requirements using both structured filters and LLM analysis.",
            backstory="Expert at matching profiles to job requirements using multiple analysis methods",
            tools=[self.profile_analyzer, self.vector_search],
            verbose=True,
        )

        return [query_parser_agent, profile_analyzer_agent]

    def create_tasks(self, query: str, max_results: int = 10) -> list[Task]:
        """Create the tasks for the filter job crew."""
        parse_query_task = Task(
            description=f"Parse the following query into structured requirements: {query}",
            agent=self.create_agents()[0],
            expected_output="A JSON object containing structured filters and the original query.",
        )

        analyze_profiles_task = Task(
            description="Use the vector search tool to find applicant profiles, then analyze them against the parsed requirements.",
            agent=self.create_agents()[1],
            expected_output="A list of dictionaries, where each dictionary represents a profile analysis.",
        )

        return [parse_query_task, analyze_profiles_task]

    async def run(
        self,
        job_id: str,
        query: str,
        max_results: int = 10,
        status: JobApplicantStatus | None = None,
    ) -> FilterJobResultData:
        """Run the filter job crew."""
        start_time = time.time()

        applicants = await self.vector_search._arun(
            job_id=job_id,
            query=query,
            status=status,
        )
        if not applicants:
            return FilterJobResultData(
                matches=[],
                total_matches=0,
                query=query,
                execution_time=time.time() - start_time,
            )

        # Parse query
        parse_result = await self.query_parser._arun(query)

        # Analyze each profile
        matches = []
        for applicant in applicants:
            profile = applicant.profile_snapshot
            analysis = await self.profile_analyzer._arun(
                profile=profile, query_context=parse_result
            )

            matches.append(
                ProfileMatch(
                    applicant_id=str(applicant.id),
                    score=analysis["score"],
                    match_reasons=analysis["matchReasons"],
                    mismatched_fields=analysis["mismatchedFields"],
                    summary=analysis["summary"],
                    match_type=analysis["matchType"],
                )
            )

        # Sort by score and get top results
        matches.sort(key=lambda x: x.score, reverse=True)
        top_matches = matches[:max_results]

        execution_time = time.time() - start_time

        print("matches:", matches)

        return FilterJobResultData(
            matches=[match.dict() for match in top_matches],
            total_matches=len(matches),
            query=query,
            execution_time=execution_time,
        )
