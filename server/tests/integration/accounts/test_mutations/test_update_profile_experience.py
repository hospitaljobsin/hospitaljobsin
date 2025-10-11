import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_EXPERIENCE_MUTATION = """
mutation UpdateProfileExperienceMutation($workExperience: [WorkExperienceInput!]!) {
    updateProfileExperience(workExperience: $workExperience) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                workExperience {
                    title
                    description
                    organization
                    startedAt
                    completedAt
                    employmentType
                    skills
                }
            }
        }
    }
}
"""


async def test_update_profile_experience_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Software Engineer",
                    "organization": "Tech Corp",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Building software",
                    "employmentType": "FULL_TIME",
                    "skills": ["Python", "JavaScript"],
                },
            ],
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_experience_empty_list(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience works with empty list."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        response["data"]["updateProfileExperience"]["profile"]["workExperience"] == []
    )


async def test_update_profile_experience_single_experience(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience works with a single work experience."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Registered Nurse",
                    "organization": "City Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Providing patient care",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care", "Emergency Response"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert len(work_experience) == 1
    assert work_experience[0]["title"] == "Registered Nurse"
    assert work_experience[0]["organization"] == "City Hospital"
    assert work_experience[0]["startedAt"] == "2020-01-01"
    assert work_experience[0]["completedAt"] is None
    assert work_experience[0]["description"] == "Providing patient care"
    assert work_experience[0]["employmentType"] == "FULL_TIME"
    assert work_experience[0]["skills"] == ["Patient Care", "Emergency Response"]


async def test_update_profile_experience_multiple_experiences(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience works with multiple work experiences."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Senior Nurse",
                    "organization": "General Hospital",
                    "startedAt": "2022-01-01",
                    "completedAt": None,
                    "description": "Leading nursing team",
                    "employmentType": "FULL_TIME",
                    "skills": ["Leadership", "Patient Care"],
                },
                {
                    "title": "Staff Nurse",
                    "organization": "Community Clinic",
                    "startedAt": "2018-06-01",
                    "completedAt": "2021-12-31",
                    "description": "General nursing duties",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care", "Medical Records"],
                },
                {
                    "title": "Nursing Intern",
                    "organization": "Medical Center",
                    "startedAt": "2017-01-01",
                    "completedAt": "2018-05-31",
                    "description": "Internship program",
                    "employmentType": "INTERNSHIP",
                    "skills": ["Basic Care", "Documentation"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert len(work_experience) == 3
    assert work_experience[0]["title"] == "Senior Nurse"
    assert work_experience[1]["title"] == "Staff Nurse"
    assert work_experience[2]["title"] == "Nursing Intern"


@pytest.mark.parametrize(
    ("employment_type", "description"),
    [
        ("FULL_TIME", "Full time employment"),
        ("PART_TIME", "Part time employment"),
        ("CONTRACT", "Contract employment"),
        ("INTERNSHIP", "Internship"),
        ("TEMPORARY", "Temporary employment"),
        ("VOLUNTEER", "Volunteer work"),
        ("OTHER", "Other employment type"),
    ],
)
async def test_update_profile_experience_all_employment_types(
    password_auth_graphql_client: GraphQLClient,
    employment_type: str,
    description: str,
) -> None:
    """Test all valid employment type enum values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Healthcare Worker",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Working in healthcare",
                    "employmentType": employment_type,
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["employmentType"] == employment_type, (
        f"Failed for case: {description}"
    )


async def test_update_profile_experience_without_employment_type(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that employment type is optional."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Nursing duties",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["employmentType"] is None


async def test_update_profile_experience_without_description(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that description is optional."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": None,
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["description"] is None


async def test_update_profile_experience_without_completed_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt is optional for current positions."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Current Position",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Currently working",
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["completedAt"] is None


async def test_update_profile_experience_empty_skills(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that empty skills list is handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Nursing",
                    "employmentType": "FULL_TIME",
                    "skills": [],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["skills"] == []


async def test_update_profile_experience_many_skills(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that multiple skills can be added."""
    skills = [
        "Patient Care",
        "Emergency Response",
        "Medical Records",
        "Medication Administration",
        "Wound Care",
        "IV Therapy",
        "Patient Education",
        "Vital Signs Monitoring",
    ]
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Experienced Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Comprehensive nursing",
                    "employmentType": "FULL_TIME",
                    "skills": skills,
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["skills"] == skills


async def test_update_profile_experience_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience replaces existing work experience."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Old Position",
                    "organization": "Old Hospital",
                    "startedAt": "2018-01-01",
                    "completedAt": "2020-12-31",
                    "description": "Old job",
                    "employmentType": "FULL_TIME",
                    "skills": ["Old Skill"],
                },
            ],
        },
    )

    assert response1["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        len(response1["data"]["updateProfileExperience"]["profile"]["workExperience"])
        == 1
    )

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "New Position",
                    "organization": "New Hospital",
                    "startedAt": "2021-01-01",
                    "completedAt": None,
                    "description": "New job",
                    "employmentType": "FULL_TIME",
                    "skills": ["New Skill"],
                },
            ],
        },
    )

    assert response2["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response2["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert len(work_experience) == 1
    assert work_experience[0]["title"] == "New Position"
    assert work_experience[0]["organization"] == "New Hospital"


async def test_update_profile_experience_long_description(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long descriptions are handled."""
    long_description = "A" * 1000
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": long_description,
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["description"] == long_description


async def test_update_profile_experience_special_characters_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that special characters in fields are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse & Healthcare Provider",
                    "organization": "St. Mary's Hospital (Main Campus)",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Providing care with compassion & expertise",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care", "ICU/CCU", "ER/Trauma"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["title"] == "Nurse & Healthcare Provider"
    assert work_experience[0]["organization"] == "St. Mary's Hospital (Main Campus)"


async def test_update_profile_experience_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_experience works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Nursing",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        len(response["data"]["updateProfileExperience"]["profile"]["workExperience"])
        == 1
    )


async def test_update_profile_experience_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating work experience doesn't affect other profile fields."""
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

    # Now update work experience
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Nursing",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    # Verify work experience was updated
    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        len(response["data"]["updateProfileExperience"]["profile"]["workExperience"])
        == 1
    )

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


async def test_update_profile_experience_chronological_order(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that work experiences maintain the order they are provided."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Third Position",
                    "organization": "Hospital C",
                    "startedAt": "2022-01-01",
                    "completedAt": None,
                    "description": "Current",
                    "employmentType": "FULL_TIME",
                    "skills": ["Skill C"],
                },
                {
                    "title": "Second Position",
                    "organization": "Hospital B",
                    "startedAt": "2020-01-01",
                    "completedAt": "2021-12-31",
                    "description": "Previous",
                    "employmentType": "FULL_TIME",
                    "skills": ["Skill B"],
                },
                {
                    "title": "First Position",
                    "organization": "Hospital A",
                    "startedAt": "2018-01-01",
                    "completedAt": "2019-12-31",
                    "description": "Oldest",
                    "employmentType": "FULL_TIME",
                    "skills": ["Skill A"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["title"] == "Third Position"
    assert work_experience[1]["title"] == "Second Position"
    assert work_experience[2]["title"] == "First Position"


@pytest.mark.parametrize(
    ("date_value", "description"),
    [
        ("2020-01-01", "Start of year"),
        ("2020-12-31", "End of year"),
        ("2020-06-15", "Mid year"),
        ("2000-01-01", "Old date"),
        ("2024-12-31", "Recent date"),
    ],
)
async def test_update_profile_experience_various_dates(
    password_auth_graphql_client: GraphQLClient,
    date_value: str,
    description: str,
) -> None:
    """Test various valid date formats."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": date_value,
                    "completedAt": None,
                    "description": "Nursing",
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["startedAt"] == date_value


async def test_update_profile_experience_with_completed_date(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completed positions with end dates work correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Former Nurse",
                    "organization": "Old Hospital",
                    "startedAt": "2018-01-01",
                    "completedAt": "2020-12-31",
                    "description": "Previous position",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["completedAt"] == "2020-12-31"


async def test_update_profile_experience_many_experiences(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a large number of work experiences can be added."""
    work_experiences = [
        {
            "title": f"Position {i}",
            "organization": f"Organization {i}",
            "startedAt": "2020-01-01",
            "completedAt": "2021-12-31",
            "description": f"Description {i}",
            "employmentType": "FULL_TIME",
            "skills": [f"Skill {i}"],
        }
        for i in range(20)
    ]

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={"workExperience": work_experiences},
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        len(response["data"]["updateProfileExperience"]["profile"]["workExperience"])
        == 20
    )


async def test_update_profile_experience_duplicate_positions(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate positions are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "First entry",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
                {
                    "title": "Nurse",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Duplicate entry",
                    "employmentType": "FULL_TIME",
                    "skills": ["Patient Care"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    assert (
        len(response["data"]["updateProfileExperience"]["profile"]["workExperience"])
        == 2
    )


async def test_update_profile_experience_whitespace_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace in fields is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": " Senior Nurse ",
                    "organization": " City Hospital ",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": " Providing excellent care ",
                    "employmentType": "FULL_TIME",
                    "skills": [" Patient Care ", " Emergency Response "],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["title"] == " Senior Nurse "
    assert work_experience[0]["organization"] == " City Hospital "
    assert work_experience[0]["description"] == " Providing excellent care "
    assert work_experience[0]["skills"] == [" Patient Care ", " Emergency Response "]


async def test_update_profile_experience_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that unicode characters are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Médico Especialista",
                    "organization": "Hospital São Paulo",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": "Atención médica especializada",
                    "employmentType": "FULL_TIME",
                    "skills": ["Cirugía", "Diagnóstico"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["title"] == "Médico Especialista"
    assert work_experience[0]["organization"] == "Hospital São Paulo"


async def test_update_profile_experience_mixed_current_and_past_positions(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that mix of current and past positions works correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Current Position",
                    "organization": "Current Hospital",
                    "startedAt": "2022-01-01",
                    "completedAt": None,
                    "description": "Currently working",
                    "employmentType": "FULL_TIME",
                    "skills": ["Current Skills"],
                },
                {
                    "title": "Past Position",
                    "organization": "Past Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": "2021-12-31",
                    "description": "Previously worked",
                    "employmentType": "FULL_TIME",
                    "skills": ["Past Skills"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["completedAt"] is None
    assert work_experience[1]["completedAt"] == "2021-12-31"


async def test_update_profile_experience_all_optional_fields_none(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that all optional fields can be None."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Minimal Position",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": None,
                    "description": None,
                    "skills": [],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["description"] is None
    assert work_experience[0]["employmentType"] is None
    assert work_experience[0]["completedAt"] is None
    assert work_experience[0]["skills"] == []


async def test_update_profile_experience_started_at_in_future(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that startedAt cannot be in the future."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Future Position",
                    "organization": "Hospital",
                    "startedAt": "2099-01-01",
                    "completedAt": None,
                    "description": "Future job",
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_experience_completed_at_in_future(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt cannot be in the future."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Position",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": "2099-12-31",
                    "description": "Job",
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_experience_completed_at_before_started_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt cannot be before startedAt."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Position",
                    "organization": "Hospital",
                    "startedAt": "2020-12-31",
                    "completedAt": "2020-01-01",
                    "description": "Job",
                    "employmentType": "FULL_TIME",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert "errors" in response


async def test_update_profile_experience_completed_at_same_as_started_at(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that completedAt can be the same as startedAt."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_EXPERIENCE_MUTATION,
        variables={
            "workExperience": [
                {
                    "title": "Short Position",
                    "organization": "Hospital",
                    "startedAt": "2020-01-01",
                    "completedAt": "2020-01-01",
                    "description": "One day job",
                    "employmentType": "TEMPORARY",
                    "skills": ["Healthcare"],
                },
            ],
        },
    )

    assert response["data"]["updateProfileExperience"]["__typename"] == "Account"
    work_experience = response["data"]["updateProfileExperience"]["profile"][
        "workExperience"
    ]
    assert work_experience[0]["startedAt"] == "2020-01-01"
    assert work_experience[0]["completedAt"] == "2020-01-01"
