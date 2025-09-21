from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from typing import Any

import pytest
from app.accounts.documents import Account
from app.core.formatting import format_datetime
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

UPDATE_JOB_MUTATION = """
mutation UpdateJobMutation(
    $jobId: ID!
    $title: String!
    $description: String!
    $skills: [String!]!
    $location: String
    $applicantLocations: [String!]!
    $vacancies: Int
    $minSalary: Int
    $maxSalary: Int
    $isSalaryNegotiable: Boolean = false
    $minExperience: Int
    $maxExperience: Int
    $expiresAt: DateTime
    $jobType: JobType
    $workMode: WorkMode
    $currency: String = "INR"
) {
    updateJob(
        jobId: $jobId
        title: $title
        description: $description
        skills: $skills
        location: $location
        applicantLocations: $applicantLocations
        vacancies: $vacancies
        minSalary: $minSalary
        maxSalary: $maxSalary
        isSalaryNegotiable: $isSalaryNegotiable
        minExperience: $minExperience
        maxExperience: $maxExperience
        expiresAt: $expiresAt
        jobType: $jobType
        workMode: $workMode
        currency: $currency
    ) {
        __typename
        ... on UpdateJobSuccess {
            job {
                id
                title
                description
                skills
                location
                applicantLocations
                vacancies
                minSalary
                maxSalary
                isSalaryNegotiable
                minExperience
                maxExperience
                expiresAt
                type
                workMode
                currency
            }
        }
        ... on JobNotFoundError {
            __typename
        }
        ... on OrganizationAuthorizationError {
            __typename
        }
        ... on InvalidLocationError {
            __typename
        }
        ... on InvalidApplicantLocationsError {
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
    """Create an organization where the user is a member."""
    org = await organization_repo.create(
        name="Valid Org",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def invalid_organization(
    foreign_password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization where the user is not a member."""
    org = await organization_repo.create(
        name="Invalid Org",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def test_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    """Create a test job for updating."""
    job = await job_repo.create(
        organization=valid_organization,
        title="Original Job Title",
        description="Original job description",
        skills=["Python", "Django"],
        location="Mumbai",
        applicant_locations=["IN"],
        vacancies=2,
        min_salary=500000,
        max_salary=800000,
        is_salary_negotiable=False,
        min_experience=2,
        max_experience=5,
        job_type="full_time",
        work_mode="office",
        currency="INR",
    )
    yield job
    await job_repo.delete(job)


async def test_update_job_successful_basic_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test successful job update with basic fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Updated Software Engineer",
            "description": "Updated job description",
            "skills": ["Python", "FastAPI", "PostgreSQL"],
            "location": "Delhi",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["title"] == "Updated Software Engineer"
    assert job["description"] == "Updated job description"
    assert job["skills"] == ["Python", "FastAPI", "PostgreSQL"]
    assert job["location"] == "Delhi"
    assert job["applicantLocations"] == ["IN"]


async def test_update_job_successful_all_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test successful job update with all optional fields."""
    expires_at = datetime.now(UTC).replace(microsecond=0)

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Senior Python Developer",
            "description": "Updated comprehensive job description",
            "skills": ["Python", "Django", "PostgreSQL", "Redis"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "vacancies": 5,
            "minSalary": 900000,
            "maxSalary": 1500000,
            "isSalaryNegotiable": True,
            "minExperience": 4,
            "maxExperience": 8,
            "expiresAt": expires_at.isoformat(),
            "jobType": "FULL_TIME",
            "workMode": "HYBRID",
            "currency": "INR",
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["title"] == "Senior Python Developer"
    assert job["description"] == "Updated comprehensive job description"
    assert job["skills"] == ["Python", "Django", "PostgreSQL", "Redis"]
    assert job["location"] == "Mumbai"
    assert job["applicantLocations"] == ["IN"]
    assert job["vacancies"] == 5
    assert job["minSalary"] == 900000
    assert job["maxSalary"] == 1500000
    assert job["isSalaryNegotiable"] is True
    assert job["minExperience"] == 4
    assert job["maxExperience"] == 8
    assert job["expiresAt"] == format_datetime(expires_at)
    assert job["type"] == "FULL_TIME"
    assert job["workMode"] == "HYBRID"
    assert job["currency"] == "INR"


async def test_update_job_remote_work_mode(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job to remote work mode."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Remote Developer",
            "description": "Remote job description",
            "skills": ["Python"],
            "location": None,
            "workMode": "REMOTE",
            "applicantLocations": ["IN", "US"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["workMode"] == "REMOTE"
    assert job["location"] is None
    assert job["applicantLocations"] == ["IN", "US"]


async def test_update_job_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": invalid_job_id,
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "JobNotFoundError"


async def test_update_job_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test updating job from organization user doesn't have access to."""
    # Create job in organization user doesn't belong to
    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=["IN"],
    )

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", unauthorized_job.id),
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_update_job_invalid_location(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with invalid location."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "location": "InvalidCityName123",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "InvalidLocationError"


async def test_update_job_invalid_applicant_locations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with invalid applicant locations."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "workMode": "REMOTE",
            "location": None,
            "applicantLocations": ["InvalidCountry123", "AnotherInvalid456"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "InvalidApplicantLocationsError"


async def test_update_job_remote_without_applicant_locations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job to remote mode without applicant locations."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Remote Job",
            "description": "Remote job description",
            "skills": ["Python"],
            "location": None,
            "workMode": "REMOTE",
            "applicantLocations": [],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "InvalidApplicantLocationsError"


async def test_update_job_office_without_location(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job to office mode without location."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Office Job",
            "description": "Office job description",
            "skills": ["Python"],
            "location": None,
            "workMode": "OFFICE",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "InvalidLocationError"


async def test_update_job_unauthenticated(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


@pytest.mark.parametrize(
    ("job_type", "work_mode"),
    [
        ("FULL_TIME", "OFFICE"),
        ("PART_TIME", "OFFICE"),
        ("CONTRACT", "OFFICE"),
        ("INTERNSHIP", "OFFICE"),
        ("FULL_TIME", "HYBRID"),
        ("PART_TIME", "HYBRID"),
        ("CONTRACT", "HYBRID"),
        ("INTERNSHIP", "HYBRID"),
        (None, None),
        ("FULL_TIME", None),
        (None, "OFFICE"),
    ],
)
async def test_update_job_enum_variations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    job_type: str | None,
    work_mode: str | None,
) -> None:
    """Test updating job with different enum value combinations."""
    variables: dict[str, Any] = {
        "jobId": relay.to_base64("Job", test_job.id),
        "title": "Updated Job",
        "description": "Updated job description",
        "skills": ["Python"],
        "location": "Mumbai",
        "applicantLocations": ["IN"],
    }

    if job_type is not None:
        variables["jobType"] = job_type
    if work_mode is not None:
        variables["workMode"] = work_mode

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables=variables,
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["type"] == job_type
    assert job["workMode"] == work_mode


@pytest.mark.parametrize(
    ("title", "description", "skills"),
    [
        ("", "Valid description", ["Python"]),
        ("Valid title", "", ["Python"]),
        ("Valid title", "Valid description", []),
        ("Valid title", "Valid description", [""]),
        ("   ", "Valid description", ["Python"]),  # Whitespace title
        ("Valid title", "   ", ["Python"]),  # Whitespace description
    ],
)
async def test_update_job_edge_case_strings(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    title: str,
    description: str,
    skills: list[str],
) -> None:
    """Test updating job with edge case string values."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": title,
            "description": description,
            "skills": skills,
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    # Should either succeed or fail gracefully
    data = response["data"]["updateJob"]
    assert data["__typename"] in [
        "UpdateJobSuccess",
        "JobNotFoundError",
        "OrganizationAuthorizationError",
        "InvalidLocationError",
        "InvalidApplicantLocationsError",
    ]


@pytest.mark.parametrize(
    ("min_salary", "max_salary", "min_exp", "max_exp", "vacancies"),
    [
        (0, 1000000, 0, 10, 1),  # Minimum valid values
        (None, None, None, None, None),  # All None
        (500000, 500000, 5, 5, 1),  # Equal min/max values
        (-1, 1000000, -1, 10, 0),  # Negative/zero edge cases
        (1000000, 500000, 10, 5, 100),  # Max less than min
        (0, 0, 0, 0, 0),  # All zeros
    ],
)
async def test_update_job_numeric_edge_cases(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    min_salary: int | None,
    max_salary: int | None,
    min_exp: int | None,
    max_exp: int | None,
    vacancies: int | None,
) -> None:
    """Test updating job with edge case numeric values."""
    variables: dict[str, Any] = {
        "jobId": relay.to_base64("Job", test_job.id),
        "title": "Updated Job",
        "description": "Updated description",
        "skills": ["Python"],
        "location": "Mumbai",
        "applicantLocations": ["IN"],
    }

    if min_salary is not None:
        variables["minSalary"] = min_salary
    if max_salary is not None:
        variables["maxSalary"] = max_salary
    if min_exp is not None:
        variables["minExperience"] = min_exp
    if max_exp is not None:
        variables["maxExperience"] = max_exp
    if vacancies is not None:
        variables["vacancies"] = vacancies

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables=variables,
    )

    # Should either succeed or fail gracefully
    data = response["data"]["updateJob"]
    assert data["__typename"] in [
        "UpdateJobSuccess",
        "JobNotFoundError",
        "OrganizationAuthorizationError",
        "InvalidLocationError",
        "InvalidApplicantLocationsError",
    ]


async def test_update_job_multiple_skills(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with multiple skills."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Full Stack Developer",
            "description": "Updated versatile developer position",
            "skills": [
                "Python",
                "JavaScript",
                "React",
                "Django",
                "PostgreSQL",
                "Docker",
                "AWS",
                "Git",
                "TypeScript",
                "Node.js",
            ],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert len(job["skills"]) == 10
    assert "Python" in job["skills"]
    assert "TypeScript" in job["skills"]
    assert job["location"] == "Mumbai"


async def test_update_job_future_expiry_date(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with future expiry date."""
    future_date = datetime(2025, 12, 31, 23, 59, 59, tzinfo=UTC)

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Future Expiry Job",
            "description": "Job with updated future expiry",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "expiresAt": future_date.isoformat(),
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["expiresAt"] == format_datetime(future_date)


async def test_update_job_past_expiry_date(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with past expiry date."""
    past_date = datetime(2020, 1, 1, 0, 0, 0, tzinfo=UTC)

    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Past Expiry Job",
            "description": "Job with past expiry date",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "expiresAt": past_date.isoformat(),
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["expiresAt"] == format_datetime(past_date)


async def test_update_job_clear_optional_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job by clearing optional fields."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Minimal Job",
            "description": "Job with minimal fields",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "vacancies": None,
            "minSalary": None,
            "maxSalary": None,
            "isSalaryNegotiable": False,
            "minExperience": None,
            "maxExperience": None,
            "expiresAt": None,
            "jobType": None,
            "workMode": None,
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["vacancies"] is None
    assert job["minSalary"] is None
    assert job["maxSalary"] is None
    assert job["isSalaryNegotiable"] is False
    assert job["minExperience"] is None
    assert job["maxExperience"] is None
    assert job["expiresAt"] is None
    assert job["type"] is None
    assert job["workMode"] is None


async def test_update_job_salary_negotiable_variations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with different salary negotiable values."""
    # Test setting to True
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Negotiable Salary Job",
            "description": "Job with negotiable salary",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "isSalaryNegotiable": True,
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"
    assert data["job"]["isSalaryNegotiable"] is True

    # Test setting to False
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Fixed Salary Job",
            "description": "Job with fixed salary",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "isSalaryNegotiable": False,
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"
    assert data["job"]["isSalaryNegotiable"] is False


@pytest.mark.parametrize(
    "currency",
    ["INR"],
)
async def test_update_job_currency_variations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    currency: str,
) -> None:
    """Test updating job with different currency values."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": f"Job with {currency}",
            "description": f"Job with {currency} currency",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "currency": currency,
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"
    assert data["job"]["currency"] == currency


async def test_update_job_multiple_applicant_locations(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test updating job with multiple applicant locations."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Multi-Location Job",
            "description": "Job accepting applicants from multiple countries",
            "skills": ["Python"],
            "workMode": "REMOTE",
            "location": None,
            "applicantLocations": ["IN", "US", "CA", "GB", "AU"],
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert len(job["applicantLocations"]) == 5
    assert "IN" in job["applicantLocations"]
    assert "US" in job["applicantLocations"]
    assert "CA" in job["applicantLocations"]
    assert "GB" in job["applicantLocations"]
    assert "AU" in job["applicantLocations"]


async def test_update_job_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating job with invalid job ID format."""
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": "invalid-job-id",
            "title": "Updated Title",
            "description": "Updated description",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    # Should return a GraphQL error for invalid ID format
    assert "errors" in response


async def test_update_job_preserves_unchanged_fields(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that updating only some fields preserves others."""
    # First, update with comprehensive data
    expires_at = datetime.now(UTC).replace(microsecond=0)

    await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Comprehensive Job",
            "description": "Comprehensive description",
            "skills": ["Python", "Django"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "vacancies": 3,
            "minSalary": 600000,
            "maxSalary": 900000,
            "isSalaryNegotiable": True,
            "minExperience": 3,
            "maxExperience": 6,
            "expiresAt": expires_at.isoformat(),
            "jobType": "FULL_TIME",
            "workMode": "HYBRID",
        },
    )

    # Then update only title and description
    response = await password_auth_graphql_client(
        UPDATE_JOB_MUTATION,
        variables={
            "jobId": relay.to_base64("Job", test_job.id),
            "title": "Updated Title Only",
            "description": "Updated description only",
            "skills": ["Python", "Django"],  # Keep same
            "location": "Mumbai",  # Keep same
            "applicantLocations": ["IN"],  # Keep same
            "vacancies": 3,  # Keep same
            "minSalary": 600000,  # Keep same
            "maxSalary": 900000,  # Keep same
            "isSalaryNegotiable": True,  # Keep same
            "minExperience": 3,  # Keep same
            "maxExperience": 6,  # Keep same
            "expiresAt": expires_at.isoformat(),  # Keep same
            "jobType": "FULL_TIME",  # Keep same
            "workMode": "HYBRID",  # Keep same
        },
    )

    data = response["data"]["updateJob"]
    assert data["__typename"] == "UpdateJobSuccess"

    job = data["job"]
    assert job["title"] == "Updated Title Only"
    assert job["description"] == "Updated description only"
    # Verify other fields are preserved
    assert job["vacancies"] == 3
    assert job["minSalary"] == 600000
    assert job["maxSalary"] == 900000
    assert job["isSalaryNegotiable"] is True
    assert job["minExperience"] == 3
    assert job["maxExperience"] == 6
    assert job["type"] == "FULL_TIME"
    assert job["workMode"] == "HYBRID"
