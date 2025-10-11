from unittest.mock import AsyncMock, patch

import pytest

from tests.integration.graphql_client import GraphQLClient

GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION = """
mutation GenerateProfileDocumentPresignedURL($contentType: String!) {
    generateProfileDocumentPresignedUrl(contentType: $contentType) {
        presignedUrl
        fileKey
    }
}
"""

UPDATE_PROFILE_RESUME_MUTATION = """
mutation UpdateProfileResumeMutation($resumeUrl: String!, $fileKey: String!) {
    updateProfileResume(resumeUrl: $resumeUrl, fileKey: $fileKey) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                resumeUrl
            }
        }
    }
}
"""


@pytest.fixture(scope="module")
def test_resume_data() -> tuple[str, str]:
    """Generate test resume data."""
    file_key = "autofill-profiles/test-resume-integration.pdf"
    resume_url = f"https://test-bucket.s3.amazonaws.com/{file_key}"
    return resume_url, file_key


@pytest.fixture(autouse=True)
def mock_s3_and_ai_operations():
    """Mock S3 and AI operations for all tests."""
    with patch(
        "app.accounts.services.ProfileParserService.parse_profile_document",
        new_callable=AsyncMock,
    ) as mock_parse:
        mock_parse.return_value = None
        yield mock_parse


async def test_update_profile_resume_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_resume fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_RESUME_MUTATION,
        variables={
            "resumeUrl": "https://example.com/resume.pdf",
            "fileKey": "autofill-profiles/test-key",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_resume_success(
    password_auth_graphql_client: GraphQLClient,
    test_resume_data: tuple[str, str],
) -> None:
    """Ensure that update_profile_resume works with valid inputs and creates profile if not exists."""
    resume_url, file_key = test_resume_data

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_RESUME_MUTATION,
        variables={
            "resumeUrl": resume_url,
            "fileKey": file_key,
        },
    )

    assert response["data"]["updateProfileResume"]["__typename"] == "Account"
    assert response["data"]["updateProfileResume"]["profile"] is not None


async def test_update_profile_resume_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
    test_resume_data: tuple[str, str],
) -> None:
    """Ensure that update_profile_resume works for webauthn accounts."""
    resume_url, file_key = test_resume_data

    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_RESUME_MUTATION,
        variables={
            "resumeUrl": resume_url,
            "fileKey": file_key,
        },
    )

    assert response["data"]["updateProfileResume"]["__typename"] == "Account"


async def test_update_profile_resume_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
    test_resume_data: tuple[str, str],
) -> None:
    """Ensure that updating resume doesn't affect other profile fields."""
    resume_url, file_key = test_resume_data

    update_personal_details_mutation = """
    mutation UpdateProfilePersonalDetailsMutation($gender: GenderType) {
        updateProfilePersonalDetails(gender: $gender) {
            __typename
            ... on Account {
                profile {
                    gender
                }
            }
        }
    }
    """

    await password_auth_graphql_client(
        update_personal_details_mutation,
        variables={"gender": "MALE"},
    )

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_RESUME_MUTATION,
        variables={
            "resumeUrl": resume_url,
            "fileKey": file_key,
        },
    )

    assert response["data"]["updateProfileResume"]["__typename"] == "Account"

    query = """
    query {
        viewer {
            ... on Account {
                profile {
                    gender
                }
            }
        }
    }
    """
    viewer_response = await password_auth_graphql_client(query, variables={})
    assert viewer_response["data"]["viewer"]["profile"]["gender"] == "MALE"
