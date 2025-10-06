from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import ProfileRepo
from app.jobs.documents import Job
from app.jobs.repositories import JobApplicantRepo, JobApplicationFormRepo, JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

CREATE_JOB_APPLICATION_MUTATION = """
mutation CreateJobApplication(
    $jobId: ID!
    $applicantFields: [ApplicantFieldInput!]!
) {
    createJobApplication(
        jobId: $jobId
        applicantFields: $applicantFields
    ) {
        __typename
        ... on CreateJobApplicantSuccess {
            jobApplicant {
                id
                status
                applicantFields {
                    fieldName
                    fieldValue
                }
            }
        }
        ... on JobNotFoundError {
            __typename
        }
        ... on JobNotPublishedError {
            __typename
        }
        ... on JobApplicantAlreadyExistsError {
            __typename
        }
        ... on JobIsExternalError {
            __typename
        }
        ... on AccountProfileNotFoundError {
            __typename
        }
        ... on AccountProfileIncompleteError {
            __typename
        }
        ... on InvalidApplicantFieldsError {
            __typename
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
async def published_job(
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
        vacancies=5,
    )
    await job_repo.update_active(job, is_active=True)
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def unpublished_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="Unpublished Job",
        description="This job is not published",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
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
        description="Job with external application URL",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
        external_application_url="https://example.com/apply",
    )
    await job_repo.update_active(job, is_active=True)
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def complete_profile(
    password_account: Account,
    profile_repo: ProfileRepo,
):
    from datetime import date

    from app.accounts.documents import CareerProfile

    profile = await profile_repo.create(
        account=password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )
    yield profile
    await profile_repo.delete(profile)


async def test_create_job_application_successful(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test successful job application creation."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "I am interested in this position",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert data["jobApplicant"]["status"] == "APPLIED"
    assert len(data["jobApplicant"]["applicantFields"]) == 1
    assert data["jobApplicant"]["applicantFields"][0]["fieldName"] == "cover_letter"


async def test_create_job_application_empty_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with empty applicant fields."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert len(data["jobApplicant"]["applicantFields"]) == 0


async def test_create_job_application_multiple_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with multiple applicant fields."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"},
                {"fieldName": "availability", "fieldValue": "Immediate"},
                {"fieldName": "salary_expectation", "fieldValue": "1000000"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert len(data["jobApplicant"]["applicantFields"]) == 3


async def test_create_job_application_job_not_found(
    password_auth_graphql_client: GraphQLClient,
    complete_profile,
) -> None:
    """Test job application with non-existent job ID."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": invalid_job_id,
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "JobNotFoundError"


async def test_create_job_application_job_not_published(
    password_auth_graphql_client: GraphQLClient,
    unpublished_job: Job,
    complete_profile,
) -> None:
    """Test job application for unpublished job."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", unpublished_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "JobNotPublishedError"


async def test_create_job_application_already_exists(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    password_account: Account,
    job_applicant_repo: JobApplicantRepo,
) -> None:
    """Test duplicate job application."""
    await job_applicant_repo.create(
        job=published_job,
        account=password_account,
        applicant_fields=[],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "JobApplicantAlreadyExistsError"


async def test_create_job_application_external_job(
    password_auth_graphql_client: GraphQLClient,
    external_job: Job,
    complete_profile,
) -> None:
    """Test job application for external job."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", external_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "JobIsExternalError"


async def test_create_job_application_profile_not_found(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
) -> None:
    """Test job application without profile."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "AccountProfileNotFoundError"


async def test_create_job_application_unauthenticated(
    graphql_client: GraphQLClient,
    published_job: Job,
) -> None:
    """Test unauthenticated job application."""
    response = await graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    assert "errors" in response


async def test_create_job_application_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
    complete_profile,
) -> None:
    """Test job application with invalid job ID format."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": "invalid-job-id",
            "applicantFields": [],
        },
    )

    assert "errors" in response


async def test_create_job_application_long_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with very long field values."""
    long_text = "A" * 10000

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "cover_letter", "fieldValue": long_text}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert data["jobApplicant"]["applicantFields"][0]["fieldValue"] == long_text


async def test_create_job_application_special_characters_in_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with special characters in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "Hello! @#$%^&*()_+-=[]{}|;':\",./<>?",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_unicode_in_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with unicode characters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "मैं इस पद में रुचि रखता हूं 我对这个职位感兴趣",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_empty_field_name(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with empty field name."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "", "fieldValue": "Some value"}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_empty_field_value(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with empty field value."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "cover_letter", "fieldValue": ""}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_duplicate_field_names(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with duplicate field names."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "First value"},
                {"fieldName": "cover_letter", "fieldValue": "Second value"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert len(data["jobApplicant"]["applicantFields"]) == 2


async def test_create_job_application_whitespace_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with whitespace-only field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "cover_letter", "fieldValue": "   "}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_newlines_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with newlines in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "Line 1\nLine 2\nLine 3"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_html_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with HTML in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "<script>alert('xss')</script>",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_sql_injection_attempt(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with SQL injection attempt."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "'; DROP TABLE jobs; --"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_json_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with JSON in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "metadata",
                    "fieldValue": '{"key": "value", "nested": {"data": 123}}',
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_idempotency_check(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test that applying twice to same job returns error."""
    response1 = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    response2 = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    data1 = response1["data"]["createJobApplication"]
    data2 = response2["data"]["createJobApplication"]

    assert data1["__typename"] == "CreateJobApplicantSuccess"
    assert data2["__typename"] == "JobApplicantAlreadyExistsError"


async def test_create_job_application_different_jobs_same_user(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    job_repo: JobRepo,
    complete_profile,
) -> None:
    """Test user can apply to multiple different jobs."""
    job1 = await job_repo.create(
        organization=valid_organization,
        title="Job 1",
        description="First job",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    await job_repo.update_active(job1, is_active=True)

    job2 = await job_repo.create(
        organization=valid_organization,
        title="Job 2",
        description="Second job",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    await job_repo.update_active(job2, is_active=True)

    response1 = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", job1.id),
            "applicantFields": [],
        },
    )

    response2 = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", job2.id),
            "applicantFields": [],
        },
    )

    data1 = response1["data"]["createJobApplication"]
    data2 = response2["data"]["createJobApplication"]

    assert data1["__typename"] == "CreateJobApplicantSuccess"
    assert data2["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_numeric_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with numeric field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "years_experience", "fieldValue": "5"},
                {"fieldName": "salary_expectation", "fieldValue": "1000000"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_boolean_like_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with boolean-like field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "willing_to_relocate", "fieldValue": "true"},
                {"fieldName": "has_visa", "fieldValue": "false"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_url_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with URLs in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "portfolio",
                    "fieldValue": "https://example.com/portfolio",
                },
                {"fieldName": "linkedin", "fieldValue": "https://linkedin.com/in/user"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_email_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with email in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "alternate_email", "fieldValue": "user@example.com"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_phone_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with phone number in field values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "phone", "fieldValue": "+91-9876543210"}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_profile_incomplete(
    foreign_password_account: Account,
    published_job: Job,
    profile_repo: ProfileRepo,
    session_repo,
    auth_settings,
    secret_settings,
    lifespan_manager,
) -> None:
    """Test job application with incomplete profile."""
    from httpx import ASGITransport, AsyncClient, Cookies

    from tests.integration.graphql_client import GraphQLClient
    from tests.utils.auth import encrypt_session_data

    # Create incomplete profile (missing required fields)
    await profile_repo.create(
        account=foreign_password_account,
        headline="Engineer",
    )

    # Create authenticated client for foreign account
    session_token = await session_repo.create(
        foreign_password_account, user_agent="test-agent", ip_address="192.168.1.1"
    )
    encrypted_session = encrypt_session_data(
        secret_settings, {"session_token": session_token}
    )
    cookies = Cookies()
    cookies.set(
        auth_settings.session_user_cookie_name, encrypted_session.decode("utf-8")
    )

    async with AsyncClient(
        transport=ASGITransport(app=lifespan_manager.app),
        base_url="https://localtest.me",
        follow_redirects=True,
        cookies=cookies,
    ) as client:
        graphql_client = GraphQLClient(client=client, endpoint="/graphql")
        response = await graphql_client(
            CREATE_JOB_APPLICATION_MUTATION,
            variables={
                "jobId": relay.to_base64("Job", published_job.id),
                "applicantFields": [],
            },
        )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "AccountProfileIncompleteError"


async def test_create_job_application_very_large_number_of_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with many applicant fields."""
    fields = [
        {"fieldName": f"field_{i}", "fieldValue": f"value_{i}"} for i in range(100)
    ]

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": fields,
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert len(data["jobApplicant"]["applicantFields"]) == 100


async def test_create_job_application_null_characters_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with null characters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "Hello\x00World"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_emoji_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with emoji characters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I'm excited! 🎉🚀💼"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_markdown_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with markdown formatting."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "# Header\n\n**Bold** and *italic*\n\n- List item 1\n- List item 2",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_rtl_text_in_field_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with right-to-left text."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {
                    "fieldName": "cover_letter",
                    "fieldValue": "مرحبا بك أنا مهتم بهذا المنصب",
                }
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_mixed_case_field_names(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with mixed case field names."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "CoverLetter", "fieldValue": "Value 1"},
                {"fieldName": "coverletter", "fieldValue": "Value 2"},
                {"fieldName": "COVERLETTER", "fieldValue": "Value 3"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"
    assert len(data["jobApplicant"]["applicantFields"]) == 3


async def test_create_job_application_field_names_with_special_chars(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with special characters in field names."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "field-with-dashes", "fieldValue": "Value 1"},
                {"fieldName": "field_with_underscores", "fieldValue": "Value 2"},
                {"fieldName": "field.with.dots", "fieldValue": "Value 3"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_zero_width_characters(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with zero-width characters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "Hello\u200bWorld\u200c"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_control_characters(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with control characters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "Hello\tWorld\r\n"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_base64_encoded_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with base64 encoded values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "encoded_data", "fieldValue": "SGVsbG8gV29ybGQ="}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_date_formats_in_values(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application with various date formats."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "start_date", "fieldValue": "2024-01-01"},
                {"fieldName": "end_date", "fieldValue": "01/01/2024"},
                {"fieldName": "dob", "fieldValue": "1990-12-31T00:00:00Z"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_concurrent_applications(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    job_repo: JobRepo,
    complete_profile,
) -> None:
    """Test concurrent applications to different jobs."""
    import asyncio

    jobs = []
    for i in range(5):
        job = await job_repo.create(
            organization=valid_organization,
            title=f"Job {i}",
            description=f"Description {i}",
            skills=["Python"],
            location="Mumbai",
            applicant_locations=[],
            vacancies=5,
        )
        await job_repo.update_active(job, is_active=True)
        jobs.append(job)

    async def apply_to_job(job):
        return await password_auth_graphql_client(
            CREATE_JOB_APPLICATION_MUTATION,
            variables={
                "jobId": relay.to_base64("Job", job.id),
                "applicantFields": [],
            },
        )

    responses = await asyncio.gather(*[apply_to_job(job) for job in jobs])

    for response in responses:
        data = response["data"]["createJobApplication"]
        assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_missing_required_fields(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application missing required fields from application form."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
            ApplicationField(field_name="availability", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "InvalidApplicantFieldsError"


async def test_create_job_application_all_required_fields_provided(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application with all required fields provided."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
            ApplicationField(field_name="availability", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"},
                {"fieldName": "availability", "fieldValue": "Immediate"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_optional_fields_not_provided(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application with optional fields not provided."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
            ApplicationField(field_name="portfolio", is_required=False),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_extra_fields_provided(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application with extra fields not in form."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"},
                {"fieldName": "extra_field", "fieldValue": "Extra value"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "InvalidApplicantFieldsError"


async def test_create_job_application_no_form_defined(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
) -> None:
    """Test job application when no application form is defined."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "I am interested"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_empty_required_field_value(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application with empty value for required field."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [{"fieldName": "cover_letter", "fieldValue": ""}],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "CreateJobApplicantSuccess"


async def test_create_job_application_multiple_required_fields_missing(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application missing multiple required fields."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
            ApplicationField(field_name="availability", is_required=True),
            ApplicationField(field_name="salary_expectation", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "InvalidApplicantFieldsError"


async def test_create_job_application_case_sensitive_field_names(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test that field name matching is case-sensitive."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "Cover_Letter", "fieldValue": "I am interested"}
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "InvalidApplicantFieldsError"


async def test_create_job_application_duplicate_field_names(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
    complete_profile,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test job application with duplicate field names."""
    from app.jobs.documents import ApplicationField

    await job_application_form_repo.create(
        job=published_job,
        fields=[
            ApplicationField(field_name="cover_letter", is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICATION_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", published_job.id),
            "applicantFields": [
                {"fieldName": "cover_letter", "fieldValue": "First value"},
                {"fieldName": "cover_letter", "fieldValue": "Second value"},
            ],
        },
    )

    data = response["data"]["createJobApplication"]
    assert data["__typename"] == "InvalidApplicantFieldsError"
