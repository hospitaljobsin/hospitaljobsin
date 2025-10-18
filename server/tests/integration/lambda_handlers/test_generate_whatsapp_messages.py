import json
import zipfile
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest
from app.accounts.documents import Account
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from bson import ObjectId
from lambda_handlers.generate_whatsapp_messages import (
    cleanup_temp_files,
    create_message_files_and_zip,
    format_experience,
    format_job_for_whatsapp_message,
    format_salary,
    process_wa_messages_generation_event,
)


@pytest.fixture
async def test_organization(
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> Organization:
    org = await organization_repo.create(
        name="Test Hospital",
        slug="test-hospital-wa",
        description="Test hospital for WhatsApp messages",
    )
    await organization_member_repo.create(
        organization_id=org.id,
        account=password_account,
        role="admin",
    )
    yield org
    await organization_repo.delete(org)


@pytest.fixture
async def active_job_without_whatsapp_post(
    job_repo: JobRepo,
    test_organization: Organization,
) -> Job:
    job = await job_repo.create(
        organization=test_organization,
        title="Senior Nurse",
        description="Looking for experienced nurses",
        location="Mumbai, Maharashtra",
        min_salary=50000,
        max_salary=80000,
        min_experience=2,
        max_experience=5,
        vacancies=3,
        skills=["Patient Care", "Emergency Response"],
    )
    job.is_active = True
    await job.save()
    await job.fetch_all_links()
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def active_job_already_posted(
    job_repo: JobRepo,
    test_organization: Organization,
) -> Job:
    job = await job_repo.create(
        organization=test_organization,
        title="Junior Doctor",
        description="Entry level position",
        location="Delhi",
        min_salary=100000,
        max_salary=150000,
        vacancies=2,
    )
    job.is_active = True
    job.whatsapp_channel_posted_at = datetime.now(UTC)
    await job.save()
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def expired_job(
    job_repo: JobRepo,
    test_organization: Organization,
) -> Job:
    job = await job_repo.create(
        organization=test_organization,
        title="Expired Position",
        description="This job has expired",
        expires_at=datetime.now(UTC) - timedelta(days=1),
    )
    job.is_active = True
    await job.save()
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def inactive_job(
    job_repo: JobRepo,
    test_organization: Organization,
) -> Job:
    job = await job_repo.create(
        organization=test_organization,
        title="Inactive Position",
        description="This job is inactive",
    )
    yield job
    await job_repo.delete(job)


def test_with_min_and_max_salary() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_salary=50000,
        max_salary=80000,
    )
    assert format_salary(job) == "₹50000 - ₹80000"


def test_with_only_min_salary() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_salary=50000,
        max_salary=None,
    )
    assert format_salary(job) == "From ₹50000"


def test_with_only_max_salary() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_salary=None,
        max_salary=80000,
    )
    assert format_salary(job) == "Up to ₹80000"


def test_with_no_salary() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_salary=None,
        max_salary=None,
    )
    assert format_salary(job) == "Not specified"


def test_with_min_and_max_experience() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_experience=2,
        max_experience=5,
    )
    assert format_experience(job) == "2 - 5 years"


def test_with_only_min_experience() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_experience=2,
        max_experience=None,
    )
    assert format_experience(job) == "From 2 years"


def test_with_only_max_experience() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_experience=None,
        max_experience=5,
    )
    assert format_experience(job) == "Up to 5 years"


def test_with_no_experience() -> None:
    job = Job(
        title="Test",
        description="Test",
        description_cleaned="Test",
        description_html="<p>Test</p>",
        embedding=[],
        skills=[],
        slug="test",
        organization=ObjectId(),
        min_experience=None,
        max_experience=None,
    )
    assert format_experience(job) == "Not specified"


async def test_complete_job_formatting(active_job_without_whatsapp_post: Job):
    message = format_job_for_whatsapp_message(active_job_without_whatsapp_post)

    assert "*Senior Nurse*" in message
    assert "Test Hospital" in message
    assert "*Location:* Mumbai, Maharashtra" in message
    assert "*Salary:* ₹50000 - ₹80000" in message
    assert "*Vacancies:* 3" in message
    assert "*Experience:* 2 - 5 years" in message
    assert "https://hospitaljobs.in/organizations/test-hospital-wa/jobs/" in message


async def test_job_with_missing_fields(
    test_organization: Organization, job_repo: JobRepo
):
    job = await job_repo.create(
        organization=test_organization,
        title="Basic Job",
        description="Minimal job posting",
    )
    job.is_active = True
    await job.save()
    await job.fetch_all_links()

    message = format_job_for_whatsapp_message(job)

    assert "*Basic Job*" in message
    assert "*Location:* Not specified" in message
    assert "*Salary:* Not specified" in message
    assert "*Vacancies:* Not specified" in message
    assert "*Experience:* Not specified" in message

    await job_repo.delete(job)


async def test_creates_zip_with_correct_files(
    active_job_without_whatsapp_post: Job,
):
    messages = [format_job_for_whatsapp_message(active_job_without_whatsapp_post)]
    jobs = [active_job_without_whatsapp_post]

    zip_path = await create_message_files_and_zip(messages, jobs)

    assert Path(zip_path).exists()
    assert zip_path.endswith(".zip")

    with zipfile.ZipFile(zip_path, "r") as zipf:
        file_list = zipf.namelist()
        assert len(file_list) == 1
        assert file_list[0].startswith("job_1_test-hospital-wa_")
        assert file_list[0].endswith(".txt")

        content = zipf.read(file_list[0]).decode("utf-8")
        assert "Senior Nurse" in content

    cleanup_temp_files(zip_path)


async def test_creates_zip_with_multiple_jobs(
    job_repo: JobRepo,
    test_organization: Organization,
):
    jobs = []
    for i in range(3):
        job = await job_repo.create(
            organization=test_organization,
            title=f"Job {i + 1}",
            description=f"Description {i + 1}",
        )
        job.is_active = True
        await job.save()
        await job.fetch_all_links()
        jobs.append(job)

    messages = [format_job_for_whatsapp_message(job) for job in jobs]
    zip_path = await create_message_files_and_zip(messages, jobs)

    with zipfile.ZipFile(zip_path, "r") as zipf:
        assert len(zipf.namelist()) == 3

    cleanup_temp_files(zip_path)

    for job in jobs:
        await job_repo.delete(job)


async def test_zip_filename_format(active_job_without_whatsapp_post: Job):
    messages = [format_job_for_whatsapp_message(active_job_without_whatsapp_post)]
    jobs = [active_job_without_whatsapp_post]

    zip_path = await create_message_files_and_zip(messages, jobs)

    filename = Path(zip_path).name
    assert filename.startswith("checkpoint_")
    assert filename.endswith(".zip")

    cleanup_temp_files(zip_path)


async def test_cleanup_existing_file(active_job_without_whatsapp_post: Job):
    messages = [format_job_for_whatsapp_message(active_job_without_whatsapp_post)]
    jobs = [active_job_without_whatsapp_post]

    zip_path = await create_message_files_and_zip(messages, jobs)
    assert Path(zip_path).exists()

    cleanup_temp_files(zip_path)
    assert not Path(zip_path).exists()


def test_cleanup_nonexistent_file() -> None:
    cleanup_temp_files("/tmp/nonexistent_file.zip")


async def test_no_jobs_to_process() -> None:
    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"
    assert result_data["jobs_processed"] >= 0


async def test_processes_active_unposted_jobs(
    active_job_without_whatsapp_post: Job,
    job_repo: JobRepo,
):
    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"
    assert result_data["jobs_processed"] >= 1

    updated_job = await job_repo.get(active_job_without_whatsapp_post.id)
    assert updated_job.whatsapp_channel_posted_at is not None


async def test_ignores_already_posted_jobs(
    active_job_already_posted: Job,
    job_repo: JobRepo,
):
    original_posted_at = active_job_already_posted.whatsapp_channel_posted_at

    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"

    updated_job = await job_repo.get(active_job_already_posted.id)
    assert updated_job.whatsapp_channel_posted_at == original_posted_at


async def test_ignores_expired_jobs(
    expired_job: Job,
    job_repo: JobRepo,
):
    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"

    updated_job = await job_repo.get(expired_job.id)
    assert updated_job.whatsapp_channel_posted_at is None


async def test_ignores_inactive_jobs(
    inactive_job: Job,
    job_repo: JobRepo,
):
    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"

    updated_job = await job_repo.get(inactive_job.id)
    assert updated_job.whatsapp_channel_posted_at is None


async def test_multiple_jobs_processed(
    job_repo: JobRepo,
    test_organization: Organization,
):
    jobs = []
    for i in range(5):
        job = await job_repo.create(
            organization=test_organization,
            title=f"Bulk Job {i + 1}",
            description=f"Description {i + 1}",
        )
        job.is_active = True
        await job.save()
        jobs.append(job)

    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["jobs_processed"] >= 5

    for job in jobs:
        updated_job = await job_repo.get(job.id)
        assert updated_job.whatsapp_channel_posted_at is not None
        await job_repo.delete(job)


async def test_job_with_no_expiry_date(
    job_repo: JobRepo,
    test_organization: Organization,
):
    job = await job_repo.create(
        organization=test_organization,
        title="No Expiry Job",
        description="This job has no expiry date",
        expires_at=None,
    )
    job.is_active = True
    await job.save()

    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"

    updated_job = await job_repo.get(job.id)
    assert updated_job.whatsapp_channel_posted_at is not None

    await job_repo.delete(job)


async def test_job_with_future_expiry_date(
    job_repo: JobRepo,
    test_organization: Organization,
):
    job = await job_repo.create(
        organization=test_organization,
        title="Future Expiry Job",
        description="This job expires in the future",
        expires_at=datetime.now(UTC) + timedelta(days=30),
    )
    job.is_active = True
    await job.save()

    result = await process_wa_messages_generation_event()
    result_data = json.loads(result)

    assert result_data["status"] == "ok"

    updated_job = await job_repo.get(job.id)
    assert updated_job.whatsapp_channel_posted_at is not None

    await job_repo.delete(job)
