import asyncio

from app.config import DatabaseSettings, SecretSettings, get_settings
from app.core.genai_client import create_google_genai_client
from app.database import initialize_database
from app.embeddings.services import EmbeddingsService
from app.jobs.documents import ApplicationField, Job
from app.jobs.repositories import JobRepo

# Arbitrary list of application questions
DEFAULT_FIELDS = [
    ApplicationField(
        field_name="Why are you interested in this job?", is_required=True
    ),
    ApplicationField(field_name="Describe your relevant experience.", is_required=True),
    ApplicationField(field_name="When can you start?", is_required=False),
]


async def re_embed_docs():
    embeddings_service = EmbeddingsService(
        genai_client=create_google_genai_client(settings=get_settings(SecretSettings))
    )
    async with initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    ):
        jobs = await Job.find_all().to_list()
        for job in jobs:
            job.embedding = await embeddings_service.generate_embeddings(
                text=JobRepo.format_job_for_embedding(
                    title=job.title,
                    description=job.description,
                    skills=job.skills,
                    location=job.location,
                    geo=job.geo,
                    min_salary=job.min_salary,
                    max_salary=job.max_salary,
                    min_experience=job.min_experience,
                    max_experience=job.max_experience,
                    job_type=job.type,
                    work_mode=job.work_mode,
                    currency=job.currency,
                ),
                task_type="SEMANTIC_SIMILARITY",
            )
            await job.save()


if __name__ == "__main__":
    asyncio.run(re_embed_docs())
