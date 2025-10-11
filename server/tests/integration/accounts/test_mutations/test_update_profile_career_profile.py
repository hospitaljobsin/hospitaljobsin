import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_CAREER_PROFILE_MUTATION = """
mutation UpdateProfileCareerProfileMutation(
    $currentIndustry: String
    $desiredJobTypes: [JobType!]!
    $desiredWorkModes: [WorkMode!]!
    $expectedSalary: Float
    $locationsOpenToWork: [String!]!
    $openToRelocationAnywhere: Boolean!
) {
    updateProfileCareerProfile(
        currentIndustry: $currentIndustry
        desiredJobTypes: $desiredJobTypes
        desiredWorkModes: $desiredWorkModes
        expectedSalary: $expectedSalary
        locationsOpenToWork: $locationsOpenToWork
        openToRelocationAnywhere: $openToRelocationAnywhere
    ) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                careerProfile {
                    currentIndustry
                    desiredJobTypes
                    desiredWorkModes
                    expectedSalary
                    locationsOpenToWork
                    openToRelocationAnywhere
                }
            }
        }
    }
}
"""


async def test_update_profile_career_profile_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_career_profile fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_career_profile_all_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that all career profile fields can be updated together."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": ["FULL_TIME", "CONTRACT"],
            "desiredWorkModes": ["REMOTE", "HYBRID"],
            "expectedSalary": 1500000.0,
            "locationsOpenToWork": ["Bangalore", "Mumbai"],
            "openToRelocationAnywhere": False,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == "Healthcare"
    assert career_profile["desiredJobTypes"] == ["FULL_TIME", "CONTRACT"]
    assert career_profile["desiredWorkModes"] == ["REMOTE", "HYBRID"]
    assert career_profile["expectedSalary"] == 1500000.0
    assert career_profile["locationsOpenToWork"] == ["Bangalore", "Mumbai"]
    assert career_profile["openToRelocationAnywhere"] is False


async def test_update_profile_career_profile_current_industry_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only current industry can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Pharmaceuticals",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == "Pharmaceuticals"


async def test_update_profile_career_profile_desired_job_types_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only desired job types can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": ["FULL_TIME", "PART_TIME"],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["desiredJobTypes"] == ["FULL_TIME", "PART_TIME"]


async def test_update_profile_career_profile_desired_work_modes_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only desired work modes can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": ["OFFICE", "HYBRID"],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["desiredWorkModes"] == ["OFFICE", "HYBRID"]


async def test_update_profile_career_profile_expected_salary_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only expected salary can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 2000000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == 2000000.0


async def test_update_profile_career_profile_locations_open_to_work_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only locations open to work can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": ["Delhi", "Pune"],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["locationsOpenToWork"] == ["Delhi", "Pune"]


async def test_update_profile_career_profile_open_to_relocation_anywhere_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only open to relocation anywhere can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": True,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["openToRelocationAnywhere"] is True


@pytest.mark.parametrize(
    ("job_types", "description"),
    [
        (["FULL_TIME"], "Single job type"),
        (["FULL_TIME", "PART_TIME"], "Two job types"),
        (["FULL_TIME", "PART_TIME", "CONTRACT"], "Three job types"),
        (
            ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "LOCUM"],
            "All job types",
        ),
    ],
)
async def test_update_profile_career_profile_various_job_types(
    password_auth_graphql_client: GraphQLClient,
    job_types: list[str],
    description: str,
) -> None:
    """Test various combinations of job types."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": job_types,
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["desiredJobTypes"] == job_types


@pytest.mark.parametrize(
    ("work_modes", "description"),
    [
        (["REMOTE"], "Remote only"),
        (["OFFICE"], "Office only"),
        (["HYBRID"], "Hybrid only"),
        (["REMOTE", "HYBRID"], "Remote and hybrid"),
        (["REMOTE", "OFFICE"], "Remote and office"),
        (["REMOTE", "HYBRID", "OFFICE"], "All work modes"),
    ],
)
async def test_update_profile_career_profile_various_work_modes(
    password_auth_graphql_client: GraphQLClient,
    work_modes: list[str],
    description: str,
) -> None:
    """Test various combinations of work modes."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": work_modes,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["desiredWorkModes"] == work_modes


@pytest.mark.parametrize(
    ("salary", "description"),
    [
        (500000.0, "Entry level salary"),
        (1000000.0, "Mid level salary"),
        (2500000.0, "Senior level salary"),
        (5000000.0, "Executive level salary"),
        (0.0, "Zero salary"),
        (100.5, "Decimal salary"),
    ],
)
async def test_update_profile_career_profile_various_salaries(
    password_auth_graphql_client: GraphQLClient,
    salary: float,
    description: str,
) -> None:
    """Test various salary values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": salary,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == salary


async def test_update_profile_career_profile_null_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that null values can be set to clear fields."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": None,
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": None,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] is None
    assert career_profile["expectedSalary"] is None


async def test_update_profile_career_profile_empty_lists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that empty lists can be set."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["desiredJobTypes"] == []
    assert career_profile["desiredWorkModes"] == []
    assert career_profile["locationsOpenToWork"] == []


async def test_update_profile_career_profile_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating career profile replaces existing values."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1000000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response1["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile1 = response1["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile1["currentIndustry"] == "Healthcare"
    assert career_profile1["expectedSalary"] == 1000000.0

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Pharmaceuticals",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1500000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response2["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile2 = response2["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile2["currentIndustry"] == "Pharmaceuticals"
    assert career_profile2["expectedSalary"] == 1500000.0


async def test_update_profile_career_profile_creates_profile_if_not_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a profile is created if it doesn't exist."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    profile = response["data"]["updateProfileCareerProfile"]["profile"]
    assert profile is not None
    assert profile["careerProfile"]["currentIndustry"] == "Healthcare"


async def test_update_profile_career_profile_empty_no_op(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that calling mutation with no variables is a no-op."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"


async def test_update_profile_career_profile_multiple_locations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that multiple locations can be set."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [
                "Bangalore",
                "Mumbai",
                "Delhi",
                "Pune",
                "Hyderabad",
            ],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["locationsOpenToWork"] == [
        "Bangalore",
        "Mumbai",
        "Delhi",
        "Pune",
        "Hyderabad",
    ]


async def test_update_profile_career_profile_open_to_relocation_true_with_locations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that open to relocation can be true even with specific locations."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": ["Bangalore"],
            "openToRelocationAnywhere": True,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["locationsOpenToWork"] == ["Bangalore"]
    assert career_profile["openToRelocationAnywhere"] is True


async def test_update_profile_career_profile_open_to_relocation_false_with_empty_locations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that open to relocation can be false with empty locations."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["locationsOpenToWork"] == []
    assert career_profile["openToRelocationAnywhere"] is False


async def test_update_profile_career_profile_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_career_profile works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1200000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == "Healthcare"
    assert career_profile["expectedSalary"] == 1200000.0


async def test_update_profile_career_profile_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating career profile doesn't affect other profile fields."""
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

    # Now update career profile
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    # Verify career profile was updated
    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == "Healthcare"

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


async def test_update_profile_career_profile_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updates for different users are independent."""
    # Update first user
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1000000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response1["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile1 = response1["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile1["currentIndustry"] == "Healthcare"
    assert career_profile1["expectedSalary"] == 1000000.0

    # Update second user with different values
    response2 = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Pharmaceuticals",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1500000.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
        },
    )

    assert response2["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile2 = response2["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile2["currentIndustry"] == "Pharmaceuticals"
    assert career_profile2["expectedSalary"] == 1500000.0

    # Verify first user's data is unchanged
    response1_verify = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    career_profile1_verify = response1_verify["data"]["updateProfileCareerProfile"][
        "profile"
    ]["careerProfile"]
    assert career_profile1_verify["currentIndustry"] == "Healthcare"
    assert career_profile1_verify["expectedSalary"] is None


@pytest.mark.parametrize(
    ("industry", "description"),
    [
        ("Healthcare", "Healthcare industry"),
        ("Pharmaceuticals", "Pharmaceuticals industry"),
        ("Medical Devices", "Medical devices industry"),
        ("Biotechnology", "Biotechnology industry"),
        ("Clinical Research", "Clinical research industry"),
        ("Hospital Administration", "Hospital administration industry"),
    ],
)
async def test_update_profile_career_profile_various_industries(
    password_auth_graphql_client: GraphQLClient,
    industry: str,
    description: str,
) -> None:
    """Test various industry values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": industry,
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == industry


async def test_update_profile_career_profile_special_characters_in_industry(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that special characters in industry are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "currentIndustry": "Healthcare & Pharmaceuticals (R&D)",
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["currentIndustry"] == "Healthcare & Pharmaceuticals (R&D)"


async def test_update_profile_career_profile_duplicate_job_types(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate job types are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": ["FULL_TIME", "FULL_TIME", "PART_TIME"],
            "desiredWorkModes": [],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    # The system should store duplicates as provided
    assert career_profile["desiredJobTypes"] == ["FULL_TIME", "FULL_TIME", "PART_TIME"]


async def test_update_profile_career_profile_duplicate_work_modes(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate work modes are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": ["REMOTE", "REMOTE", "HYBRID"],
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    # The system should store duplicates as provided
    assert career_profile["desiredWorkModes"] == ["REMOTE", "REMOTE", "HYBRID"]


async def test_update_profile_career_profile_duplicate_locations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate locations are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "locationsOpenToWork": ["Bangalore", "Bangalore", "Mumbai"],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
            "expectedSalary": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    # The system should store duplicates as provided
    assert career_profile["locationsOpenToWork"] == [
        "Bangalore",
        "Bangalore",
        "Mumbai",
    ]


async def test_update_profile_career_profile_very_large_salary(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that very large salary values are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 999999999.99,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == 999999999.99


@pytest.mark.parametrize(
    ("salary", "description"),
    [
        (-0.01, "Negative decimal"),
        (-1.0, "Negative integer"),
        (-100000.0, "Large negative"),
    ],
)
async def test_update_profile_career_profile_invalid_negative_salaries(
    password_auth_graphql_client: GraphQLClient,
    salary: float,
    description: str,
) -> None:
    """Ensure that negative salary values are rejected."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": salary,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert "errors" in response, f"Failed for case: {description}"
    assert len(response["errors"]) > 0


async def test_update_profile_career_profile_zero_salary_valid(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that zero salary is accepted as valid."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 0.0,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == 0.0


async def test_update_profile_career_profile_minimum_positive_salary(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that minimum positive salary is accepted."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 0.01,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == 0.01


async def test_update_profile_career_profile_fractional_salary(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that fractional salary values are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CAREER_PROFILE_MUTATION,
        variables={
            "desiredJobTypes": [],
            "desiredWorkModes": [],
            "expectedSalary": 1234567.89,
            "locationsOpenToWork": [],
            "openToRelocationAnywhere": False,
            "currentIndustry": None,
        },
    )

    assert response["data"]["updateProfileCareerProfile"]["__typename"] == "Account"
    career_profile = response["data"]["updateProfileCareerProfile"]["profile"][
        "careerProfile"
    ]
    assert career_profile["expectedSalary"] == 1234567.89
