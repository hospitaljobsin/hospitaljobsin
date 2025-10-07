import asyncio
from collections.abc import AsyncGenerator
from datetime import date

import pytest
from app.accounts.documents import Account, CareerProfile
from app.accounts.repositories import ProfileRepo
from app.jobs.documents import Job, JobApplicant
from app.jobs.repositories import JobApplicantRepo, JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

UPDATE_JOB_APPLICANTS_STATUS_MUTATION = """
mutation UpdateJobApplicantsStatus(
    $jobId: ID!
    $jobApplicantIds: [ID!]!
    $status: JobApplicantStatus!
) {
    updateJobApplicantsStatus(
        jobId: $jobId
        jobApplicantIds: $jobApplicantIds
        status: $status
    ) {
        __typename
        ... on UpdateJobApplicantsStatusSuccess {
            jobApplicants {
                id
                status
            }
        }
        ... on JobNotFoundError {
            __typename
        }
        ... on OrganizationAuthorizationError {
            __typename
        }
        ... on JobIsExternalError {
            __typename
        }
        ... on JobApplicantsNotFoundError {
            notFoundIds
        }
    }
}
"""


@pytest.fixture
async def valid_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    org = await organization_repo.create(
        name="Valid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_repo.delete(org)


@pytest.fixture
async def invalid_organization(
    foreign_password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    org = await organization_repo.create(
        name="Invalid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_repo.delete(org)


@pytest.fixture
async def valid_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="Software Engineer",
        description="A great software engineering position",
        skills=["Python", "Django"],
        location="Mumbai",
        applicant_locations=[],
    )
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def external_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="External Job",
        description="Job with external application",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        external_application_url="https://example.com/apply",
    )
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def valid_job_applicants(
    valid_job: Job,
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> AsyncGenerator[list[JobApplicant]]:
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    applicants = await job_applicant_repo.create_many(
        job=valid_job,
        account=foreign_password_account,
        count=3,
        applicant_fields=[],
    )
    yield applicants
    for applicant in applicants:
        await job_applicant_repo.delete(applicant)
    await profile_repo.delete(profile)


async def test_update_job_applicants_status_successful_single(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test successful status update for single applicant."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id)
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert len(data["jobApplicants"]) == 1
    assert data["jobApplicants"][0]["status"] == "SHORTLISTED"


async def test_update_job_applicants_status_successful_multiple(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test successful status update for multiple applicants."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", applicant.id)
                for applicant in valid_job_applicants
            ],
            "status": "INTERVIEWED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert len(data["jobApplicants"]) == 3
    assert all(app["status"] == "INTERVIEWED" for app in data["jobApplicants"])


async def test_update_job_applicants_status_all_statuses(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating to all possible status values."""
    statuses = ["APPLIED", "SHORTLISTED", "INTERVIEWED", "ONHOLD", "OFFERED"]

    for status in statuses:
        response = await password_auth_graphql_client(
            UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
            variables={
                "jobId": relay.to_base64("Job", valid_job.id),
                "jobApplicantIds": [
                    relay.to_base64("JobApplicant", valid_job_applicants[0].id)
                ],
                "status": status,
            },
        )

        data = response["data"]["updateJobApplicantsStatus"]
        assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
        assert data["jobApplicants"][0]["status"] == status


async def test_update_job_applicants_status_job_not_found(
    password_auth_graphql_client: GraphQLClient,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating status with non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": invalid_job_id,
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id)
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobNotFoundError"


async def test_update_job_applicants_status_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test updating status without authorization."""
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    applicant = await job_applicant_repo.create(
        job=unauthorized_job,
        account=foreign_password_account,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", unauthorized_job.id),
            "jobApplicantIds": [relay.to_base64("JobApplicant", applicant.id)],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await profile_repo.delete(profile)
    await job_repo.delete(unauthorized_job)
    await job_applicant_repo.delete(applicant)


async def test_update_job_applicants_status_external_job(
    password_auth_graphql_client: GraphQLClient,
    external_job: Job,
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test updating status for external job."""
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    applicant = await job_applicant_repo.create(
        job=external_job,
        account=foreign_password_account,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", external_job.id),
            "jobApplicantIds": [relay.to_base64("JobApplicant", applicant.id)],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobIsExternalError"

    await profile_repo.delete(profile)
    await job_applicant_repo.delete(applicant)


async def test_update_job_applicants_status_applicants_not_found(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test updating status with non-existent applicant IDs."""
    invalid_applicant_id = relay.to_base64("JobApplicant", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [invalid_applicant_id],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobApplicantsNotFoundError"
    assert len(data["notFoundIds"]) == 1


async def test_update_job_applicants_status_partial_not_found(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating status with mix of valid and invalid applicant IDs."""
    invalid_applicant_id = relay.to_base64("JobApplicant", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id),
                invalid_applicant_id,
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobApplicantsNotFoundError"
    assert len(data["notFoundIds"]) == 1


async def test_update_job_applicants_status_empty_list(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test updating status with empty applicant list."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert len(data["jobApplicants"]) == 0


async def test_update_job_applicants_status_unauthenticated(
    graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id)
            ],
            "status": "SHORTLISTED",
        },
    )

    assert "errors" in response


async def test_update_job_applicants_status_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating status with invalid job ID format."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": "invalid-job-id",
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id)
            ],
            "status": "SHORTLISTED",
        },
    )

    assert "errors" in response


async def test_update_job_applicants_status_invalid_applicant_id_format(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test updating status with invalid applicant ID format."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": ["invalid-applicant-id"],
            "status": "SHORTLISTED",
        },
    )

    assert "errors" in response


async def test_update_job_applicants_status_duplicate_applicant_ids(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating status with duplicate applicant IDs."""
    applicant_id = relay.to_base64("JobApplicant", valid_job_applicants[0].id)

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [applicant_id, applicant_id],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"


async def test_update_job_applicants_status_idempotent(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test that updating status multiple times is idempotent."""
    variables = {
        "jobId": relay.to_base64("Job", valid_job.id),
        "jobApplicantIds": [
            relay.to_base64("JobApplicant", valid_job_applicants[0].id)
        ],
        "status": "SHORTLISTED",
    }

    response1 = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables=variables,
    )

    response2 = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables=variables,
    )

    data1 = response1["data"]["updateJobApplicantsStatus"]
    data2 = response2["data"]["updateJobApplicantsStatus"]

    assert data1["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert data2["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert data1["jobApplicants"][0]["status"] == data2["jobApplicants"][0]["status"]


async def test_update_job_applicants_status_different_statuses_sequentially(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test updating applicant through different statuses sequentially."""
    statuses = ["SHORTLISTED", "INTERVIEWED", "OFFERED"]
    applicant_id = relay.to_base64("JobApplicant", valid_job_applicants[0].id)

    for status in statuses:
        response = await password_auth_graphql_client(
            UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
            variables={
                "jobId": relay.to_base64("Job", valid_job.id),
                "jobApplicantIds": [applicant_id],
                "status": status,
            },
        )

        data = response["data"]["updateJobApplicantsStatus"]
        assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
        assert data["jobApplicants"][0]["status"] == status


async def test_update_job_applicants_status_large_batch(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test updating status for large batch of applicants."""
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    applicants = await job_applicant_repo.create_many(
        job=valid_job,
        account=foreign_password_account,
        count=50,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", applicant.id)
                for applicant in applicants
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert len(data["jobApplicants"]) == 50

    await profile_repo.delete(profile)
    for applicant in applicants:
        await job_applicant_repo.delete(applicant)


async def test_update_job_applicants_status_applicants_from_different_job(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    job_repo: JobRepo,
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test updating applicants that belong to a different job."""
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    job1 = await job_repo.create(
        organization=valid_organization,
        title="Job 1",
        description="First job",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    job2 = await job_repo.create(
        organization=valid_organization,
        title="Job 2",
        description="Second job",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    applicant_job2 = await job_applicant_repo.create(
        job=job2,
        account=foreign_password_account,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", job1.id),
            "jobApplicantIds": [relay.to_base64("JobApplicant", applicant_job2.id)],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobApplicantsNotFoundError"

    await profile_repo.delete(profile)
    await job_repo.delete(job1)
    await job_repo.delete(job2)
    await job_applicant_repo.delete(applicant_job2)


async def test_update_job_applicants_status_mixed_jobs(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_organization: Organization,
    job_repo: JobRepo,
    valid_job_applicants: list[JobApplicant],
    foreign_password_account: Account,
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test updating applicants from mixed jobs."""
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    other_job = await job_repo.create(
        organization=valid_organization,
        title="Other Job",
        description="Another job",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    other_applicant = await job_applicant_repo.create(
        job=other_job,
        account=foreign_password_account,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id),
                relay.to_base64("JobApplicant", other_applicant.id),
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobApplicantsNotFoundError"

    await profile_repo.delete(profile)
    await job_repo.delete(other_job)
    await job_applicant_repo.delete(other_applicant)


async def test_update_job_applicants_status_status_downgrade(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
    job_applicant_repo: JobApplicantRepo,
) -> None:
    """Test downgrading applicant status."""
    applicant = valid_job_applicants[0]
    await job_applicant_repo.bulk_update([applicant.id], "offered")

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [relay.to_base64("JobApplicant", applicant.id)],
            "status": "APPLIED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"
    assert data["jobApplicants"][0]["status"] == "APPLIED"


async def test_update_job_applicants_status_concurrent_updates(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test concurrent status updates."""
    applicant_id = relay.to_base64("JobApplicant", valid_job_applicants[0].id)

    async def perform_mutation(status: str):
        return await password_auth_graphql_client(
            UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
            variables={
                "jobId": relay.to_base64("Job", valid_job.id),
                "jobApplicantIds": [applicant_id],
                "status": status,
            },
        )

    responses = await asyncio.gather(
        perform_mutation("SHORTLISTED"),
        perform_mutation("INTERVIEWED"),
        perform_mutation("OFFERED"),
    )

    for response in responses:
        data = response["data"]["updateJobApplicantsStatus"]
        assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"


async def test_update_job_applicants_status_preserves_other_fields(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
) -> None:
    """Test that updating status preserves other applicant fields."""
    applicant = valid_job_applicants[0]
    original_fields = applicant.applicant_fields

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [relay.to_base64("JobApplicant", applicant.id)],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"

    await applicant.sync()
    assert applicant.applicant_fields == original_fields


async def test_update_job_applicants_status_member_role(
    valid_organization: Organization,
    valid_job: Job,
    valid_job_applicants: list[JobApplicant],
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
    foreign_password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that organization members can update applicant status."""
    await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=valid_organization.id,
        role="member",
    )

    response = await foreign_password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": [
                relay.to_base64("JobApplicant", valid_job_applicants[0].id)
            ],
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "UpdateJobApplicantsStatusSuccess"


async def test_update_job_applicants_status_all_not_found(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test updating status when all applicant IDs are invalid."""
    invalid_ids = [
        relay.to_base64("JobApplicant", "507f1f77bcf86cd799439011"),
        relay.to_base64("JobApplicant", "507f1f77bcf86cd799439012"),
        relay.to_base64("JobApplicant", "507f1f77bcf86cd799439013"),
    ]

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICANTS_STATUS_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", valid_job.id),
            "jobApplicantIds": invalid_ids,
            "status": "SHORTLISTED",
        },
    )

    data = response["data"]["updateJobApplicantsStatus"]
    assert data["__typename"] == "JobApplicantsNotFoundError"
    assert len(data["notFoundIds"]) == 3
