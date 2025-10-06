from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.jobs.documents import ApplicationField, Job
from app.jobs.repositories import JobApplicationFormRepo, JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

UPDATE_JOB_APPLICATION_FORM_MUTATION = """
mutation UpdateJobApplicationFormMutation(
    $jobId: ID!
    $fields: [ApplicationFieldInput!]!
) {
    updateJobApplicationForm(
        jobId: $jobId
        fields: $fields
    ) {
        __typename
        ... on UpdateJobApplicationFormSuccess {
            job {
                id
                title
            }
            jobApplicationForm {
                id
                fields {
                    fieldName
                    defaultValue
                    isRequired
                }
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
async def test_job(
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


async def test_update_job_application_form_successful_create(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test successful job application form creation."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Why do you want to work here?",
                    "defaultValue": None,
                    "isRequired": True,
                },
                {
                    "fieldName": "Years of experience",
                    "defaultValue": "0",
                    "isRequired": False,
                },
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["job"]["id"] == relay.to_base64("Job", test_job.id)
    assert len(data["jobApplicationForm"]["fields"]) == 2
    assert (
        data["jobApplicationForm"]["fields"][0]["fieldName"]
        == "Why do you want to work here?"
    )
    assert data["jobApplicationForm"]["fields"][0]["isRequired"] is True
    assert data["jobApplicationForm"]["fields"][1]["fieldName"] == "Years of experience"
    assert data["jobApplicationForm"]["fields"][1]["defaultValue"] == "0"


async def test_update_job_application_form_successful_update(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test successful job application form update."""
    await job_application_form_repo.create(
        job=test_job,
        fields=[
            ApplicationField(
                field_name="Old question",
                default_value=None,
                is_required=True,
            )
        ],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "New question",
                    "defaultValue": "Default answer",
                    "isRequired": False,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data["jobApplicationForm"]["fields"]) == 1
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == "New question"


async def test_update_job_application_form_empty_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with empty fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data["jobApplicationForm"]["fields"]) == 0


async def test_update_job_application_form_multiple_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with multiple fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Question 1", "defaultValue": None, "isRequired": True},
                {
                    "fieldName": "Question 2",
                    "defaultValue": "Default",
                    "isRequired": False,
                },
                {"fieldName": "Question 3", "defaultValue": None, "isRequired": True},
                {
                    "fieldName": "Question 4",
                    "defaultValue": "Test",
                    "isRequired": False,
                },
                {"fieldName": "Question 5", "defaultValue": None, "isRequired": False},
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data["jobApplicationForm"]["fields"]) == 5


async def test_update_job_application_form_job_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating job application form with non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": invalid_job_id,
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "JobNotFoundError"


async def test_update_job_application_form_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test updating job application form without authorization."""
    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", unauthorized_job.id),
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_update_job_application_form_external_job(
    password_auth_graphql_client: GraphQLClient,
    external_job: Job,
) -> None:
    """Test updating job application form for external job."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", external_job.id),
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "JobIsExternalError"


async def test_update_job_application_form_unauthenticated(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_update_job_application_form_all_required_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with all required fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Required 1", "defaultValue": None, "isRequired": True},
                {"fieldName": "Required 2", "defaultValue": None, "isRequired": True},
                {"fieldName": "Required 3", "defaultValue": None, "isRequired": True},
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert all(field["isRequired"] for field in data["jobApplicationForm"]["fields"])


async def test_update_job_application_form_all_optional_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with all optional fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Optional 1",
                    "defaultValue": "Default 1",
                    "isRequired": False,
                },
                {
                    "fieldName": "Optional 2",
                    "defaultValue": "Default 2",
                    "isRequired": False,
                },
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert all(
        not field["isRequired"] for field in data["jobApplicationForm"]["fields"]
    )


async def test_update_job_application_form_mixed_required_optional(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with mixed required and optional fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Required", "defaultValue": None, "isRequired": True},
                {
                    "fieldName": "Optional",
                    "defaultValue": "Default",
                    "isRequired": False,
                },
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["isRequired"] is True
    assert data["jobApplicationForm"]["fields"][1]["isRequired"] is False


async def test_update_job_application_form_with_default_values(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with default values."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Field 1",
                    "defaultValue": "Default 1",
                    "isRequired": False,
                },
                {
                    "fieldName": "Field 2",
                    "defaultValue": "Default 2",
                    "isRequired": True,
                },
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] == "Default 1"
    assert data["jobApplicationForm"]["fields"][1]["defaultValue"] == "Default 2"


async def test_update_job_application_form_without_default_values(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form without default values."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Field 1", "defaultValue": None, "isRequired": True},
                {"fieldName": "Field 2", "defaultValue": None, "isRequired": False},
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] is None
    assert data["jobApplicationForm"]["fields"][1]["defaultValue"] is None


async def test_update_job_application_form_long_field_names(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with long field names."""
    long_field_name = "A" * 500

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": long_field_name, "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == long_field_name


async def test_update_job_application_form_special_characters(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with special characters."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "What's your experience with C++ & Python?",
                    "defaultValue": "5+ years",
                    "isRequired": True,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert "C++" in data["jobApplicationForm"]["fields"][0]["fieldName"]


async def test_update_job_application_form_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with unicode characters."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "आपका अनुभव क्या है? What is your experience? 你的经验是什么？",
                    "defaultValue": "मेरा अनुभव 5 साल है",
                    "isRequired": True,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert "आपका" in data["jobApplicationForm"]["fields"][0]["fieldName"]


async def test_update_job_application_form_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    job_application_form_repo: JobApplicationFormRepo,
) -> None:
    """Test that updating replaces existing form completely."""
    await job_application_form_repo.create(
        job=test_job,
        fields=[
            ApplicationField(field_name="Old 1", default_value=None, is_required=True),
            ApplicationField(field_name="Old 2", default_value=None, is_required=True),
            ApplicationField(field_name="Old 3", default_value=None, is_required=True),
        ],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "New 1", "defaultValue": None, "isRequired": False}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data["jobApplicationForm"]["fields"]) == 1
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == "New 1"


async def test_update_job_application_form_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating job application form with invalid job ID format."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": "invalid-job-id",
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_duplicate_field_names(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with duplicate field names."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Same Question",
                    "defaultValue": None,
                    "isRequired": True,
                },
                {
                    "fieldName": "Same Question",
                    "defaultValue": "Different",
                    "isRequired": False,
                },
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data["jobApplicationForm"]["fields"]) == 2


async def test_update_job_application_form_empty_field_name(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with empty field name."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [{"fieldName": "", "defaultValue": None, "isRequired": True}],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_whitespace_field_name(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with whitespace field name."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [{"fieldName": "   ", "defaultValue": None, "isRequired": True}],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_empty_default_value(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with empty default value."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Question", "defaultValue": "", "isRequired": False}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] == ""


async def test_update_job_application_form_long_default_value(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with long default value."""
    long_default = "A" * 1000

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Question",
                    "defaultValue": long_default,
                    "isRequired": False,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] == long_default


async def test_update_job_application_form_preserves_job_data(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that updating form preserves job data."""
    original_title = test_job.title

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Question", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["job"]["title"] == original_title


async def test_update_job_application_form_idempotent(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that updating form multiple times with same data is idempotent."""
    fields = [
        {"fieldName": "Question 1", "defaultValue": None, "isRequired": True},
        {"fieldName": "Question 2", "defaultValue": "Default", "isRequired": False},
    ]

    response1 = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": fields,
        },
    )

    response2 = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": fields,
        },
    )

    data1 = response1["data"]["updateJobApplicationForm"]
    data2 = response2["data"]["updateJobApplicationForm"]

    assert data1["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data2["__typename"] == "UpdateJobApplicationFormSuccess"
    assert len(data1["jobApplicationForm"]["fields"]) == len(
        data2["jobApplicationForm"]["fields"]
    )


async def test_update_job_application_form_field_name_too_short(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with field name shorter than 5 characters."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [{"fieldName": "Test", "defaultValue": None, "isRequired": True}],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_field_name_exactly_min_length(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with field name exactly 5 characters."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": "Tests", "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == "Tests"


async def test_update_job_application_form_field_name_too_long(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with field name longer than 500 characters."""
    long_field_name = "A" * 501

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": long_field_name, "defaultValue": None, "isRequired": True}
            ],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_field_name_exactly_max_length(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with field name exactly 500 characters."""
    field_name = "A" * 500

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {"fieldName": field_name, "defaultValue": None, "isRequired": True}
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == field_name


async def test_update_job_application_form_default_value_too_long(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with default value longer than 2000 characters."""
    long_default = "A" * 2001

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Question",
                    "defaultValue": long_default,
                    "isRequired": False,
                }
            ],
        },
    )

    assert "errors" in response


async def test_update_job_application_form_default_value_exactly_max_length(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job application form with default value exactly 2000 characters."""
    default_value = "A" * 2000

    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Question",
                    "defaultValue": default_value,
                    "isRequired": False,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] == default_value


async def test_update_job_application_form_field_name_whitespace_stripped(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that whitespace is stripped from field names."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "  Valid Question  ",
                    "defaultValue": None,
                    "isRequired": True,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["fieldName"] == "Valid Question"


async def test_update_job_application_form_default_value_whitespace_stripped(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that whitespace is stripped from default values."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_APPLICATION_FORM_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "fields": [
                {
                    "fieldName": "Question",
                    "defaultValue": "  Default Answer  ",
                    "isRequired": False,
                }
            ],
        },
    )

    data = response["data"]["updateJobApplicationForm"]
    assert data["__typename"] == "UpdateJobApplicationFormSuccess"
    assert data["jobApplicationForm"]["fields"][0]["defaultValue"] == "Default Answer"
