# import pytest
# from aioinject import Container
# from types_aiobotocore_s3.client import S3Client

# from app.config import AWSSettings
# from tests.integration.graphql_client import GraphQLClient

# GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION = """
# mutation GenerateProfileDocumentPresignedURL($contentType: String!) {
#     generateProfileDocumentPresignedUrl(contentType: $contentType) {
#         presignedUrl
#         fileKey
#     }
# }
# """

# UPDATE_PROFILE_RESUME_MUTATION = """
# mutation UpdateProfileResumeMutation($resumeUrl: String!, $fileKey: String!) {
#     updateProfileResume(resumeUrl: $resumeUrl, fileKey: $fileKey) {
#         __typename
#         ... on Account {
#             __typename
#             id
#             profile {
#                 resumeUrl
#             }
#         }
#     }
# }
# """


# @pytest.fixture
# async def upload_test_resume(
#     password_auth_graphql_client: GraphQLClient,
#     container: Container,
# ) -> tuple[str, str]:
#     """Upload a test resume and return the resume URL and file key."""
#     response = await password_auth_graphql_client(
#         GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
#         variables={"contentType": "application/pdf"},
#     )
#     file_key = response["data"]["generateProfileDocumentPresignedUrl"]["fileKey"]

#     pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\n%%EOF"
#     s3_client = await container.resolve(S3Client)
#     aws_settings = await container.resolve(AWSSettings)
#     await s3_client.put_object(
#         Bucket=aws_settings.s3_bucket_name,
#         Key=file_key,
#         Body=pdf_content,
#         ContentType="application/pdf",
#     )

#     resume_url = f"https://example.com/{file_key}.pdf"
#     return resume_url, file_key


# @pytest.fixture
# async def upload_test_resume_webauthn(
#     webauthn_auth_graphql_client: GraphQLClient,
#     container: Container,
# ) -> tuple[str, str]:
#     """Upload a test resume for webauthn account and return the resume URL and file key."""
#     response = await webauthn_auth_graphql_client(
#         GENERATE_PROFILE_DOCUMENT_PRESIGNED_URL_MUTATION,
#         variables={"contentType": "application/pdf"},
#     )
#     file_key = response["data"]["generateProfileDocumentPresignedUrl"]["fileKey"]

#     pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\n%%EOF"
#     s3_client = await container.resolve(S3Client)
#     aws_settings = await container.resolve(AWSSettings)
#     await s3_client.put_object(
#         Bucket=aws_settings.s3_bucket_name,
#         Key=file_key,
#         Body=pdf_content,
#         ContentType="application/pdf",
#     )

#     resume_url = f"https://example.com/{file_key}.pdf"
#     return resume_url, file_key


# async def test_update_profile_resume_unauthenticated(
#     graphql_client: GraphQLClient,
# ) -> None:
#     """Ensure that update_profile_resume fails when user is not authenticated."""
#     response = await graphql_client(
#         UPDATE_PROFILE_RESUME_MUTATION,
#         variables={
#             "resumeUrl": "https://example.com/resume.pdf",
#             "fileKey": "autofill-profiles/test-key",
#         },
#     )

#     assert "errors" in response
#     assert len(response["errors"]) > 0


# async def test_update_profile_resume_success(
#     password_auth_graphql_client: GraphQLClient,
#     upload_test_resume: tuple[str, str],
# ) -> None:
#     """Ensure that update_profile_resume works with valid inputs."""
#     resume_url, file_key = upload_test_resume

#     response = await password_auth_graphql_client(
#         UPDATE_PROFILE_RESUME_MUTATION,
#         variables={
#             "resumeUrl": resume_url,
#             "fileKey": file_key,
#         },
#     )

#     assert response["data"]["updateProfileResume"]["__typename"] == "Account"


# async def test_update_profile_resume_webauthn_account(
#     webauthn_auth_graphql_client: GraphQLClient,
#     upload_test_resume_webauthn: tuple[str, str],
# ) -> None:
#     """Ensure that update_profile_resume works for webauthn accounts."""
#     resume_url, file_key = upload_test_resume_webauthn

#     response = await webauthn_auth_graphql_client(
#         UPDATE_PROFILE_RESUME_MUTATION,
#         variables={
#             "resumeUrl": resume_url,
#             "fileKey": file_key,
#         },
#     )

#     assert response["data"]["updateProfileResume"]["__typename"] == "Account"


# async def test_update_profile_resume_preserves_other_profile_fields(
#     password_auth_graphql_client: GraphQLClient,
#     upload_test_resume: tuple[str, str],
# ) -> None:
#     """Ensure that updating resume doesn't affect other profile fields."""
#     resume_url, file_key = upload_test_resume

#     # First, update personal details
#     update_personal_details_mutation = """
#     mutation UpdateProfilePersonalDetailsMutation($gender: GenderType) {
#         updateProfilePersonalDetails(gender: $gender) {
#             __typename
#             ... on Account {
#                 profile {
#                     gender
#                 }
#             }
#         }
#     }
#     """

#     await password_auth_graphql_client(
#         update_personal_details_mutation,
#         variables={"gender": "MALE"},
#     )

#     # Now update resume
#     response = await password_auth_graphql_client(
#         UPDATE_PROFILE_RESUME_MUTATION,
#         variables={
#             "resumeUrl": resume_url,
#             "fileKey": file_key,
#         },
#     )

#     # Verify resume was updated
#     assert response["data"]["updateProfileResume"]["__typename"] == "Account"

#     # Verify gender is still set
#     query = """
#     query {
#         viewer {
#             ... on Account {
#                 profile {
#                     gender
#                 }
#             }
#         }
#     }
#     """
#     viewer_response = await password_auth_graphql_client(query, variables={})
#     assert viewer_response["data"]["viewer"]["profile"]["gender"] == "MALE"


# async def test_update_profile_resume_creates_profile_if_not_exists(
#     password_auth_graphql_client: GraphQLClient,
#     upload_test_resume: tuple[str, str],
# ) -> None:
#     """Ensure that a profile is created if it doesn't exist."""
#     resume_url, file_key = upload_test_resume

#     response = await password_auth_graphql_client(
#         UPDATE_PROFILE_RESUME_MUTATION,
#         variables={
#             "resumeUrl": resume_url,
#             "fileKey": file_key,
#         },
#     )

#     assert response["data"]["updateProfileResume"]["__typename"] == "Account"
#     assert response["data"]["updateProfileResume"]["profile"] is not None
