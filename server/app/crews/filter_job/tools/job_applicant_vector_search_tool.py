from typing import Any

from app.core.constants import (
    RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD,
    JobApplicantStatus,
)
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
        status: JobApplicantStatus | None = None,
    ) -> list[JobApplicant]:
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
                }
            },
        ]

        if status is not None:
            pipeline.append({"$match": {"job.$id": ObjectId(job_id), "status": status}})
        else:
            pipeline.append({"$match": {"job.$id": ObjectId(job_id)}})
        pipeline.extend(
            [
                {"$addFields": {"search_score": {"$meta": "vectorSearchScore"}}},
                {
                    "$match": {
                        "search_score": {
                            "$gte": RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD
                        }
                    }
                },
                {"$sort": {"search_score": -1}},
            ]
        )

        results = await JobApplicant.aggregate(
            pipeline, projection_model=JobApplicant
        ).to_list()
        print("results:", results)
        return results

    def _run(
        self,
        job_id: str,
        query: str,
    ) -> list[dict[str, Any]]:
        """Run the tool to find relevant job applicants."""
        raise NotImplementedError("Use _arun for async execution")
