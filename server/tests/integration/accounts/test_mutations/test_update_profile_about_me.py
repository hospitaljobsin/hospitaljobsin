import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_ABOUT_ME_MUTATION = """
mutation UpdateProfileAboutMeMutation(
    $professionalSummary: String
    $headline: String
) {
    updateProfileAboutMe(
        professionalSummary: $professionalSummary
        headline: $headline
    ) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                professionalSummary
                headline
            }
        }
    }
}
"""


async def test_update_profile_about_me_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_about_me fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Experienced healthcare professional",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_about_me_both_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that both professional summary and headline can be updated together."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Experienced healthcare professional with 10 years in cardiology",
            "headline": "Senior Cardiologist",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert (
        profile["professionalSummary"]
        == "Experienced healthcare professional with 10 years in cardiology"
    )
    assert profile["headline"] == "Senior Cardiologist"


async def test_update_profile_about_me_professional_summary_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only professional summary can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Dedicated nurse with expertise in emergency care",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert (
        profile["professionalSummary"]
        == "Dedicated nurse with expertise in emergency care"
    )


async def test_update_profile_about_me_headline_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only headline can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "headline": "Registered Nurse - ICU Specialist",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["headline"] == "Registered Nurse - ICU Specialist"


async def test_update_profile_about_me_null_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that null values can be set to clear fields."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": None,
            "headline": None,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] is None
    assert profile["headline"] is None


async def test_update_profile_about_me_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating about me replaces existing values."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Initial summary",
            "headline": "Initial headline",
        },
    )

    assert response1["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile1 = response1["data"]["updateProfileAboutMe"]["profile"]
    assert profile1["professionalSummary"] == "Initial summary"
    assert profile1["headline"] == "Initial headline"

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Updated summary",
            "headline": "Updated headline",
        },
    )

    assert response2["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile2 = response2["data"]["updateProfileAboutMe"]["profile"]
    assert profile2["professionalSummary"] == "Updated summary"
    assert profile2["headline"] == "Updated headline"


async def test_update_profile_about_me_partial_update_preserves_other_field(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating one field doesn't clear the other field."""
    # Set initial values
    await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Original summary",
            "headline": "Original headline",
        },
    )

    # Update only professional summary
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "New summary",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == "New summary"
    assert profile["headline"] == "Original headline"


async def test_update_profile_about_me_creates_profile_if_not_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a profile is created if it doesn't exist."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "New professional summary",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile is not None
    assert profile["professionalSummary"] == "New professional summary"


async def test_update_profile_about_me_empty_no_op(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that calling mutation with no variables is a no-op."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={},
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"


async def test_update_profile_about_me_long_professional_summary(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long professional summary is handled."""
    long_summary = "A" * 2000
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": long_summary,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == long_summary


async def test_update_profile_about_me_long_headline(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long headline is handled."""
    long_headline = "B" * 500
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "headline": long_headline,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["headline"] == long_headline


async def test_update_profile_about_me_special_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that special characters are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Expert in M.B.B.S., M.D. & Ph.D. with 15+ years' experience!",
            "headline": "Chief Medical Officer @ City Hospital (2020-Present)",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert (
        profile["professionalSummary"]
        == "Expert in M.B.B.S., M.D. & Ph.D. with 15+ years' experience!"
    )
    assert profile["headline"] == "Chief Medical Officer @ City Hospital (2020-Present)"


async def test_update_profile_about_me_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that unicode characters are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "医学专家 - Medical Expert with international experience 🏥",
            "headline": "Médico Especialista en Cardiología",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert (
        profile["professionalSummary"]
        == "医学专家 - Medical Expert with international experience 🏥"
    )
    assert profile["headline"] == "Médico Especialista en Cardiología"


async def test_update_profile_about_me_whitespace_preserved(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "  Leading professional  ",
            "headline": "  Senior Doctor  ",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == "  Leading professional  "
    assert profile["headline"] == "  Senior Doctor  "


async def test_update_profile_about_me_multiline_text(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that multiline text is handled correctly."""
    multiline_summary = """Experienced healthcare professional with:
- 10 years in cardiology
- Board certified
- Published researcher"""

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": multiline_summary,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == multiline_summary


async def test_update_profile_about_me_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_about_me works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Healthcare professional",
            "headline": "Medical Specialist",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == "Healthcare professional"
    assert profile["headline"] == "Medical Specialist"


async def test_update_profile_about_me_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating about me doesn't affect other profile fields."""
    # First, update education
    update_education_mutation = """
    mutation UpdateProfileEducationMutation($education: [EducationInput!]!) {
        updateProfileEducation(education: $education) {
            __typename
            ... on Account {
                profile {
                    education {
                        degree
                        institution
                    }
                }
            }
        }
    }
    """

    await password_auth_graphql_client(
        update_education_mutation,
        variables={
            "education": [
                {
                    "degree": "MBBS",
                    "institution": "AIIMS Delhi",
                    "startedAt": "2015-08-01",
                    "completedAt": "2020-06-30",
                }
            ]
        },
    )

    # Now update about me
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Medical professional",
            "headline": "Doctor",
        },
    )

    # Verify about me was updated
    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == "Medical professional"
    assert profile["headline"] == "Doctor"

    # Verify education is still set
    query = """
    query {
        viewer {
            ... on Account {
                profile {
                    education {
                        degree
                        institution
                    }
                }
            }
        }
    }
    """
    viewer_response = await password_auth_graphql_client(query, variables={})
    assert len(viewer_response["data"]["viewer"]["profile"]["education"]) == 1
    assert (
        viewer_response["data"]["viewer"]["profile"]["education"][0]["degree"] == "MBBS"
    )


async def test_update_profile_about_me_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updates for different users are independent."""
    # Update first user
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "User 1 summary",
            "headline": "User 1 headline",
        },
    )

    assert response1["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile1 = response1["data"]["updateProfileAboutMe"]["profile"]
    assert profile1["professionalSummary"] == "User 1 summary"
    assert profile1["headline"] == "User 1 headline"

    # Update second user with different values
    response2 = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "User 2 summary",
            "headline": "User 2 headline",
        },
    )

    assert response2["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile2 = response2["data"]["updateProfileAboutMe"]["profile"]
    assert profile2["professionalSummary"] == "User 2 summary"
    assert profile2["headline"] == "User 2 headline"

    # Verify first user's data is unchanged
    response1_verify = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "headline": "User 1 headline",
        },
    )

    profile1_verify = response1_verify["data"]["updateProfileAboutMe"]["profile"]
    assert profile1_verify["professionalSummary"] == "User 1 summary"
    assert profile1_verify["headline"] == "User 1 headline"


async def test_update_profile_about_me_empty_strings(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that empty strings are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "",
            "headline": "",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == ""
    assert profile["headline"] == ""


@pytest.mark.parametrize(
    ("professional_summary", "headline", "description"),
    [
        (
            "Experienced cardiologist with 15 years of practice",
            "Senior Cardiologist",
            "Standard medical professional",
        ),
        (
            "Registered nurse specializing in pediatric care",
            "Pediatric Nurse - RN",
            "Nursing professional",
        ),
        (
            "Board-certified surgeon with expertise in minimally invasive procedures",
            "Chief Surgeon",
            "Surgical specialist",
        ),
        (
            "Healthcare administrator with MBA and 10 years management experience",
            "Hospital Administrator",
            "Administrative role",
        ),
    ],
)
async def test_update_profile_about_me_various_professional_profiles(
    password_auth_graphql_client: GraphQLClient,
    professional_summary: str,
    headline: str,
    description: str,
) -> None:
    """Test various professional profile combinations."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": professional_summary,
            "headline": headline,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == professional_summary
    assert profile["headline"] == headline


async def test_update_profile_about_me_clear_one_field_keep_other(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that clearing one field keeps the other field intact."""
    # Set both fields
    await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "Summary to keep",
            "headline": "Headline to clear",
        },
    )

    # Clear only headline
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "headline": None,
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert profile["professionalSummary"] == "Summary to keep"
    assert profile["headline"] is None


async def test_update_profile_about_me_numbers_in_text(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that numbers in text are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_ABOUT_ME_MUTATION,
        variables={
            "professionalSummary": "15+ years experience, 500+ surgeries, 100% success rate",
            "headline": "Top 10 Surgeon in 2023",
        },
    )

    assert response["data"]["updateProfileAboutMe"]["__typename"] == "Account"
    profile = response["data"]["updateProfileAboutMe"]["profile"]
    assert (
        profile["professionalSummary"]
        == "15+ years experience, 500+ surgeries, 100% success rate"
    )
    assert profile["headline"] == "Top 10 Surgeon in 2023"
