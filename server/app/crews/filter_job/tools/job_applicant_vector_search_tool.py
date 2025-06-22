from typing import Any

from app.embeddings.services import EmbeddingsService
from app.jobs.documents import JobApplicant
from bson import ObjectId
from crewai.tools import BaseTool
from pydantic import BaseModel, ConfigDict, Field


class JobApplicantVectorSearchToolInput(BaseModel):
    """Input for JobApplicantVectorSearchTool."""

    job_id: str = Field(..., description="The ID of the job to search within.")
    query: str = Field(
        ..., description="The natural language search query from the recruiter."
    )


class JobApplicantVectorSearchTool(BaseTool):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = "Job Applicant Vector Search Tool"
    description: str = "Searches for job applicants using vector similarity based on a query and job ID."
    args_schema: type[BaseModel] = JobApplicantVectorSearchToolInput
    embedding_service: EmbeddingsService

    async def _arun(
        self,
        job_id: str,
        query: str,
    ) -> list[dict[str, Any]]:
        """Run the tool to find relevant job applicants."""
        query_embedding = await self.embedding_service.generate_embeddings(
            text=query,
            task_type="RETRIEVAL_QUERY",
        )

        top_n = 25
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "job_applicant_embedding_vector_index",
                    "path": "profile_embedding",
                    "queryVector": query_embedding,
                    "numCandidates": top_n * 4,
                    "limit": top_n,
                    "filter": {"job": ObjectId(job_id)},
                }
            },
            {
                "$project": {
                    "id": {"$toString": "$_id"},
                    "slug": 1,
                    "status": 1,
                    "account_full_name": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ]

        results = await JobApplicant.aggregate(pipeline).to_list()
        return results

    def _run(
        self,
        job_id: str,
        query: str,
    ) -> list[dict[str, Any]]:
        """Run the tool to find relevant job applicants."""
        raise NotImplementedError("Use _arun for async execution")
