import pytest
from app.accounts.documents import Account
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient

# Constants for tests
MIN_EXPERIENCE = 2
MAX_EXPERIENCE = 5
MIN_SALARY = 50000
MAX_SALARY = 100000

UPDATE_JOB_ALERT_MUTATION = """
mutation UpdateJobAlertMutation($jobAlertId: ID!, $filters: AlertFiltersInput!, $frequency: JobAlertFrequency!) {
    updateJobAlert(jobAlertId: $jobAlertId, filters: $filters, frequency: $frequency) {
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
        ... on JobAlertNotFoundError {
            __typename
            message
        }
    }
}
"""


async def test_update_job_alert_successful(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test successful job alert update."""
    # Create an initial job alert
    initial_filters = AlertFilters(
        search_term="initial",
        location="Old Location",
        job_type=["full_time"],
        work_mode=["remote"],
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=password_account,
        filters=initial_filters,
        frequency="daily",
    )

    # Update the job alert
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
            "filters": {
                "searchTerm": "updated",
                "location": "New Location",
                "jobType": ["PART_TIME"],
                "workMode": ["OFFICE"],
            },
            "frequency": "WEEKLY",
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == "WEEKLY"
    assert data["filters"]["searchTerm"] == "updated"
    assert data["filters"]["location"] == "New Location"
    assert data["filters"]["jobType"] == ["PART_TIME"]
    assert data["filters"]["workMode"] == ["OFFICE"]
    assert "createdAt" in data


async def test_update_job_alert_with_all_filters(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test job alert update with all available filters."""
    # Create an initial job alert
    initial_filters = AlertFilters(
        search_term="initial",
        location="Old Location",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=password_account,
        filters=initial_filters,
        frequency="daily",
    )

    # Update with all filters
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
            "filters": {
                "searchTerm": "specialist",
                "location": "Miami",
                "minExperience": MIN_EXPERIENCE,
                "maxExperience": MAX_EXPERIENCE,
                "minSalary": MIN_SALARY,
                "maxSalary": MAX_SALARY,
                "jobType": ["FULL_TIME", "CONTRACT"],
                "workMode": ["HYBRID", "REMOTE"],
            },
            "frequency": "MONTHLY",
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == "MONTHLY"
    assert data["filters"]["searchTerm"] == "specialist"
    assert data["filters"]["location"] == "Miami"
    assert data["filters"]["minExperience"] == MIN_EXPERIENCE
    assert data["filters"]["maxExperience"] == MAX_EXPERIENCE
    assert data["filters"]["minSalary"] == MIN_SALARY
    assert data["filters"]["maxSalary"] == MAX_SALARY
    assert set(data["filters"]["jobType"]) == {"FULL_TIME", "CONTRACT"}
    assert set(data["filters"]["workMode"]) == {"HYBRID", "REMOTE"}


async def test_update_job_alert_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating a non-existent job alert."""
    # Use a non-existent ID
    non_existent_id = relay.to_base64("JobAlert", "000000000000000000000000")

    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": non_existent_id,
            "filters": {
                "searchTerm": "updated",
                "location": "Nowhere",
            },
            "frequency": "DAILY",
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlertNotFoundError"
    assert "message" in data


async def test_update_job_alert_already_exists(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test updating to filters that match another existing job alert."""
    # Create two job alerts
    first_filters = AlertFilters(
        search_term="first",
        location="Location One",
        job_type=["full_time"],
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    second_filters = AlertFilters(
        search_term="second",
        location="Location Two",
        job_type=["part_time"],
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    first_alert = await job_alert_repo.create(
        account=password_account,
        filters=first_filters,
        frequency="daily",
    )

    await job_alert_repo.create(
        account=password_account,
        filters=second_filters,
        frequency="daily",
    )

    # Try to update the first alert with the second alert's filters
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", first_alert.id),
            "filters": {
                "searchTerm": "second",
                "location": "Location Two",
                "jobType": ["PART_TIME"],
            },
            "frequency": "DAILY",
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlertAlreadyExistsError"
    assert "message" in data


@pytest.mark.parametrize(
    "frequency",
    [
        "WEEKLY",
        "MONTHLY",
    ],
)
async def test_update_job_alert_different_frequencies(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
    frequency: str,
) -> None:
    """Test job alert update with different frequencies."""
    # Create a job alert
    initial_filters = AlertFilters(
        search_term="initial",
        location="Original",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=password_account,
        filters=initial_filters,
        frequency="daily",
    )

    # Update the frequency
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
            "filters": {
                "searchTerm": "initial",
                "location": "Original",
            },
            "frequency": frequency,
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["frequency"] == frequency


async def test_update_job_alert_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test job alert update with an unauthenticated user."""
    # Use any ID - authentication should fail before ID check
    random_id = relay.to_base64("JobAlert", "000000000000000000000000")

    response = await graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": random_id,
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
async def test_update_job_alert_edge_case_search_terms(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
    search_term: str,
    expected_error: str | None,
) -> None:
    """Test job alert update with edge case search terms."""
    # Create a job alert
    initial_filters = AlertFilters(
        search_term="initial",
        location="Original",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=password_account,
        filters=initial_filters,
        frequency="daily",
    )

    # Update with edge case search term
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
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
        data = response["data"]["updateJobAlert"]
        # Should either succeed or fail with a known error
        assert data["__typename"] in [
            "JobAlert",
            "JobAlertAlreadyExistsError",
            "JobAlertNotFoundError",
        ]

        if data["__typename"] == "JobAlert":
            assert data["filters"]["searchTerm"] == search_term


async def test_update_job_alert_another_users_alert(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test updating another user's job alert."""
    # Create a job alert for another user
    initial_filters = AlertFilters(
        search_term="another-user",
        location="Another Location",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=foreign_password_account,
        filters=initial_filters,
        frequency="daily",
    )

    # Try to update with the authenticated user
    response = await password_auth_graphql_client(
        UPDATE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
            "filters": {
                "searchTerm": "not-my-alert",
                "location": "Unauthorized Location",
            },
            "frequency": "WEEKLY",
        },
    )

    data = response["data"]["updateJobAlert"]
    assert data["__typename"] == "JobAlertNotFoundError"
    assert "message" in data
