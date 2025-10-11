import asyncio

import pytest

from tests.integration.graphql_client import GraphQLClient, GraphQLResponse

GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION = """
mutation GenerateProfileDocumentPresignedURL($contentType: String!) {
    generateProfileDocumentPresignedUrl(contentType: $contentType) {
        presignedUrl
        fileKey
    }
}
"""


async def test_generate_profile_document_presigned_url_authenticated(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful presigned URL generation for authenticated user."""
    response = await password_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    data = response["data"]["generateProfileDocumentPresignedUrl"]
    assert "presignedUrl" in data
    assert "fileKey" in data
    assert "autofill-profiles/" in data["fileKey"]


async def test_generate_profile_document_presigned_url_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test presigned URL generation fails for unauthenticated user."""
    response = await graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    assert "errors" in response


@pytest.mark.parametrize(
    ("content_type", "description"),
    [
        ("application/pdf", "PDF document"),
        ("application/msword", "Word document"),
        (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "DOCX document",
        ),
        ("image/jpeg", "JPEG image"),
        ("image/png", "PNG image"),
    ],
)
async def test_generate_profile_document_presigned_url_valid_content_types(
    password_auth_graphql_client: GraphQLClient,
    content_type: str,
    description: str,
) -> None:
    """Test presigned URL generation with various valid content types."""
    response = await password_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": content_type},
    )

    data = response["data"]["generateProfileDocumentPresignedUrl"]
    assert "presignedUrl" in data, f"Failed for case: {description}"
    assert "fileKey" in data
    assert "autofill-profiles/" in data["fileKey"]


async def test_generate_profile_document_presigned_url_multiple_calls(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test multiple presigned URL generations return unique URLs and file keys."""
    response1 = await password_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    response2 = await password_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    data1 = response1["data"]["generateProfileDocumentPresignedUrl"]
    data2 = response2["data"]["generateProfileDocumentPresignedUrl"]

    assert data1["presignedUrl"] != data2["presignedUrl"]
    assert data1["fileKey"] != data2["fileKey"]


async def test_generate_profile_document_presigned_url_concurrent_requests(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test concurrent presigned URL generations return unique URLs and file keys."""

    async def perform_mutation() -> GraphQLResponse:
        return await password_auth_graphql_client(
            GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
            variables={"contentType": "application/pdf"},
        )

    responses = await asyncio.gather(*[perform_mutation() for _ in range(5)])

    urls = [
        response["data"]["generateProfileDocumentPresignedUrl"]["presignedUrl"]
        for response in responses
    ]
    file_keys = [
        response["data"]["generateProfileDocumentPresignedUrl"]["fileKey"]
        for response in responses
    ]

    assert len(urls) == len(set(urls))
    assert len(file_keys) == len(set(file_keys))


async def test_generate_profile_document_presigned_url_different_users(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Test different users get unique presigned URLs and file keys."""
    response1 = await password_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    response2 = await webauthn_auth_graphql_client(
        GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
        variables={"contentType": "application/pdf"},
    )

    data1 = response1["data"]["generateProfileDocumentPresignedUrl"]
    data2 = response2["data"]["generateProfileDocumentPresignedUrl"]

    assert data1["presignedUrl"] != data2["presignedUrl"]
    assert data1["fileKey"] != data2["fileKey"]
