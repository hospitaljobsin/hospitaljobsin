import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION = """
mutation UpdateProfilePersonalDetailsMutation(
    $gender: GenderType
    $dateOfBirth: Date
    $maritalStatus: MaritalStatusType
    $category: String
    $address: String
) {
    updateProfilePersonalDetails(
        gender: $gender
        dateOfBirth: $dateOfBirth
        maritalStatus: $maritalStatus
        category: $category
        address: $address
    ) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                gender
                dateOfBirth
                maritalStatus
                category
                address
            }
        }
        ... on InvalidLocationError {
            __typename
        }
    }
}
"""


async def test_update_profile_personal_details_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_personal_details fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_personal_details_all_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that all personal details can be updated together."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
            "dateOfBirth": "1990-01-15",
            "maritalStatus": "SINGLE",
            "category": "General",
            "address": "Bangalore",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["gender"] == "MALE"
    assert profile["dateOfBirth"] == "1990-01-15"
    assert profile["maritalStatus"] == "SINGLE"
    assert profile["category"] == "General"
    assert profile["address"] == "Bangalore"


async def test_update_profile_personal_details_gender_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only gender can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "FEMALE",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["gender"] == "FEMALE"


async def test_update_profile_personal_details_date_of_birth_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only date of birth can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "dateOfBirth": "1985-06-20",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["dateOfBirth"] == "1985-06-20"


async def test_update_profile_personal_details_marital_status_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only marital status can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "maritalStatus": "MARRIED",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["maritalStatus"] == "MARRIED"


async def test_update_profile_personal_details_category_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only category can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "category": "OBC",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["category"] == "OBC"


async def test_update_profile_personal_details_address_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that only address can be updated."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "address": "Mumbai",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["address"] == "Mumbai"


@pytest.mark.parametrize(
    ("gender", "expected_value"),
    [
        ("MALE", "MALE"),
        ("FEMALE", "FEMALE"),
        ("OTHER", "OTHER"),
    ],
)
async def test_update_profile_personal_details_all_gender_values(
    password_auth_graphql_client: GraphQLClient,
    gender: str,
    expected_value: str,
) -> None:
    """Test all valid gender enum values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": gender,
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["gender"] == expected_value


@pytest.mark.parametrize(
    ("marital_status", "expected_value"),
    [
        ("SINGLE", "SINGLE"),
        ("MARRIED", "MARRIED"),
    ],
)
async def test_update_profile_personal_details_all_marital_status_values(
    password_auth_graphql_client: GraphQLClient,
    marital_status: str,
    expected_value: str,
) -> None:
    """Test all valid marital status enum values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "maritalStatus": marital_status,
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["maritalStatus"] == expected_value


@pytest.mark.parametrize(
    ("address", "description"),
    [
        ("Bangalore", "City name"),
        ("Karnataka", "State name"),
        ("Mumbai", "Another city"),
        ("Delhi", "Capital city"),
        ("Koramangala", "Locality"),
        ("HSR Layout", "Another locality"),
    ],
)
async def test_update_profile_personal_details_valid_addresses(
    password_auth_graphql_client: GraphQLClient,
    address: str,
    description: str,
) -> None:
    """Test various valid Indian addresses."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "address": address,
        },
    )

    assert (
        response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    ), f"Failed for case: {description}"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["address"] == address


@pytest.mark.parametrize(
    ("address", "description"),
    [
        ("NonExistentCity123", "Non-existent city"),
        ("InvalidLocation", "Invalid location"),
        ("RandomPlace999", "Random place"),
    ],
)
async def test_update_profile_personal_details_invalid_addresses(
    password_auth_graphql_client: GraphQLClient,
    address: str,
    description: str,
) -> None:
    """Test invalid addresses that don't exist in the database."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "address": address,
        },
    )

    assert response == {
        "data": {
            "updateProfilePersonalDetails": {
                "__typename": "InvalidLocationError",
            },
        },
    }, f"Failed for case: {description}"


async def test_update_profile_personal_details_null_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that null values can be set to clear fields."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": None,
            "dateOfBirth": None,
            "maritalStatus": None,
            "category": None,
            "address": None,
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["gender"] is None
    assert profile["dateOfBirth"] is None
    assert profile["maritalStatus"] is None
    assert profile["category"] is None
    assert profile["address"] is None


async def test_update_profile_personal_details_updates_existing_profile(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating personal details modifies existing profile data."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
            "category": "General",
        },
    )

    assert response1["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile1 = response1["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile1["gender"] == "MALE"
    assert profile1["category"] == "General"

    # Second update - should overwrite
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "FEMALE",
            "category": "OBC",
        },
    )

    assert response2["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile2 = response2["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile2["gender"] == "FEMALE"
    assert profile2["category"] == "OBC"


async def test_update_profile_personal_details_partial_update_preserves_other_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating one field doesn't clear other fields."""
    # Set initial values
    await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
            "dateOfBirth": "1990-01-01",
            "maritalStatus": "SINGLE",
            "category": "General",
            "address": "Bangalore",
        },
    )

    # Update only gender
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "FEMALE",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["gender"] == "FEMALE"
    assert profile["dateOfBirth"] == "1990-01-01"
    assert profile["maritalStatus"] == "SINGLE"
    assert profile["category"] == "General"
    assert profile["address"] == "Bangalore"


async def test_update_profile_personal_details_creates_profile_if_not_exists(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a profile is created if it doesn't exist."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
        },
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile is not None
    assert profile["gender"] == "MALE"


@pytest.mark.parametrize(
    ("date_of_birth", "description"),
    [
        ("2000-12-31", "End of year"),
        ("1950-01-01", "Old date"),
        ("2005-06-15", "Mid year"),
        ("1980-02-29", "Leap year date"),
    ],
)
async def test_update_profile_personal_details_various_dates(
    password_auth_graphql_client: GraphQLClient,
    date_of_birth: str,
    description: str,
) -> None:
    """Test various valid date formats."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "dateOfBirth": date_of_birth,
        },
    )

    assert (
        response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    ), f"Failed for case: {description}"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["dateOfBirth"] == date_of_birth


async def test_update_profile_personal_details_empty_no_op(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that calling mutation with no variables is a no-op."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={},
    )

    assert response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"


async def test_update_profile_personal_details_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updates for different users are independent."""
    # Update first user
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "MALE",
            "category": "General",
        },
    )

    assert response1["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile1 = response1["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile1["gender"] == "MALE"
    assert profile1["category"] == "General"

    # Update second user with different values
    response2 = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "gender": "FEMALE",
            "category": "OBC",
        },
    )

    assert response2["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    profile2 = response2["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile2["gender"] == "FEMALE"
    assert profile2["category"] == "OBC"

    # Verify first user's data is unchanged by querying again with gender field
    response1_verify = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "category": "General",
        },
    )

    profile1_verify = response1_verify["data"]["updateProfilePersonalDetails"][
        "profile"
    ]
    assert profile1_verify["gender"] == "MALE"
    assert profile1_verify["category"] == "General"


@pytest.mark.parametrize(
    ("category", "description"),
    [
        ("General", "General category"),
        ("OBC", "OBC category"),
        ("SC", "SC category"),
        ("ST", "ST category"),
        ("EWS", "EWS category"),
        ("Other", "Other category"),
    ],
)
async def test_update_profile_personal_details_various_categories(
    password_auth_graphql_client: GraphQLClient,
    category: str,
    description: str,
) -> None:
    """Test various category values."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_PERSONAL_DETAILS_MUTATION,
        variables={
            "category": category,
        },
    )

    assert (
        response["data"]["updateProfilePersonalDetails"]["__typename"] == "Account"
    ), f"Failed for case: {description}"
    profile = response["data"]["updateProfilePersonalDetails"]["profile"]
    assert profile["category"] == category
