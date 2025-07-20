import asyncio
from datetime import UTC, datetime

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.jobs.documents import ApplicationField, Job, JobApplicationForm
from pymongo.errors import DuplicateKeyError

# Arbitrary list of application questions
DEFAULT_FIELDS = [
    ApplicationField(
        field_name="Why are you interested in this job?", is_required=True
    ),
    ApplicationField(field_name="Describe your relevant experience.", is_required=True),
    ApplicationField(field_name="When can you start?", is_required=False),
]


async def insert_missing_job_application_forms():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )
    jobs = await Job.find_all().to_list()
    count_created = 0
    for job in jobs:
        existing_form = await JobApplicationForm.find_one({"job.$id": job.id})
        if existing_form:
            continue
        form = JobApplicationForm(
            job=job,  # type: ignore[arg-type]
            fields=DEFAULT_FIELDS,
            updated_at=datetime.now(UTC),
        )
        try:
            await form.insert()
            print(f"Created JobApplicationForm for job: {job.title} (id={job.id})")
            count_created += 1
        except DuplicateKeyError:
            print(
                f"DuplicateKeyError: JobApplicationForm already exists for job: {job.title} (id={job.id})"
            )
    print(f"Inserted {count_created} missing JobApplicationForm documents.")


if __name__ == "__main__":
    asyncio.run(insert_missing_job_application_forms())
