import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_LICENSES_MUTATION = """
mutation UpdateProfileLicensesMutation($licenses: [LicenseInput!]!) {
    updateProfileLicenses(licenses: $licenses) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                licenses {
                    name
                    issuer
                    licenseNumber
                    registrationYear
                    verificationStatus
                    verifiedAt
                }
            }
        }
    }
}
"""


async def test_update_profile_licenses_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_licenses_empty_list(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses works with empty list."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert response["data"]["updateProfileLicenses"]["profile"]["licenses"] == []


async def test_update_profile_licenses_single_license(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses works with a single license."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses) == 1
    assert licenses[0]["name"] == "Medical License"
    assert licenses[0]["issuer"] == "Medical Council of India"
    assert licenses[0]["licenseNumber"] == "MCI123456"
    assert licenses[0]["registrationYear"] == 2020
    assert licenses[0]["verificationStatus"] == "PENDING"
    assert licenses[0]["verifiedAt"] is None


async def test_update_profile_licenses_multiple_licenses(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses works with multiple licenses."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
                {
                    "name": "Nursing License",
                    "issuer": "Indian Nursing Council",
                    "licenseNumber": "INC789012",
                    "registrationYear": 2018,
                },
                {
                    "name": "Pharmacy License",
                    "issuer": "Pharmacy Council of India",
                    "licenseNumber": "PCI345678",
                    "registrationYear": 2019,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses) == 3
    assert licenses[0]["name"] == "Medical License"
    assert licenses[1]["name"] == "Nursing License"
    assert licenses[2]["name"] == "Pharmacy License"


async def test_update_profile_licenses_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses replaces existing licenses."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
                {
                    "name": "Nursing License",
                    "issuer": "Indian Nursing Council",
                    "licenseNumber": "INC789012",
                    "registrationYear": 2018,
                },
            ],
        },
    )

    assert response1["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response1["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 2

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Pharmacy License",
                    "issuer": "Pharmacy Council of India",
                    "licenseNumber": "PCI345678",
                    "registrationYear": 2019,
                },
            ],
        },
    )

    assert response2["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response2["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses) == 1
    assert licenses[0]["name"] == "Pharmacy License"


async def test_update_profile_licenses_duplicate_licenses(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate licenses are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 2


async def test_update_profile_licenses_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_licenses works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 1


async def test_update_profile_licenses_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating licenses doesn't affect other profile fields."""
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

    # Now update licenses
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    # Verify licenses were updated
    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 1

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


@pytest.mark.parametrize(
    ("registration_year", "description"),
    [
        (2020, "Recent year"),
        (2000, "Older year"),
        (1990, "Very old year"),
        (2024, "Current year"),
    ],
)
async def test_update_profile_licenses_various_years(
    password_auth_graphql_client: GraphQLClient,
    registration_year: int,
    description: str,
) -> None:
    """Test various registration years for licenses."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": registration_year,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert licenses[0]["registrationYear"] == registration_year


async def test_update_profile_licenses_special_characters_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that license fields with special characters are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License (Type A)",
                    "issuer": "Medical Council & Board",
                    "licenseNumber": "MCI-123/456",
                    "registrationYear": 2020,
                },
                {
                    "name": "Nursing License - RN",
                    "issuer": "Indian Nursing Council",
                    "licenseNumber": "INC#789012",
                    "registrationYear": 2018,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 2


async def test_update_profile_licenses_long_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long license values are handled."""
    long_name = "A" * 200
    long_issuer = "B" * 200
    long_license_number = "C" * 100

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": long_name,
                    "issuer": long_issuer,
                    "licenseNumber": long_license_number,
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert licenses[0]["name"] == long_name
    assert licenses[0]["issuer"] == long_issuer
    assert licenses[0]["licenseNumber"] == long_license_number


async def test_update_profile_licenses_many_licenses(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a large number of licenses can be added."""
    licenses = [
        {
            "name": f"License {i}",
            "issuer": f"Issuer {i}",
            "licenseNumber": f"LIC{i:06d}",
            "registrationYear": 2020,
        }
        for i in range(50)
    ]

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={"licenses": licenses},
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 50


async def test_update_profile_licenses_whitespace_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace in fields is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": " Medical License ",
                    "issuer": " Medical Council of India ",
                    "licenseNumber": " MCI123456 ",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert licenses[0]["name"] == " Medical License "
    assert licenses[0]["issuer"] == " Medical Council of India "
    assert licenses[0]["licenseNumber"] == " MCI123456 "


async def test_update_profile_licenses_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updates for different users are independent."""
    # Update first user
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response1["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses1 = response1["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses1) == 1
    assert licenses1[0]["name"] == "Medical License"

    # Update second user with different values
    response2 = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Nursing License",
                    "issuer": "Indian Nursing Council",
                    "licenseNumber": "INC789012",
                    "registrationYear": 2018,
                },
            ],
        },
    )

    assert response2["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses2 = response2["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses2) == 1
    assert licenses2[0]["name"] == "Nursing License"

    # Verify first user's data is unchanged
    response1_verify = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    licenses1_verify = response1_verify["data"]["updateProfileLicenses"]["profile"][
        "licenses"
    ]
    assert len(licenses1_verify) == 1
    assert licenses1_verify[0]["name"] == "Medical License"


async def test_update_profile_licenses_various_license_number_formats(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that various license number formats are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "License 1",
                    "issuer": "Issuer 1",
                    "licenseNumber": "ABC123456",
                    "registrationYear": 2020,
                },
                {
                    "name": "License 2",
                    "issuer": "Issuer 2",
                    "licenseNumber": "123-456-789",
                    "registrationYear": 2020,
                },
                {
                    "name": "License 3",
                    "issuer": "Issuer 3",
                    "licenseNumber": "LIC/2020/001",
                    "registrationYear": 2020,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    assert len(response["data"]["updateProfileLicenses"]["profile"]["licenses"]) == 3


async def test_update_profile_licenses_different_issuers(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that licenses from different issuers are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_LICENSES_MUTATION,
        variables={
            "licenses": [
                {
                    "name": "Medical License",
                    "issuer": "Medical Council of India",
                    "licenseNumber": "MCI123456",
                    "registrationYear": 2020,
                },
                {
                    "name": "Medical License",
                    "issuer": "State Medical Council",
                    "licenseNumber": "SMC789012",
                    "registrationYear": 2019,
                },
                {
                    "name": "Medical License",
                    "issuer": "National Medical Commission",
                    "licenseNumber": "NMC345678",
                    "registrationYear": 2021,
                },
            ],
        },
    )

    assert response["data"]["updateProfileLicenses"]["__typename"] == "Account"
    licenses = response["data"]["updateProfileLicenses"]["profile"]["licenses"]
    assert len(licenses) == 3
    assert licenses[0]["issuer"] == "Medical Council of India"
    assert licenses[1]["issuer"] == "State Medical Council"
    assert licenses[2]["issuer"] == "National Medical Commission"
