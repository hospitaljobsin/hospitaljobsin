import asyncio

from app.accounts.documents import Account
from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.core.constants import (
    JOB_APPLICANT_EMBEDDING_DIMENSIONS,
    JOB_EMBEDDING_DIMENSIONS,
)
from app.database import initialize_database
from app.embeddings.services import EmbeddingsService
from app.jobs.documents import Job, JobApplicant
from app.jobs.repositories import JobApplicantRepo, JobRepo


async def re_embed_docs():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    container = create_container()
    async with container.context() as ctx:
        embeddings_service = await ctx.resolve(EmbeddingsService)
        job_applicant_repo = await ctx.resolve(JobApplicantRepo)

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
            dimensions=JOB_EMBEDDING_DIMENSIONS,
        )
        await job.save()
        print("Reindexed Job ", job.id)

    job_applicants = await JobApplicant.find_all().to_list()
    for job_applicant in job_applicants:
        await job_applicant.fetch_link(JobApplicant.account)
        account = job_applicant.account
        await account.fetch_link(Account.profile)
        job_applicant.profile_embedding = await embeddings_service.generate_embeddings(
            text=job_applicant_repo.format_profile_snapshot_for_embedding(
                account.profile
            ),
            task_type="RETRIEVAL_DOCUMENT",
            dimensions=JOB_APPLICANT_EMBEDDING_DIMENSIONS,
        )
        await job_applicant.save()
        print("Reindexed job applicant ", job_applicant.id)


if __name__ == "__main__":
    asyncio.run(re_embed_docs())
