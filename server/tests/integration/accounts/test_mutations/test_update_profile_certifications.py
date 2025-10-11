import pytest

from tests.integration.graphql_client import GraphQLClient

UPDATE_PROFILE_CERTIFICATIONS_MUTATION = """
mutation UpdateProfileCertificationsMutation($certifications: [CertificationInput!]!) {
    updateProfileCertifications(certifications: $certifications) {
        __typename
        ... on Account {
            __typename
            id
            profile {
                certifications {
                    name
                    issuer
                    certificationUrl
                    createdAt
                    expiresAt
                }
            }
        }
    }
}
"""


async def test_update_profile_certifications_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_profile_certifications_empty_list(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications works with empty list."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        == []
    )


async def test_update_profile_certifications_single_certification(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications works with a single certification."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications) == 1
    assert certifications[0]["name"] == "AWS Certified Solutions Architect"
    assert certifications[0]["issuer"] == "Amazon Web Services"
    assert (
        certifications[0]["certificationUrl"] == "https://aws.amazon.com/certification/"
    )
    assert certifications[0]["createdAt"] == "2023-01-15"
    assert certifications[0]["expiresAt"] is None


async def test_update_profile_certifications_with_expiry(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that certifications with expiry dates are handled correctly."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "CPR Certification",
                    "issuer": "American Heart Association",
                    "certificationUrl": "https://cpr.heart.org/",
                    "createdAt": "2023-01-15",
                    "expiresAt": "2025-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications) == 1
    assert certifications[0]["expiresAt"] == "2025-01-15"


async def test_update_profile_certifications_multiple_certifications(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications works with multiple certifications."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "Certified Kubernetes Administrator",
                    "issuer": "Cloud Native Computing Foundation",
                    "certificationUrl": "https://www.cncf.io/certification/cka/",
                    "createdAt": "2023-06-20",
                    "expiresAt": "2026-06-20",
                },
                {
                    "name": "BLS Certification",
                    "issuer": "American Heart Association",
                    "certificationUrl": "https://cpr.heart.org/",
                    "createdAt": "2022-03-10",
                    "expiresAt": "2024-03-10",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications) == 3
    assert certifications[0]["name"] == "AWS Certified Solutions Architect"
    assert certifications[1]["name"] == "Certified Kubernetes Administrator"
    assert certifications[2]["name"] == "BLS Certification"


async def test_update_profile_certifications_replaces_existing(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications replaces existing certifications."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "Certified Kubernetes Administrator",
                    "issuer": "Cloud Native Computing Foundation",
                    "certificationUrl": "https://www.cncf.io/certification/cka/",
                    "createdAt": "2023-06-20",
                },
            ],
        },
    )

    assert response1["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response1["data"]["updateProfileCertifications"]["profile"][
                "certifications"
            ]
        )
        == 2
    )

    # Second update should replace
    response2 = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "BLS Certification",
                    "issuer": "American Heart Association",
                    "certificationUrl": "https://cpr.heart.org/",
                    "createdAt": "2022-03-10",
                },
            ],
        },
    )

    assert response2["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response2["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications) == 1
    assert certifications[0]["name"] == "BLS Certification"


async def test_update_profile_certifications_duplicate_certifications(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that duplicate certifications are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2024-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
        == 2
    )


async def test_update_profile_certifications_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_profile_certifications works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
        == 1
    )


async def test_update_profile_certifications_preserves_other_profile_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updating certifications doesn't affect other profile fields."""
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

    # Now update certifications
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    # Verify certifications were updated
    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
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


@pytest.mark.parametrize(
    ("created_at", "expires_at", "description"),
    [
        ("2023-01-15", None, "No expiry date"),
        ("2023-01-15", "2025-01-15", "With expiry date"),
        ("2020-01-01", "2022-01-01", "Expired certification"),
        ("2024-12-31", "2027-12-31", "Future certification"),
    ],
)
async def test_update_profile_certifications_various_dates(
    password_auth_graphql_client: GraphQLClient,
    created_at: str,
    expires_at: str | None,
    description: str,
) -> None:
    """Test various date combinations for certifications."""
    variables = {
        "certifications": [
            {
                "name": "Test Certification",
                "issuer": "Test Issuer",
                "certificationUrl": "https://example.com/cert",
                "createdAt": created_at,
            },
        ],
    }

    if expires_at is not None:
        variables["certifications"][0]["expiresAt"] = expires_at

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables=variables,
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account", (
        f"Failed for case: {description}"
    )
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert certifications[0]["createdAt"] == created_at
    assert certifications[0]["expiresAt"] == expires_at


async def test_update_profile_certifications_special_characters_in_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that certification names with special characters are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "Certification & Training (Level 1)",
                    "issuer": "Test Org",
                    "certificationUrl": "https://example.com/cert",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "Advanced C++ Programming",
                    "issuer": "Tech Institute",
                    "certificationUrl": "https://example.com/cert2",
                    "createdAt": "2023-06-20",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
        == 2
    )


async def test_update_profile_certifications_long_values(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that long certification values are handled."""
    long_name = "A" * 200
    long_issuer = "B" * 200
    long_url = "https://example.com/" + "c" * 200

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": long_name,
                    "issuer": long_issuer,
                    "certificationUrl": long_url,
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert certifications[0]["name"] == long_name
    assert certifications[0]["issuer"] == long_issuer
    assert certifications[0]["certificationUrl"] == long_url


async def test_update_profile_certifications_many_certifications(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that a large number of certifications can be added."""
    certifications = [
        {
            "name": f"Certification {i}",
            "issuer": f"Issuer {i}",
            "certificationUrl": f"https://example.com/cert{i}",
            "createdAt": "2023-01-15",
        }
        for i in range(50)
    ]

    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={"certifications": certifications},
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
        == 50
    )


async def test_update_profile_certifications_various_url_formats(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that various URL formats are handled."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "Cert 1",
                    "issuer": "Issuer 1",
                    "certificationUrl": "https://example.com/cert",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "Cert 2",
                    "issuer": "Issuer 2",
                    "certificationUrl": "http://example.com/cert",
                    "createdAt": "2023-01-15",
                },
                {
                    "name": "Cert 3",
                    "issuer": "Issuer 3",
                    "certificationUrl": "https://example.com/cert?id=123&type=advanced",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    assert (
        len(
            response["data"]["updateProfileCertifications"]["profile"]["certifications"]
        )
        == 3
    )


async def test_update_profile_certifications_whitespace_in_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that whitespace in fields is preserved."""
    response = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": " AWS Certified Solutions Architect ",
                    "issuer": " Amazon Web Services ",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications = response["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert certifications[0]["name"] == " AWS Certified Solutions Architect "
    assert certifications[0]["issuer"] == " Amazon Web Services "


async def test_update_profile_certifications_multiple_users_independent(
    password_auth_graphql_client: GraphQLClient,
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that updates for different users are independent."""
    # Update first user
    response1 = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    assert response1["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications1 = response1["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications1) == 1
    assert certifications1[0]["name"] == "AWS Certified Solutions Architect"

    # Update second user with different values
    response2 = await webauthn_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "BLS Certification",
                    "issuer": "American Heart Association",
                    "certificationUrl": "https://cpr.heart.org/",
                    "createdAt": "2022-03-10",
                },
            ],
        },
    )

    assert response2["data"]["updateProfileCertifications"]["__typename"] == "Account"
    certifications2 = response2["data"]["updateProfileCertifications"]["profile"][
        "certifications"
    ]
    assert len(certifications2) == 1
    assert certifications2[0]["name"] == "BLS Certification"

    # Verify first user's data is unchanged
    response1_verify = await password_auth_graphql_client(
        UPDATE_PROFILE_CERTIFICATIONS_MUTATION,
        variables={
            "certifications": [
                {
                    "name": "AWS Certified Solutions Architect",
                    "issuer": "Amazon Web Services",
                    "certificationUrl": "https://aws.amazon.com/certification/",
                    "createdAt": "2023-01-15",
                },
            ],
        },
    )

    certifications1_verify = response1_verify["data"]["updateProfileCertifications"][
        "profile"
    ]["certifications"]
    assert len(certifications1_verify) == 1
    assert certifications1_verify[0]["name"] == "AWS Certified Solutions Architect"
