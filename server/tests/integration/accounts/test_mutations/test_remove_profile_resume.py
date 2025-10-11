from tests.integration.graphql_client import GraphQLClient

REMOVE_PROFILE_RESUME_MUTATION = """
mutation RemoveProfileResumeMutation {
    removeProfileResume {
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


async def test_remove_profile_resume_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_profile_resume fails when user is not authenticated."""
    response = await graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_remove_profile_resume_success(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_profile_resume works."""
    response = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None


async def test_remove_profile_resume_when_no_resume_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_profile_resume works even when no resume exists."""
    response = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response["data"]["removeProfileResume"]["__typename"] == "Account"


async def test_remove_profile_resume_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_profile_resume works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None


async def test_remove_profile_resume_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that removing resume doesn't affect other profile fields."""
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
        variables={"gender": "FEMALE"},
    )

    response = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None

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
    assert viewer_response["data"]["viewer"]["profile"]["gender"] == "FEMALE"


async def test_remove_profile_resume_multiple_times(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_profile_resume can be called multiple times."""
    response1 = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response1["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response1["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None

    response2 = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response2["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response2["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None


async def test_remove_profile_resume_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that removing resume for different users are independent."""
    response1 = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response1["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response1["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None

    response2 = await webauthn_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response2["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response2["data"]["removeProfileResume"]["profile"]["resumeUrl"] is None


async def test_remove_profile_resume_creates_profile_if_not_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a profile is created if it doesn't exist when removing resume."""
    response = await password_auth_graphql_client(
        REMOVE_PROFILE_RESUME_MUTATION,
        variables={},
    )

    assert response["data"]["removeProfileResume"]["__typename"] == "Account"
    assert response["data"]["removeProfileResume"]["profile"] is not None
