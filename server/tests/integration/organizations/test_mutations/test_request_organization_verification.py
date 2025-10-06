from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry.relay import to_base64

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

REQUEST_ORGANIZATION_VERIFICATION_MUTATION = """
mutation RequestOrganizationVerification(
    $organizationId: ID!
    $registeredOrganizationName: String!
    $contactEmail: String!
    $phoneNumber: String!
    $address: AddressInput!
    $businessProofType: BusinessProof!
    $businessProofUrl: String!
    $addressProofType: AddressProof!
    $addressProofUrl: String!
) {
    requestOrganizationVerification(
        organizationId: $organizationId
        registeredOrganizationName: $registeredOrganizationName
        contactEmail: $contactEmail
        phoneNumber: $phoneNumber
        address: $address
        businessProofType: $businessProofType
        businessProofUrl: $businessProofUrl
        addressProofType: $addressProofType
        addressProofUrl: $addressProofUrl
    ) {
        __typename
        ... on Organization {
            id
            name
            slug
        }
        ... on OrganizationNotFoundError {
            __typename
            message
        }
        ... on OrganizationAuthorizationError {
            __typename
            message
        }
        ... on OrganizationAlreadyVerifiedError {
            __typename
            message
        }
        ... on OrganizationVerificationRequestAlreadyExistsError {
            __typename
            message
        }
        ... on InvalidPhoneNumberError {
            __typename
            message
        }
    }
}
"""


@pytest.fixture
async def organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization."""
    org = await organization_repo.create(
        name="Test Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def member_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization where user is a member."""
    org = await organization_repo.create(
        name="Member Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="member",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_request_organization_verification_successful(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test successful organization verification request."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"
    assert data["id"] == to_base64("Organization", str(organization.id))


async def test_request_organization_verification_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test verification request for non-existent organization."""
    from bson import ObjectId

    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_request_organization_verification_unauthorized_member(
    password_auth_graphql_client: GraphQLClient,
    member_organization: Organization,
) -> None:
    """Test that non-admin members cannot request verification."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(member_organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_request_organization_verification_unauthorized_non_member(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test that non-members cannot request verification."""
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )

    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_repo.delete(org)


async def test_request_organization_verification_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_request_organization_verification_already_verified(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test that already verified organizations cannot request verification again."""
    from app.base.models import Address

    org = await organization_repo.create(
        name="Verified Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    # Create an approved verification request
    await organization_repo.create_verification_request(
        organization=org,
        account=password_account,
        registered_organization_name="Verified Hospital Pvt Ltd",
        contact_email="contact@verified.com",
        phone_number="+919876543210",
        address=Address(
            street_address="123 Main Street",
            address_locality="Mumbai",
            address_region="Maharashtra",
            country="IN",
            postal_code="400001",
        ),
        business_proof_type="gst_certificate",
        business_proof_url="https://cdn.example.com/gst-cert.pdf",
        address_proof_type="utility_bill",
        address_proof_url="https://cdn.example.com/utility-bill.pdf",
    )

    # Manually approve the verification request
    org = await organization_repo.get(organization_id=org.id)
    if org and org.verification_request:
        org.verification_request.status = "approved"
        await org.save()

    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "OrganizationAlreadyVerifiedError"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_request_organization_verification_pending_request_exists(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test that organizations with pending verification cannot request again."""
    from app.base.models import Address

    org = await organization_repo.create(
        name="Pending Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    # Create a pending verification request
    await organization_repo.create_verification_request(
        organization=org,
        account=password_account,
        registered_organization_name="Pending Hospital Pvt Ltd",
        contact_email="contact@pending.com",
        phone_number="+919876543210",
        address=Address(
            street_address="123 Main Street",
            address_locality="Mumbai",
            address_region="Maharashtra",
            country="IN",
            postal_code="400001",
        ),
        business_proof_type="gst_certificate",
        business_proof_url="https://cdn.example.com/gst-cert.pdf",
        address_proof_type="utility_bill",
        address_proof_url="https://cdn.example.com/utility-bill.pdf",
    )

    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "OrganizationVerificationRequestAlreadyExistsError"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.mark.parametrize(
    "phone_number",
    [
        "+1234567890",  # Non-Indian number
        "9876543210",  # Missing country code
        "+91123",  # Too short
        "+919999999999999",  # Too long
        "invalid",  # Invalid format
        "+44987654321",  # UK number
        "+919876543",  # Incomplete Indian number
    ],
)
async def test_request_organization_verification_invalid_phone_number(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    phone_number: str,
) -> None:
    """Test verification request with invalid phone numbers."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": phone_number,
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "InvalidPhoneNumberError"


@pytest.mark.parametrize(
    "phone_number",
    [
        "+919876543210",
        "+91 98765 43210",
        "+91-9876543210",
        "+919999999999",
        "+918888888888",
    ],
)
async def test_request_organization_verification_valid_phone_numbers(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    phone_number: str,
) -> None:
    """Test verification request with various valid Indian phone numbers."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": phone_number,
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"


@pytest.mark.parametrize(
    "business_proof_type",
    [
        "GST_CERTIFICATE",
        "CLINIC_REGISTRATION",
        "MSME_REGISTRATION",
        "SHOP_LICENSE",
        "MEDICAL_COUNCIL_REGISTRATION",
        "OTHER",
    ],
)
async def test_request_organization_verification_business_proof_types(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    business_proof_type: str,
) -> None:
    """Test verification request with different business proof types."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": business_proof_type,
            "businessProofUrl": "https://cdn.example.com/proof.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"


@pytest.mark.parametrize(
    "address_proof_type",
    [
        "UTILITY_BILL",
        "RENTAL_AGREEMENT",
        "BANK_STATEMENT",
        "OTHER",
    ],
)
async def test_request_organization_verification_address_proof_types(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    address_proof_type: str,
) -> None:
    """Test verification request with different address proof types."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": address_proof_type,
            "addressProofUrl": "https://cdn.example.com/proof.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"


async def test_request_organization_verification_minimal_address(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test verification request with minimal address fields."""
    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": None,
                "addressLocality": "Mumbai",
                "addressRegion": None,
                "country": None,
                "postalCode": None,
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"


async def test_request_organization_verification_after_rejection(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test that organizations can request verification after rejection."""
    from app.base.models import Address

    org = await organization_repo.create(
        name="Rejected Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    # Create a rejected verification request
    await organization_repo.create_verification_request(
        organization=org,
        account=password_account,
        registered_organization_name="Rejected Hospital Pvt Ltd",
        contact_email="contact@rejected.com",
        phone_number="+919876543210",
        address=Address(
            street_address="123 Main Street",
            address_locality="Mumbai",
            address_region="Maharashtra",
            country="IN",
            postal_code="400001",
        ),
        business_proof_type="gst_certificate",
        business_proof_url="https://cdn.example.com/gst-cert.pdf",
        address_proof_type="utility_bill",
        address_proof_url="https://cdn.example.com/utility-bill.pdf",
    )

    # Manually reject the verification request
    org = await organization_repo.get(organization_id=org.id)
    if org and org.verification_request:
        org.verification_request.status = "rejected"
        await org.save()

    response = await password_auth_graphql_client(
        REQUEST_ORGANIZATION_VERIFICATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "registeredOrganizationName": "Test Hospital Pvt Ltd",
            "contactEmail": "contact@testhospital.com",
            "phoneNumber": "+919876543210",
            "address": {
                "streetAddress": "123 Main Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "country": "IN",
                "postalCode": "400001",
            },
            "businessProofType": "GST_CERTIFICATE",
            "businessProofUrl": "https://cdn.example.com/gst-cert.pdf",
            "addressProofType": "UTILITY_BILL",
            "addressProofUrl": "https://cdn.example.com/utility-bill.pdf",
        },
    )

    data = response["data"]["requestOrganizationVerification"]
    assert data["__typename"] == "Organization"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)
