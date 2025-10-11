import asyncio

import pytest

from tests.integration.graphql_client import GraphQLClient, GraphQLResponse

CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION = """
mutation CreateProfilePicturePresignedURL($contentType: String!) {
    createProfilePicturePresignedUrl(contentType: $contentType) {
        presignedUrl
    }
}
"""


async def test_create_profile_picture_presigned_url_authenticated(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful presigned URL generation for authenticated user."""
    response = await password_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    data = response["data"]["createProfilePicturePresignedUrl"]
    assert "presignedUrl" in data
    assert "profile-pictures/" in data["presignedUrl"]


async def test_create_profile_picture_presigned_url_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test presigned URL generation fails for unauthenticated user."""
    response = await graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    assert "errors" in response


@pytest.mark.parametrize(
    ("content_type", "description"),
    [
        ("image/jpeg", "JPEG image"),
        ("image/png", "PNG image"),
        ("image/gif", "GIF image"),
        ("image/webp", "WebP image"),
        ("image/svg+xml", "SVG image"),
    ],
)
async def test_create_profile_picture_presigned_url_valid_content_types(
    password_auth_graphql_client: GraphQLClient,
    content_type: str,
    description: str,
) -> None:
    """Test presigned URL generation with various valid content types."""
    response = await password_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": content_type},
    )

    data = response["data"]["createProfilePicturePresignedUrl"]
    assert "presignedUrl" in data, f"Failed for case: {description}"
    assert "profile-pictures/" in data["presignedUrl"]


async def test_create_profile_picture_presigned_url_multiple_calls(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test multiple presigned URL generations return unique URLs."""
    response1 = await password_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    response2 = await password_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    data1 = response1["data"]["createProfilePicturePresignedUrl"]
    data2 = response2["data"]["createProfilePicturePresignedUrl"]

    assert data1["presignedUrl"] != data2["presignedUrl"]


async def test_create_profile_picture_presigned_url_concurrent_requests(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test concurrent presigned URL generations return unique URLs."""

    async def perform_mutation() -> GraphQLResponse:
        return await password_auth_graphql_client(
            CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
            variables={"contentType": "image/jpeg"},
        )

    responses = await asyncio.gather(*[perform_mutation() for _ in range(5)])

    urls = [
        response["data"]["createProfilePicturePresignedUrl"]["presignedUrl"]
        for response in responses
    ]

    assert len(urls) == len(set(urls))


async def test_create_profile_picture_presigned_url_different_users(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Test different users get unique presigned URLs."""
    response1 = await password_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    response2 = await webauthn_auth_graphql_client(
        CREATE_PROFILE_PICTURE_PRESIGNED_URL_MUTATION,
        variables={"contentType": "image/jpeg"},
    )

    data1 = response1["data"]["createProfilePicturePresignedUrl"]
    data2 = response2["data"]["createProfilePicturePresignedUrl"]

    assert data1["presignedUrl"] != data2["presignedUrl"]
