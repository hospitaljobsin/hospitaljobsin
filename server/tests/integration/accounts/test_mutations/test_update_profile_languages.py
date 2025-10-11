import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_LANGUAGES_MUTATION = """
mutation UpdateProfileLanguagesMutation($languages: [LanguageInput!]!) {
    updateProfileLanguages(languages: $languages) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                languages {
                    name
                    proficiency
                }
            }
        }
    }
}
"""


async def test_update_profile_languages_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
            ],
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_languages_empty_list(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages works with empty list."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert response["data"]["updateProfileLanguages"]["profile"]["languages"] == []


async def test_update_profile_languages_single_language(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages works with a single language."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 1
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][0]["name"]
        == "English"
    )
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][0][
            "proficiency"
        ]
        == "NATIVE"
    )


async def test_update_profile_languages_multiple_languages(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages works with multiple languages."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
                {"name": "Hindi", "proficiency": "PROFESSIONAL"},
                {"name": "Tamil", "proficiency": "BASIC"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 3
    languages = response["data"]["updateProfileLanguages"]["profile"]["languages"]
    assert languages[0] == {"name": "English", "proficiency": "NATIVE"}
    assert languages[1] == {"name": "Hindi", "proficiency": "PROFESSIONAL"}
    assert languages[2] == {"name": "Tamil", "proficiency": "BASIC"}


@pytest.mark.parametrize(
    ("proficiency", "description"),
    [
        ("NATIVE", "Native proficiency"),
        ("PROFESSIONAL", "Professional proficiency"),
        ("BASIC", "Basic proficiency"),
    ],
)
async def test_update_profile_languages_all_proficiency_levels(
    password_auth_graphql_client: GraphQLClient,
    proficiency: str,
    description: str,
) -> None:
    """Test all valid proficiency levels."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": proficiency},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][0][
            "proficiency"
        ]
        == proficiency
    ), f"Failed for case: {description}"


async def test_update_profile_languages_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages replaces existing languages."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
                {"name": "Hindi", "proficiency": "PROFESSIONAL"},
            ],
        },
    )

    assert response1["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response1["data"]["updateProfileLanguages"]["profile"]["languages"]) == 2

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "Tamil", "proficiency": "BASIC"},
            ],
        },
    )

    assert response2["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response2["data"]["updateProfileLanguages"]["profile"]["languages"]) == 1
    assert (
        response2["data"]["updateProfileLanguages"]["profile"]["languages"][0]["name"]
        == "Tamil"
    )


async def test_update_profile_languages_duplicate_languages(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate languages are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
                {"name": "English", "proficiency": "PROFESSIONAL"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 2


async def test_update_profile_languages_special_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that language names with special characters are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "Español", "proficiency": "NATIVE"},
                {"name": "Français", "proficiency": "PROFESSIONAL"},
                {"name": "中文", "proficiency": "BASIC"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 3


async def test_update_profile_languages_long_language_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long language names are handled."""
    long_name = "A" * 100
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": long_name, "proficiency": "NATIVE"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][0]["name"]
        == long_name
    )


async def test_update_profile_languages_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_languages works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 1


async def test_update_profile_languages_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating languages doesn't affect other profile fields."""
    # First, update personal details
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

    # Now update languages
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
            ],
        },
    )

    # Verify languages were updated
    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 1

    # Verify gender is still set
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


async def test_update_profile_languages_case_sensitive_names(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that language names are case-sensitive."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": "english", "proficiency": "NATIVE"},
                {"name": "English", "proficiency": "PROFESSIONAL"},
                {"name": "ENGLISH", "proficiency": "BASIC"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 3


async def test_update_profile_languages_whitespace_in_names(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace in language names is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={
            "languages": [
                {"name": " English ", "proficiency": "NATIVE"},
                {"name": "British English", "proficiency": "PROFESSIONAL"},
            ],
        },
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 2
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][0]["name"]
        == " English "
    )
    assert (
        response["data"]["updateProfileLanguages"]["profile"]["languages"][1]["name"]
        == "British English"
    )


async def test_update_profile_languages_many_languages(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a large number of languages can be added."""
    languages = [{"name": f"Language{i}", "proficiency": "NATIVE"} for i in range(50)]

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LANGUAGES_MUTATION,
        variables={"languages": languages},
    )

    assert response["data"]["updateProfileLanguages"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLanguages"]["profile"]["languages"]) == 50
