import asyncio

from tests.integration.graphql_client import GraphQLClient, GraphQLResponse

CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION = """
mutation CreateJobApplicantResumePresignedURL {
    createJobApplicantResumePresignedUrl {
        presignedUrl
    }
}
"""


async def test_create_job_applicant_resume_presigned_url_authenticated(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful presigned URL generation for authenticated user."""
    response = await password_auth_graphql_client(
        CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION,
        variables={},
    )

    data = response["data"]["createJobApplicantResumePresignedUrl"]
    assert "presignedUrl" in data
    assert "applicant-resumes/" in data["presignedUrl"]


async def test_create_job_applicant_resume_presigned_url_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test presigned URL generation fails for unauthenticated user."""
    response = await graphql_client(
        CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION,
        variables={},
    )

    assert "errors" in response


async def test_create_job_applicant_resume_presigned_url_multiple_calls(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test multiple presigned URL generations return unique URLs."""
    response1 = await password_auth_graphql_client(
        CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION,
        variables={},
    )

    response2 = await password_auth_graphql_client(
        CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION,
        variables={},
    )

    data1 = response1["data"]["createJobApplicantResumePresignedUrl"]
    data2 = response2["data"]["createJobApplicantResumePresignedUrl"]

    assert data1["presignedUrl"] != data2["presignedUrl"]


async def test_create_job_applicant_resume_presigned_url_concurrent_requests(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test concurrent presigned URL generations return unique URLs."""

    async def perform_mutation() -> GraphQLResponse:
        return await password_auth_graphql_client(
            CREATE_JOB_APPLICANT_RESUME_PRESIGNED_URL_MUTATION,
            variables={},
        )

    responses = await asyncio.gather(*[perform_mutation() for _ in range(5)])

    urls = [
        response["data"]["createJobApplicantResumePresignedUrl"]["presignedUrl"]
        for response in responses
    ]

    assert len(urls) == len(set(urls))
