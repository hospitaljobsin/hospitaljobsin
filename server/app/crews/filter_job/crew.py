import time

from app.accounts.repositories import ProfileRepo
from app.ai.models import FilterJobResultData, ProfileMatch
from crewai import Agent, Task
from pydantic import BaseModel

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
        self.query_parser = QueryParserTool()
        self.profile_analyzer = ProfileAnalyzerTool()
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
            goal="Analyze profiles against requirements using both structured filters and LLM analysis",
            backstory="Expert at matching profiles to job requirements using multiple analysis methods",
            tools=[self.profile_analyzer],
            verbose=True,
        )

        return [query_parser_agent, profile_analyzer_agent]

    def create_tasks(self, query: str, max_results: int = 10) -> list[Task]:
        """Create the tasks for the filter job crew."""
        parse_query_task = Task(
            description=f"Parse the following query into structured requirements: {query}",
            agent=self.create_agents()[0],
        )

        analyze_profiles_task = Task(
            description="Analyze profiles against the parsed requirements",
            agent=self.create_agents()[1],
        )

        return [parse_query_task, analyze_profiles_task]

    async def run(self, query: str, max_results: int = 10) -> FilterJobResultData:
        """Run the filter job crew."""
        start_time = time.time()

        # Parse query
        parse_result = await self.query_parser._arun(query)
        structured_filters = parse_result["structured_filters"]

        # Get initial filtered profiles using structured filters
        filtered_profiles = await self.profile_repo.filter_profiles(
            locations=structured_filters.get("location_requirements", {}).get(
                "locations", []
            ),
            min_experience_years=structured_filters.get(
                "experience_requirements", {}
            ).get("min_years"),
            min_salary=structured_filters.get("salary_requirements", {}).get(
                "min_salary"
            ),
            max_salary=structured_filters.get("salary_requirements", {}).get(
                "max_salary"
            ),
        )

        # Analyze each profile
        matches = []
        for profile in filtered_profiles:
            analysis = await self.profile_analyzer._arun(
                profile=profile, query_context=parse_result
            )

            matches.append(
                ProfileMatch(
                    profile_id=str(profile.id),
                    score=analysis["total_score"],
                    match_reasons=analysis["match_reasons"],
                )
            )

        # Sort by score and get top results
        matches.sort(key=lambda x: x.score, reverse=True)
        top_matches = matches[:max_results]

        execution_time = time.time() - start_time

        return FilterJobResultData(
            matches=[match.dict() for match in top_matches],
            total_matches=len(matches),
            query=query,
            execution_time=execution_time,
        )
