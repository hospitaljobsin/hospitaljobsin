import pytest
from app.accounts.documents import Account
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo, RecommendedJobAlertRepo

from tests.integration.graphql_client import GraphQLClient

ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION = """
mutation EnableRecommendedJobAlertsMutation($frequency: JobAlertFrequency!) {
    enableRecommendedJobAlerts(frequency: $frequency) {
        __typename
        ... on EnableRecommendedJobAlertsSuccess {
            jobAlertEdges {
                node {
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
            }
            removedRecommendedJobAlertIds
        }
        ... on RecommendedJobAlertsNotFoundError {
            __typename
            message
        }
    }
}
"""


async def test_enable_recommended_job_alerts_successful(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test successful enabling of recommended job alerts."""
    # Create recommended job alerts
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
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "DAILY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"
    assert len(data["jobAlertEdges"]) == 2
    assert len(data["removedRecommendedJobAlertIds"]) == 2

    # Verify job alerts were created
    job_alert_edges = data["jobAlertEdges"]
    for edge in job_alert_edges:
        node = edge["node"]
        assert node["frequency"] == "DAILY"
        assert "createdAt" in node
        assert node["filters"]["searchTerm"] in ["nurse", "doctor"]

    # Verify recommended job alerts were removed
    remaining_recommended = await recommended_job_alert_repo.get_all_list(
        password_account
    )
    assert len(remaining_recommended) == 0

    # Verify job alerts exist in database
    created_alerts = await job_alert_repo.get_all_list(password_account)
    assert len(created_alerts) == 2

    # Cleanup
    for alert in created_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_no_recommendations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test enabling recommended job alerts when no recommendations exist."""
    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "WEEKLY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "RecommendedJobAlertsNotFoundError"
    assert "message" in data


@pytest.mark.parametrize(
    "frequency",
    ["DAILY", "WEEKLY", "MONTHLY"],
)
async def test_enable_recommended_job_alerts_different_frequencies(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
    frequency: str,
) -> None:
    """Test enabling recommended job alerts with different frequencies."""
    filters = AlertFilters(
        search_term=f"test-{frequency.lower()}",
        location="Test City",
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await recommended_job_alert_repo.create(password_account, filters)

    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": frequency},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"
    assert len(data["jobAlertEdges"]) == 1
    assert data["jobAlertEdges"][0]["node"]["frequency"] == frequency

    # Cleanup
    created_alerts = await job_alert_repo.get_all_list(password_account)
    for alert in created_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_single_recommendation(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test enabling a single recommended job alert."""
    filters = AlertFilters(
        search_term="therapist",
        location="Chicago",
        job_type=["part_time"],
        work_mode=["office"],
        min_experience=1,
        max_experience=3,
        min_salary=40000,
        max_salary=60000,
    )

    await recommended_job_alert_repo.create(password_account, filters)

    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "MONTHLY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"
    assert len(data["jobAlertEdges"]) == 1
    assert len(data["removedRecommendedJobAlertIds"]) == 1

    node = data["jobAlertEdges"][0]["node"]
    assert node["frequency"] == "MONTHLY"
    assert node["filters"]["searchTerm"] == "therapist"
    assert node["filters"]["location"] == "Chicago"
    assert node["filters"]["jobType"] == ["PART_TIME"]
    assert node["filters"]["workMode"] == ["OFFICE"]
    assert node["filters"]["minExperience"] == 1
    assert node["filters"]["maxExperience"] == 3
    assert node["filters"]["minSalary"] == 40000
    assert node["filters"]["maxSalary"] == 60000

    # Cleanup
    created_alerts = await job_alert_repo.get_all_list(password_account)
    for alert in created_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_multiple_recommendations(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test enabling multiple recommended job alerts."""
    filters_list = [
        AlertFilters(
            search_term="pharmacist",
            location="Seattle",
            job_type=["full_time"],
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        ),
        AlertFilters(
            search_term="radiologist",
            location="Portland",
            job_type=["contract", "full_time"],
            work_mode=["remote", "hybrid"],
            min_experience=5,
            max_experience=10,
            min_salary=100000,
            max_salary=150000,
        ),
        AlertFilters(
            search_term="surgeon",
            location="Denver",
            job_type=None,
            work_mode=["office"],
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        ),
    ]

    await recommended_job_alert_repo.create_many(password_account, filters_list)

    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "WEEKLY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"
    assert len(data["jobAlertEdges"]) == 3
    assert len(data["removedRecommendedJobAlertIds"]) == 3

    # Verify all search terms are present
    search_terms = {
        edge["node"]["filters"]["searchTerm"] for edge in data["jobAlertEdges"]
    }
    assert search_terms == {"pharmacist", "radiologist", "surgeon"}

    # Cleanup
    created_alerts = await job_alert_repo.get_all_list(password_account)
    for alert in created_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_with_null_filters(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test enabling recommended job alerts with null/empty filter values."""
    filters = AlertFilters(
        search_term="minimal-filters",
        location=None,
        job_type=None,
        work_mode=None,
        min_experience=None,
        max_experience=None,
        min_salary=None,
        max_salary=None,
    )

    await recommended_job_alert_repo.create(password_account, filters)

    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "DAILY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"
    assert len(data["jobAlertEdges"]) == 1

    node = data["jobAlertEdges"][0]["node"]
    assert node["filters"]["searchTerm"] == "minimal-filters"
    assert node["filters"]["location"] is None
    assert node["filters"]["jobType"] is None
    assert node["filters"]["workMode"] is None
    assert node["filters"]["minExperience"] is None
    assert node["filters"]["maxExperience"] is None
    assert node["filters"]["minSalary"] is None
    assert node["filters"]["maxSalary"] is None

    # Cleanup
    created_alerts = await job_alert_repo.get_all_list(password_account)
    for alert in created_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test enabling recommended job alerts with an unauthenticated user."""
    response = await graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "DAILY"},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_enable_recommended_job_alerts_cleanup_after_enable(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test that recommended job alerts are properly cleaned up after enabling."""
    # Create multiple recommended job alerts using bulk create
    filters_list = [
        AlertFilters(
            search_term=f"cleanup-test-{i}",
            location=f"City-{i}",
            job_type=None,
            work_mode=None,
            min_experience=None,
            max_experience=None,
            min_salary=None,
            max_salary=None,
        )
        for i in range(3)
    ]
    await recommended_job_alert_repo.create_many(password_account, filters_list)

    # Verify recommended alerts exist before enabling
    recommended_before = await recommended_job_alert_repo.get_all_list(password_account)
    assert len(recommended_before) == 3

    # Enable recommended job alerts
    response = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "DAILY"},
    )

    data = response["data"]["enableRecommendedJobAlerts"]
    assert data["__typename"] == "EnableRecommendedJobAlertsSuccess"

    # Verify recommended alerts are completely removed
    recommended_after = await recommended_job_alert_repo.get_all_list(password_account)
    assert len(recommended_after) == 0

    # Verify job alerts were created
    job_alerts = await job_alert_repo.get_all_list(password_account)
    assert len(job_alerts) == 3

    # Cleanup
    for alert in job_alerts:
        await job_alert_repo.delete(alert)


async def test_enable_recommended_job_alerts_idempotency(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    recommended_job_alert_repo: RecommendedJobAlertRepo,
    job_alert_repo: JobAlertRepo,
) -> None:
    """Test that enabling recommended job alerts twice returns error on second attempt."""
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

    # First enable should succeed
    response1 = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "DAILY"},
    )

    data1 = response1["data"]["enableRecommendedJobAlerts"]
    assert data1["__typename"] == "EnableRecommendedJobAlertsSuccess"

    # Second enable should fail (no recommended alerts left)
    response2 = await password_auth_graphql_client(
        ENABLE_RECOMMENDED_JOB_ALERTS_MUTATION,
        variables={"frequency": "WEEKLY"},
    )

    data2 = response2["data"]["enableRecommendedJobAlerts"]
    assert data2["__typename"] == "RecommendedJobAlertsNotFoundError"

    # Cleanup
    created_alerts = await job_alert_repo.get_all_list(password_account)
    for alert in created_alerts:
        await job_alert_repo.delete(alert)
