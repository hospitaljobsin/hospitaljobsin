from app.accounts.documents import Account
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import RecommendedJobAlertRepo

from tests.integration.graphql_client import GraphQLClient

REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION = """
mutation RemoveRecommendedJobAlertsMutation {
    removeRecommendedJobAlerts {
        __typename
        ... on RemoveRecommendedJobAlertsSuccess {
            removedRecommendedJobAlertIds
        }
        ... on RecommendedJobAlertsNotFoundError {
            __typename
            message
        }
    }
}
"""


async def test_remove_recommended_job_alerts_successful(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
) -> None:
    """Test successful removal of recommended job alerts."""
    filters1 = AlertFilters(
        search_term="nurse",
        location="New York",
        job_type=["full_time"],
        work_mode=["remote"],
        min_experience=2,
        max_experience=5,
        min_salary=50000,
        max_salary=80000,
    )
    filters2 = AlertFilters(
        search_term="doctor",
        location="Boston",
        job_type=["contract"],
        work_mode=["hybrid"],
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await recommended_job_alert_repo.create(password_account, filters1)
    await recommended_job_alert_repo.create(password_account, filters2)

    response = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data = response["data"]["removeRecommendedJobAlerts"]
    assert data["__typename"] == "RemoveRecommendedJobAlertsSuccess"
    assert len(data["removedRecommendedJobAlertIds"]) == 2

    remaining_recommended = await recommended_job_alert_repo.get_all_list(
        password_account
    )
    assert len(remaining_recommended) == 0


async def test_remove_recommended_job_alerts_no_recommendations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test removing recommended job alerts when no recommendations exist."""
    response = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data = response["data"]["removeRecommendedJobAlerts"]
    assert data["__typename"] == "RecommendedJobAlertsNotFoundError"
    assert "message" in data


async def test_remove_recommended_job_alerts_single_recommendation(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
) -> None:
    """Test removing a single recommended job alert."""
    filters = AlertFilters(
        search_term="therapist",
        location="Chicago",
        job_type=[],
        work_mode=[],
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await recommended_job_alert_repo.create(password_account, filters)

    response = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data = response["data"]["removeRecommendedJobAlerts"]
    assert data["__typename"] == "RemoveRecommendedJobAlertsSuccess"
    assert len(data["removedRecommendedJobAlertIds"]) == 1

    remaining_recommended = await recommended_job_alert_repo.get_all_list(
        password_account
    )
    assert len(remaining_recommended) == 0


async def test_remove_recommended_job_alerts_multiple_recommendations(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
) -> None:
    """Test removing multiple recommended job alerts."""
    filters_list = [
        AlertFilters(
            search_term="pharmacist",
            location="Seattle",
            job_type=None,
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        ),
        AlertFilters(
            search_term="radiologist",
            location="Portland",
            job_type=["contract"],
            work_mode=["remote"],
            min_experience=5,
            max_experience=10,
            min_salary=100000,
            max_salary=150000,
        ),
        AlertFilters(
            search_term="surgeon",
            location="Denver",
            job_type=None,
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        ),
    ]

    for filters in filters_list:
        await recommended_job_alert_repo.create(password_account, filters)

    response = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data = response["data"]["removeRecommendedJobAlerts"]
    assert data["__typename"] == "RemoveRecommendedJobAlertsSuccess"
    assert len(data["removedRecommendedJobAlertIds"]) == 3

    remaining_recommended = await recommended_job_alert_repo.get_all_list(
        password_account
    )
    assert len(remaining_recommended) == 0


async def test_remove_recommended_job_alerts_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test removing recommended job alerts with an unauthenticated user."""
    response = await graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_remove_recommended_job_alerts_idempotency(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
) -> None:
    """Test that removing recommended job alerts twice returns error on second attempt."""
    filters = AlertFilters(
        search_term="idempotency-test",
        location="Test Location",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await recommended_job_alert_repo.create(password_account, filters)

    response1 = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data1 = response1["data"]["removeRecommendedJobAlerts"]
    assert data1["__typename"] == "RemoveRecommendedJobAlertsSuccess"

    response2 = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data2 = response2["data"]["removeRecommendedJobAlerts"]
    assert data2["__typename"] == "RecommendedJobAlertsNotFoundError"


async def test_remove_recommended_job_alerts_complete_cleanup(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
) -> None:
    """Test that all recommended job alerts are completely removed."""
    for i in range(5):
        filters = AlertFilters(
            search_term=f"cleanup-test-{i}",
            location=f"City-{i}",
            job_type=None,
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        )
        await recommended_job_alert_repo.create(password_account, filters)

    recommended_before = await recommended_job_alert_repo.get_all_list(password_account)
    assert len(recommended_before) == 5

    response = await password_auth_graphql_client(
        REMOVE_RECOMMENDED_JOB_ALERTS_MUTATION,
    )

    data = response["data"]["removeRecommendedJobAlerts"]
    assert data["__typename"] == "RemoveRecommendedJobAlertsSuccess"
    assert len(data["removedRecommendedJobAlertIds"]) == 5

    recommended_after = await recommended_job_alert_repo.get_all_list(password_account)
    assert len(recommended_after) == 0
