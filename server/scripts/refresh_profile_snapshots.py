import asyncio

from app.accounts.documents import BaseProfile
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
    job_applicants = await JobApplicant.find_all(
        fetch_links=True, nesting_depth=2
    ).to_list()
    print(job_applicants)
    for job_applicant in job_applicants:
        print(job_applicant.analysis)

        job_applicant.profile_snapshot = BaseProfile(
            open_to_relocation_anywhere=job_applicant.account.profile.open_to_relocation_anywhere,
            education=job_applicant.account.profile.education,
            licenses=job_applicant.account.profile.licenses,
            languages=job_applicant.account.profile.languages,
            job_preferences=job_applicant.account.profile.job_preferences,
            work_experience=job_applicant.account.profile.work_experience,
            salary_expectations=job_applicant.account.profile.salary_expectations,
            certifications=job_applicant.account.profile.certifications,
            professional_summary=job_applicant.account.profile.professional_summary,
            headline=job_applicant.account.profile.headline,
            locations_open_to_work=job_applicant.account.profile.locations_open_to_work,
            gender=job_applicant.account.profile.gender,
            date_of_birth=job_applicant.account.profile.date_of_birth,
            address=job_applicant.account.profile.address,
        )
        await job_applicant.save()

        await analysis_service.analyse_job_applicant(
            job_application=job_applicant,
            job=job_applicant.job,
        )


if __name__ == "__main__":
    asyncio.run(insert_missing_analysis())
