import pytest
from app.accounts.documents import Account
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo
from bson import ObjectId
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient

DELETE_JOB_ALERT_MUTATION = """
mutation DeleteJobAlertMutation($jobAlertId: ID!) {
    deleteJobAlert(jobAlertId: $jobAlertId) {
        __typename
        ... on JobAlert {
            id
            frequency
            filters {
                searchTerm
                location
            }
        }
        ... on JobAlertNotFoundError {
            __typename
            message
        }
    }
}
"""


async def test_delete_job_alert_successful(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test successful job alert deletion."""
    # Create a job alert
    filters = AlertFilters(
        search_term="to-delete",
        location="Delete Location",
        job_type=["full_time"],
        work_mode=["remote"],
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    job_alert = await job_alert_repo.create(
        account=password_account,
        filters=filters,
        frequency="daily",
    )

    # Delete the job alert
    response = await password_auth_graphql_client(
        DELETE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
        },
    )

    data = response["data"]["deleteJobAlert"]
    assert data["__typename"] == "JobAlert"
    assert data["id"] == relay.to_base64("JobAlert", job_alert.id)

    # Verify that the alert was actually deleted from the database
    retrieved_alert = await job_alert_repo.get_by_id(ObjectId(job_alert.id))
    assert retrieved_alert is None


async def test_delete_job_alert_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test deleting a non-existent job alert."""
    # Use a non-existent ID
    non_existent_id = relay.to_base64("JobAlert", "000000000000000000000000")

    response = await password_auth_graphql_client(
        DELETE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": non_existent_id,
        },
    )

    data = response["data"]["deleteJobAlert"]
    assert data["__typename"] == "JobAlertNotFoundError"
    assert "message" in data


async def test_delete_job_alert_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test job alert deletion with an unauthenticated user."""
    # Use any ID - authentication should fail before ID check
    random_id = relay.to_base64("JobAlert", "000000000000000000000000")

    response = await graphql_client(
        DELETE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": random_id,
        },
    )

    # Should return an authentication error
    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_delete_job_alert_another_users_alert(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test deleting another user's job alert."""
    # Create a job alert for another user
    filters = AlertFilters(
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
        filters=filters,
        frequency="daily",
    )

    # Try to delete with the authenticated user
    response = await password_auth_graphql_client(
        DELETE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": relay.to_base64("JobAlert", job_alert.id),
        },
    )

    data = response["data"]["deleteJobAlert"]
    assert data["__typename"] == "JobAlertNotFoundError"
    assert "message" in data

    # Verify the job alert still exists in the database
    retrieved_alert = await job_alert_repo.get_by_id(ObjectId(job_alert.id))
    assert retrieved_alert is not None


@pytest.mark.parametrize(
    "job_alert_id",
    [
        relay.to_base64("invalid-format", ""),  # Invalid format
        relay.to_base64("WrongType", "123"),
    ],
)
async def test_delete_job_alert_invalid_id(
    password_auth_graphql_client: GraphQLClient,
    job_alert_id: str,
) -> None:
    """Test deletion with invalid job alert IDs."""
    # Execute the mutation with invalid ID
    response = await password_auth_graphql_client(
        DELETE_JOB_ALERT_MUTATION,
        variables={
            "jobAlertId": job_alert_id,
        },
    )
    # If the error was caught by the resolver
    data = response["data"]["deleteJobAlert"]
    assert data["__typename"] == "JobAlertNotFoundError"
