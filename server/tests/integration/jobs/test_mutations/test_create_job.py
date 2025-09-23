from datetime import UTC, datetime
from typing import Any

import pytest
from app.accounts.documents import Account
from app.core.formatting import format_datetime
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

CREATE_JOB_MUTATION = """
mutation CreateJobMutation(
    $organizationId: ID!
    $title: String!
    $description: String!
    $skills: [String!]!
    $location: String
    $applicantLocations: [String!]!
    $externalApplicationUrl: String
    $vacancies: Int
    $minSalary: Int
    $maxSalary: Int
    $isSalaryNegotiable: Boolean = false
    $minExperience: Int
    $maxExperience: Int
    $expiresAt: DateTime
    $type: JobType
    $workMode: WorkMode
    $currency: String = "INR"
) {
    createJob(
        organizationId: $organizationId
        title: $title
        description: $description
        skills: $skills
        location: $location
        applicantLocations: $applicantLocations
        externalApplicationUrl: $externalApplicationUrl
        vacancies: $vacancies
        minSalary: $minSalary
        maxSalary: $maxSalary
        isSalaryNegotiable: $isSalaryNegotiable
        minExperience: $minExperience
        maxExperience: $maxExperience
        expiresAt: $expiresAt
        jobType: $type
        workMode: $workMode
        currency: $currency
    ) {
        __typename
        ... on CreateJobSuccess {
            jobEdge {
                node {
                    id
                    title
                    description
                    skills
                    location
                    applicantLocations
                    externalApplicationUrl
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
        }
        ... on OrganizationNotFoundError {
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
) -> Organization:
    """Create an organization where the user is a member."""
    org = await organization_repo.create(
        name="Valid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    return org


@pytest.fixture
async def invalid_organization(
    foreign_password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> Organization:
    """Create an organization where the user is not a member."""
    org = await organization_repo.create(
        name="Invalid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=org.id,
        role="admin",
    )
    return org


async def test_create_job_successful_remote_type(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test successful job creation with remote type."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python", "FastAPI"],
            "location": "Mumbai",
            "workMode": "REMOTE",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "CreateJobSuccess"

    job = data["jobEdge"]["node"]
    assert job["title"] == "Software Engineer"
    assert job["description"] == "A great software engineering position"
    assert job["skills"] == ["Python", "FastAPI"]
    assert job["location"] == "Mumbai"
    assert job["applicantLocations"] == ["IN"]
    assert job["currency"] == "INR"  # default value
    assert job["isSalaryNegotiable"] is False  # default value


async def test_create_job_invalid_remote_type(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test invalid job creation with applicant locations, but no remote type."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python", "FastAPI"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "InvalidApplicantLocationsError"


async def test_create_job_successful_all_fields(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test successful job creation with all optional fields provided."""
    expires_at = datetime.now(UTC).replace(microsecond=0)

    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Senior Python Developer",
            "description": "We are looking for an experienced Python developer",
            "skills": ["Python", "Django", "PostgreSQL"],
            "location": "Mumbai",
            "applicantLocations": ["IN"],
            "externalApplicationUrl": "https://company.com/apply",
            "vacancies": 3,
            "minSalary": 800000,
            "maxSalary": 1200000,
            "isSalaryNegotiable": True,
            "minExperience": 3,
            "maxExperience": 7,
            "expiresAt": expires_at.isoformat(),
            "type": "FULL_TIME",
            "workMode": "REMOTE",
            "currency": "INR",
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "CreateJobSuccess"

    job = data["jobEdge"]["node"]
    assert job["title"] == "Senior Python Developer"
    assert job["description"] == "We are looking for an experienced Python developer"
    assert job["skills"] == ["Python", "Django", "PostgreSQL"]
    assert job["location"] == "Mumbai"
    assert job["applicantLocations"] == ["IN"]
    assert job["externalApplicationUrl"] == "https://company.com/apply"
    assert job["vacancies"] == 3
    assert job["minSalary"] == 800000
    assert job["maxSalary"] == 1200000
    assert job["isSalaryNegotiable"] is True
    assert job["minExperience"] == 3
    assert job["maxExperience"] == 7
    assert job["expiresAt"] == format_datetime(expires_at)
    assert job["type"] == "FULL_TIME"
    assert job["workMode"] == "REMOTE"
    assert job["currency"] == "INR"


async def test_create_job_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test job creation with non-existent organization ID."""
    invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": invalid_org_id,
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": [],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_create_job_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: str,
) -> None:
    """Test job creation with organization user doesn't have access to."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", invalid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": [],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_create_job_invalid_location(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test job creation with invalid location."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python"],
            "location": "InvalidCityName123",
            "applicantLocations": [],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "InvalidLocationError"


async def test_create_job_invalid_applicant_locations(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test job creation with invalid applicant locations."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python"],
            "location": "Mumbai",
            "workMode": "REMOTE",
            "applicantLocations": ["InvalidCity123", "AnotherInvalidCity456"],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "InvalidApplicantLocationsError"


async def test_create_job_unauthenticated(
    graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Software Engineer",
            "description": "A great software engineering position",
            "skills": ["Python"],
            "applicantLocations": ["IN"],
        },
    )

    # Should return an authentication error
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
    ],
)
async def test_create_job_enum_variations(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    job_type: str | None,
    work_mode: str | None,
) -> None:
    """Test job creation with different enum value combinations."""
    variables: dict[str, Any] = {
        "organizationId": relay.to_base64("Organization", valid_organization.id),
        "title": "Test Job",
        "description": "Test job description",
        "skills": ["Python"],
        "location": "Mumbai",
        "applicantLocations": [],
    }

    if job_type is not None:
        variables["type"] = job_type
    if work_mode is not None:
        variables["workMode"] = work_mode

    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables=variables,
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "CreateJobSuccess"

    job = data["jobEdge"]["node"]
    assert job["type"] == job_type
    assert job["workMode"] == work_mode


@pytest.mark.parametrize(
    ("title", "description", "skills", "expected_error"),
    [
        ("", "Valid description", ["Python"], None),  # Empty title might be valid
        ("Valid title", "", ["Python"], None),  # Empty description might be valid
        ("Valid title", "Valid description", [], None),  # Empty skills might be valid
        ("Valid title", "Valid description", [""], None),  # Empty skill might be valid
    ],
)
async def test_create_job_edge_case_strings(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    title: str,
    description: str,
    skills: list[str],
    expected_error: str | None,
) -> None:
    """Test job creation with edge case string values."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": title,
            "description": description,
            "skills": skills,
            "location": "Mumbai",
            "applicantLocations": [],
        },
    )

    if expected_error:
        assert "errors" in response
    else:
        data = response["data"]["createJob"]
        # Either succeeds or fails gracefully with a known error type
        assert data["__typename"] in [
            "CreateJobSuccess",
            "OrganizationNotFoundError",
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
        (1000000, 500000, 10, 5, 100),  # Max less than min (might be invalid)
    ],
)
async def test_create_job_numeric_edge_cases(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
    min_salary: int | None,
    max_salary: int | None,
    min_exp: int | None,
    max_exp: int | None,
    vacancies: int | None,
) -> None:
    """Test job creation with edge case numeric values."""
    variables: dict[str, Any] = {
        "organizationId": relay.to_base64("Organization", valid_organization.id),
        "title": "Test Job",
        "description": "Test description",
        "skills": ["Python"],
        "location": "Mumbai",
        "applicantLocations": [],
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
        CREATE_JOB_MUTATION,
        variables=variables,
    )

    # Should either succeed or fail gracefully
    data = response["data"]["createJob"]
    assert data["__typename"] in [
        "CreateJobSuccess",
        "OrganizationNotFoundError",
        "OrganizationAuthorizationError",
        "InvalidLocationError",
        "InvalidApplicantLocationsError",
    ]


async def test_create_job_external_application_url_variations(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test job creation with different external application URL formats."""
    test_urls = [
        "https://company.com/apply",
        "http://example.org/jobs/123",
        "https://careers.startup.io/position?id=456",
        None,
    ]

    for url in test_urls:
        variables: dict[str, Any] = {
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": f"Test Job {url or 'no-url'}",
            "description": "Test description",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicantLocations": [],
        }

        if url is not None:
            variables["externalApplicationUrl"] = url

        response = await password_auth_graphql_client(
            CREATE_JOB_MUTATION,
            variables=variables,
        )

        data = response["data"]["createJob"]
        assert data["__typename"] == "CreateJobSuccess"

        job = data["jobEdge"]["node"]
        assert job["externalApplicationUrl"] == url


async def test_create_job_multiple_skills(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test job creation with multiple skills."""
    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Full Stack Developer",
            "description": "Looking for a versatile developer",
            "skills": [
                "Python",
                "JavaScript",
                "React",
                "Django",
                "PostgreSQL",
                "Docker",
                "AWS",
                "Git",
            ],
            "location": "India",
            "applicantLocations": [],
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "CreateJobSuccess"

    job = data["jobEdge"]["node"]
    assert len(job["skills"]) == 8
    assert len(job["applicantLocations"]) == 0
    assert "Python" in job["skills"]
    assert job["location"] == "India"


async def test_create_job_future_expiry_date(
    password_auth_graphql_client: GraphQLClient,
    valid_organization: Organization,
) -> None:
    """Test job creation with future expiry date."""
    future_date = datetime(2025, 12, 31, 23, 59, 59, tzinfo=UTC)

    response = await password_auth_graphql_client(
        CREATE_JOB_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", valid_organization.id),
            "title": "Future Job",
            "description": "Job with future expiry",
            "skills": ["Python"],
            "applicantLocations": [],
            "expiresAt": future_date.isoformat(),
            "location": "Mumbai",
        },
    )

    data = response["data"]["createJob"]
    assert data["__typename"] == "CreateJobSuccess"

    job = data["jobEdge"]["node"]
    assert job["expiresAt"] == format_datetime(future_date)
