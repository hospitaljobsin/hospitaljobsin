import pytest
from app.accounts.documents import Account
from app.core.constants import MAX_JOB_ALERTS_PER_ACCOUNT
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo

from tests.integration.graphql_client import GraphQLClient

# Constants for tests
MIN_EXPERIENCE = 2
MAX_EXPERIENCE = 5
MIN_SALARY = 50000
MAX_SALARY = 100000

CREATE_JOB_ALERT_MUTATION = """
mutation CreateJobAlertMutation($filters: AlertFiltersInput!, $frequency: JobAlertFrequency!) {
    createJobAlert(filters: $filters, frequency: $frequency) {
        __typename
        ... on JobAlert {
            id
            frequency
            filters {
                searchTerm
                location
                minExperience
                maxExperience
                minSalary
                maxSalary
                jobType
                workMode
            }
            createdAt
        }
        ... on JobAlertAlreadyExistsError {
            __typename
            message
        }
        ... on MaxJobAlertsReachedError {
            __typename
            message
        }
    }
}
"""


async def test_create_job_alert_successful(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful job alert creation."""
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": "nurse",
                "location": "New York",
                "jobType": ["FULL_TIME"],
                "workMode": ["REMOTE"],
            },
            "frequency": "DAILY",
        },
    )

    data = response["data"]["createJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == "DAILY"
    assert data["filters"]["searchTerm"] == "nurse"
    assert data["filters"]["location"] == "New York"
    assert data["filters"]["jobType"] == ["FULL_TIME"]
    assert data["filters"]["workMode"] == ["REMOTE"]
    assert "createdAt" in data


async def test_create_job_alert_with_all_filters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test job alert creation with all available filters."""
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": "doctor",
                "location": "Boston",
                "minExperience": MIN_EXPERIENCE,
                "maxExperience": MAX_EXPERIENCE,
                "minSalary": MIN_SALARY,
                "maxSalary": MAX_SALARY,
                "jobType": ["FULL_TIME", "CONTRACT"],
                "workMode": ["HYBRID", "OFFICE"],
            },
            "frequency": "WEEKLY",
        },
    )

    data = response["data"]["createJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == "WEEKLY"
    assert data["filters"]["searchTerm"] == "doctor"
    assert data["filters"]["location"] == "Boston"
    assert data["filters"]["minExperience"] == MIN_EXPERIENCE
    assert data["filters"]["maxExperience"] == MAX_EXPERIENCE
    assert data["filters"]["minSalary"] == MIN_SALARY
    assert data["filters"]["maxSalary"] == MAX_SALARY
    assert set(data["filters"]["jobType"]) == {"FULL_TIME", "CONTRACT"}
    assert set(data["filters"]["workMode"]) == {"HYBRID", "OFFICE"}


async def test_create_job_alert_already_exists(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test job alert creation when an alert with the same filters already exists."""
    # Create an initial job alert with the same parameters
    filters = AlertFilters(
        search_term="developer",
        location="San Francisco",
        job_type=["full_time"],
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await job_alert_repo.create(
        account=password_account,
        filters=filters,
        frequency="daily",
    )

    # Try to create the same alert again
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": "developer",
                "location": "San Francisco",
                "jobType": ["FULL_TIME"],
            },
            "frequency": "DAILY",
        },
    )

    data = response["data"]["createJobAlert"]
    assert data["__typename"] == "JobAlertAlreadyExistsError"
    assert "message" in data


@pytest.mark.parametrize(
    "frequency",
    [
        "DAILY",
        "WEEKLY",
        "MONTHLY",
    ],
)
async def test_create_job_alert_different_frequencies(
    password_auth_graphql_client: GraphQLClient,
    frequency: str,
) -> None:
    """Test job alert creation with different frequencies."""
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": f"test-{frequency}",
                "location": "Chicago",
            },
            "frequency": frequency,
        },
    )

    data = response["data"]["createJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == frequency


async def test_create_job_alert_max_alerts_reached(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test job alert creation when maximum number of alerts is reached."""
    # Create maximum allowed number of alerts
    for i in range(MAX_JOB_ALERTS_PER_ACCOUNT):
        filters = AlertFilters(
            search_term=f"test-max-{i}",
            location="Test Location",
            job_type=None,
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        )

        await job_alert_repo.create(
            account=password_account,
            filters=filters,
            frequency="daily",
        )

    # Try to create one more alert
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": "one-too-many",
                "location": "Over Limit",
            },
            "frequency": "DAILY",
        },
    )

    data = response["data"]["createJobAlert"]
    assert data["__typename"] == "MaxJobAlertsReachedError"
    assert "message" in data


async def test_create_job_alert_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test job alert creation with an unauthenticated user."""
    response = await graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": "unauthorized",
                "location": "Nowhere",
            },
            "frequency": "DAILY",
        },
    )

    # Should return an authentication error
    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


@pytest.mark.parametrize(
    ("search_term", "expected_error"),
    [
        ("", None),  # Empty search term
        ("a", None),  # Single character
        ("a" * 200, None),  # Long search term
    ],
)
async def test_create_job_alert_edge_case_search_terms(
    password_auth_graphql_client: GraphQLClient,
    search_term: str,
    expected_error: str | None,
) -> None:
    """Test job alert creation with edge case search terms."""
    response = await password_auth_graphql_client(
        CREATE_JOB_ALERT_MUTATION,
        variables={
            "filters": {
                "searchTerm": search_term,
                "location": "Edge Case City",
            },
            "frequency": "DAILY",
        },
    )

    if expected_error:
        assert "errors" in response
    else:
        data = response["data"]["createJobAlert"]
        # Should either succeed or fail with a known error
        assert data["__typename"] in [
            "JobAlert",
            "JobAlertAlreadyExistsError",
            "MaxJobAlertsReachedError",
        ]

        if data["__typename"] == "JobAlert":
            assert data["filters"]["searchTerm"] == search_term
