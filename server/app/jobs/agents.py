from dataclasses import dataclass

from beanie import PydanticObjectId
from bson import ObjectId
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider

from app.config import SecretSettings
from app.core.constants import JobApplicantStatus
from app.database.paginator import PaginatedResult
from app.jobs.documents import Job, JobApplicant
from app.jobs.repositories import JobApplicantRepo


@dataclass
class SupportDependencies:
    job: Job
    job_applicant_repo: JobApplicantRepo
    status: JobApplicantStatus | None = None


class JobApplicantFilteringOutput(BaseModel):
    paginated_result: PaginatedResult[JobApplicant, PydanticObjectId] = Field(
        description="The list of job applicants that are most similar to the query."
    )


type JobApplicantFileringAgent = Agent[SupportDependencies, JobApplicantFilteringOutput]


def create_job_applicant_filtering_agent(
    settings: SecretSettings,
) -> JobApplicantFileringAgent:
    job_applicant_filtering_agent = Agent(
        model=GeminiModel(
            "gemini-2.5-flash-lite-preview-06-17",
            provider=GoogleGLAProvider(
                api_key=settings.google_api_key.get_secret_value(),
            ),
        ),
        deps_type=SupportDependencies,
        output_type=JobApplicantFilteringOutput,
        system_prompt="You are a job applicant filtering agent. You are given a job description and a list of job applicants. You need to filter the list of job applicants to find the best candidates for the job.",
    )

    @job_applicant_filtering_agent.tool
    async def job_applicants_vector_search(
        ctx: RunContext[SupportDependencies], query: str, top_k: int = 10
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Return the top k job applicants that are most similar to the query."""
        return await ctx.deps.job_applicant_repo.vector_search(
            job_id=ctx.deps.job.id,
            query=query,
            top_k=top_k,
            status=ctx.deps.status,
        )

    return job_applicant_filtering_agent
