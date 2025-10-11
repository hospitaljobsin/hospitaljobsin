from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_EDUCATION_MUTATION = """
mutation UpdateProfileEducationMutation($education: [EducationInput!]!) {
    updateProfileEducation(education: $education) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                education {
                    degree
                    institution
                    startedAt
                    completedAt
                }
            }
        }
    }
}
"""


async def test_update_profile_education_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_education_empty_list(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education works with empty list."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert response["data"]["updateProfileEducation"]["profile"]["education"] == []


async def test_update_profile_education_single_entry(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education works with a single education entry."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == "MBBS"
    assert edu["institution"] == "AIIMS Delhi"
    assert edu["startedAt"] == "2015-08-01"
    assert edu["completedAt"] == "2020-06-30"


async def test_update_profile_education_multiple_entries(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education works with multiple education entries."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
                {
                    "degree": "MD Cardiology",
                    "institution": "PGI Chandigarh",
                    "startedAt": "2020-08-01",
                    "completedAt": "2023-06-30",
                },
                {
                    "degree": "BSc Nursing",
                    "institution": "CMC Vellore",
                    "startedAt": "2012-08-01",
                    "completedAt": "2016-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 3
    education = response["data"]["updateProfileEducation"]["profile"]["education"]
    assert education[0]["degree"] == "MBBS"
    assert education[1]["degree"] == "MD Cardiology"
    assert education[2]["degree"] == "BSc Nursing"


async def test_update_profile_education_with_null_completed_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education works with null completedAt (ongoing education)."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "PhD in Medical Research",
                    "institution": "Harvard Medical School",
                    "startedAt": "2022-09-01",
                    "completedAt": None,
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == "PhD in Medical Research"
    assert edu["completedAt"] is None


async def test_update_profile_education_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education replaces existing education entries."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
                {
                    "degree": "MD Cardiology",
                    "institution": "PGI Chandigarh",
                    "startedAt": "2020-08-01",
                    "completedAt": "2023-06-30",
                },
            ],
        },
    )

    assert response1["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response1["data"]["updateProfileEducation"]["profile"]["education"]) == 2

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "BSc Nursing",
                    "institution": "CMC Vellore",
                    "startedAt": "2012-08-01",
                    "completedAt": "2016-06-30",
                },
            ],
        },
    )

    assert response2["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response2["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    assert (
        response2["data"]["updateProfileEducation"]["profile"]["education"][0]["degree"]
        == "BSc Nursing"
    )


async def test_update_profile_education_mixed_completed_and_ongoing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education handles mix of completed and ongoing education."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
                {
                    "degree": "MD Cardiology",
                    "institution": "PGI Chandigarh",
                    "startedAt": "2020-08-01",
                    "completedAt": None,
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 2
    education = response["data"]["updateProfileEducation"]["profile"]["education"]
    assert education[0]["completedAt"] == "2020-06-30"
    assert education[1]["completedAt"] is None


async def test_update_profile_education_special_characters_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that special characters in degree and institution names are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "M.B.B.S. (Bachelor of Medicine & Surgery)",
                    "institution": "St. John's Medical College, Bangalore",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == "M.B.B.S. (Bachelor of Medicine & Surgery)"
    assert edu["institution"] == "St. John's Medical College, Bangalore"


async def test_update_profile_education_long_field_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long degree and institution names are handled."""
    long_degree = "A" * 200
    long_institution = "B" * 200
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": long_degree,
                    "institution": long_institution,
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == long_degree
    assert edu["institution"] == long_institution


async def test_update_profile_education_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_education works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1


async def test_update_profile_education_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating education doesn't affect other profile fields."""
    # First, update languages
    update_languages_mutation = """
    mutation UpdateProfileLanguagesMutation($languages: [LanguageInput!]!) {
        updateProfileLanguages(languages: $languages) {
            __typename
            ... on Account {
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

    await password_auth_graphql_client(
        update_languages_mutation,
        variables={
            "languages": [
                {"name": "English", "proficiency": "NATIVE"},
            ]
        },
    )

    # Now update education
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    # Verify education was updated
    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1

    # Verify languages are still set
    query = """
    query {
        viewer {
            ... on Account {
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
    viewer_response = await password_auth_graphql_client(query, variables={})
    assert len(viewer_response["data"]["viewer"]["profile"]["languages"]) == 1
    assert (
        viewer_response["data"]["viewer"]["profile"]["languages"][0]["name"]
        == "English"
    )


async def test_update_profile_education_duplicate_entries(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate education entries are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 2


async def test_update_profile_education_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that unicode characters in fields are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "医学博士 (Doctor of Medicine)",
                    "institution": "北京大学医学部",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == "医学博士 (Doctor of Medicine)"
    assert edu["institution"] == "北京大学医学部"


async def test_update_profile_education_whitespace_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace in fields is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "  MBBS  ",
                    "institution": "  AIIMS Delhi  ",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["degree"] == "  MBBS  "
    assert edu["institution"] == "  AIIMS Delhi  "


async def test_update_profile_education_many_entries(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a large number of education entries can be added."""
    education = [
        {
            "degree": f"Degree {i}",
            "institution": f"Institution {i}",
            "startedAt": "2015-08-01",
            "completedAt": "2020-06-30",
        }
        for i in range(20)
    ]

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={"education": education},
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 20


async def test_update_profile_education_same_start_and_completion_date(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that education with same start and completion date is handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "Certificate Course",
                    "institution": "Medical Institute",
                    "startedAt": "2020-06-30",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["startedAt"] == "2020-06-30"
    assert edu["completedAt"] == "2020-06-30"


async def test_update_profile_education_old_dates(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that old dates are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "Medical College",
                    "startedAt": "1980-08-01",
                    "completedAt": "1985-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileEducation"]["profile"]["education"]) == 1
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["startedAt"] == "1980-08-01"
    assert edu["completedAt"] == "1985-06-30"


async def test_update_profile_education_started_at_in_future(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that startedAt cannot be in the future."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "Medical College",
                    "startedAt": "2099-08-01",
                    "completedAt": None,
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_education_completed_at_in_future(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt cannot be in the future."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "Medical College",
                    "startedAt": "2020-08-01",
                    "completedAt": "2099-06-30",
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_education_completed_at_before_started_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt cannot be before startedAt."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "Medical College",
                    "startedAt": "2020-08-01",
                    "completedAt": "2019-06-30",
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_education_completed_at_same_as_started_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt can be the same as startedAt."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EDUCATION_MUTATION,
        variables={
            "education": [
                {
                    "degree": "Certificate Course",
                    "institution": "Medical Institute",
                    "startedAt": "2020-06-30",
                    "completedAt": "2020-06-30",
                },
            ],
        },
    )

    assert response["data"]["updateProfileEducation"]["__typename"] == "Account"
    edu = response["data"]["updateProfileEducation"]["profile"]["education"][0]
    assert edu["startedAt"] == "2020-06-30"
    assert edu["completedAt"] == "2020-06-30"
