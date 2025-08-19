import asyncio

from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.jobs.documents import JobApplicant
from app.jobs.services import JobApplicantAnalysisService


async def insert_missing_analysis():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    container = create_container()
    async with container.context() as ctx:
        analysis_service = await ctx.resolve(JobApplicantAnalysisService)
    job_applicants = await JobApplicant.find(
        JobApplicant.analysis == None, fetch_links=True, nesting_depth=2
    ).to_list()
    print(f"Found {len(job_applicants)} job applicants")
    for job_applicant in job_applicants:
        print(
            f"Analysing job applicant {job_applicant.id} for job {job_applicant.job.id}"
        )
        await analysis_service.analyse_job_applicant(
            job_application=job_applicant,
            job=job_applicant.job,
        )


if __name__ == "__main__":
    asyncio.run(insert_missing_analysis())
