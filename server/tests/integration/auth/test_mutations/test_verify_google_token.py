import time
from unittest.mock import Mock, patch

import pytest
from app.accounts.repositories import AccountRepo
from jose import ExpiredSignatureError, JWTError, jwt

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email

VERIFY_GOOGLE_TOKEN_MUTATION = """
mutation VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token) {
        __typename
        ... on Account {
            id
            email
            fullName
        }
        ... on InvalidCredentialsError {
            message
        }
        ... on InvalidEmailError {
            message
        }
        ... on TwoFactorAuthenticationRequiredError {
            message
        }
    }
}
"""


def create_mock_google_token(
    email: str,
    name: str,
    sub: str,
    email_verified: bool,
    client_id: str,
    exp_offset: int = 3600,
) -> str:
    """Create a mock Google JWT token for testing."""
    now = int(time.time())
    payload = {
        "iss": "https://accounts.google.com",
        "azp": client_id,
        "aud": client_id,
        "sub": sub,
        "email": email,
        "email_verified": email_verified,
        "name": name,
        "iat": now,
        "exp": now + exp_offset,
    }
    # Create unsigned token (we'll mock the verification)
    return jwt.encode(payload, "secret", algorithm="HS256")


@pytest.fixture
def mock_jwks():
    """Mock JWKS response from Google."""
    return {
        "keys": [
            {
                "kty": "RSA",
                "alg": "RS256",
                "use": "sig",
                "kid": "test-key-id",
                "n": "test-n",
                "e": "AQAB",
            }
        ]
    }


async def test_verify_google_token_new_user_signup(
    graphql_client: GraphQLClient,
    account_repo: AccountRepo,
    mock_jwks: dict,
) -> None:
    """Test successful signup with Google token for a new user."""
    test_email = generate_test_email()
    test_name = "John Doe"
    test_sub = "google-user-123"
    google_client_id = "test-client-id"

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=True,
        client_id=google_client_id,
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.return_value = {
            "email": test_email,
            "name": test_name,
            "sub": test_sub,
            "email_verified": True,
        }

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert response["data"]["verifyGoogleToken"]["__typename"] == "Account"
        assert response["data"]["verifyGoogleToken"]["email"] == test_email
        assert response["data"]["verifyGoogleToken"]["fullName"] == test_name

        # Verify account was created
        account = await account_repo.get_by_email(email=test_email)
        assert account is not None
        assert account.email == test_email
        assert account.full_name == test_name
        assert "oauth_google" in account.auth_providers

        # Cleanup
        await account_repo.delete(account)


async def test_verify_google_token_existing_user_signin(
    graphql_client: GraphQLClient,
    account_repo: AccountRepo,
    mock_jwks: dict,
) -> None:
    """Test successful signin with Google token for an existing user."""
    test_email = generate_test_email()
    test_name = "Jane Smith"
    test_sub = "google-user-456"
    google_client_id = "test-client-id"

    # Create existing account with Google OAuth
    existing_account = await account_repo.create(
        email=test_email,
        full_name=test_name,
        password=None,
        auth_providers=["oauth_google"],
        analytics_preference="acceptance",
    )

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=True,
        client_id=google_client_id,
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.return_value = {
            "email": test_email,
            "name": test_name,
            "sub": test_sub,
            "email_verified": True,
        }

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert response["data"]["verifyGoogleToken"]["__typename"] == "Account"
        assert response["data"]["verifyGoogleToken"]["email"] == test_email

    # Cleanup
    await account_repo.delete(existing_account)


async def test_verify_google_token_unverified_email(
    graphql_client: GraphQLClient,
    mock_jwks: dict,
) -> None:
    """Test rejection of Google token with unverified email."""
    test_email = generate_test_email()
    test_name = "Unverified User"
    test_sub = "google-user-789"
    google_client_id = "test-client-id"

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=False,
        client_id=google_client_id,
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.return_value = {
            "email": test_email,
            "name": test_name,
            "sub": test_sub,
            "email_verified": False,
        }

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert (
            response["data"]["verifyGoogleToken"]["__typename"] == "InvalidEmailError"
        )


async def test_verify_google_token_invalid_token(
    graphql_client: GraphQLClient,
    mock_jwks: dict,
) -> None:
    """Test rejection of invalid Google token."""
    invalid_token = "invalid.jwt.token"

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.side_effect = JWTError("Invalid token")

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": invalid_token},
        )

        assert (
            response["data"]["verifyGoogleToken"]["__typename"]
            == "InvalidCredentialsError"
        )


async def test_verify_google_token_expired_token(
    graphql_client: GraphQLClient,
    mock_jwks: dict,
) -> None:
    """Test rejection of expired Google token."""
    test_email = generate_test_email()
    test_name = "Expired User"
    test_sub = "google-user-expired"
    google_client_id = "test-client-id"

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=True,
        client_id=google_client_id,
        exp_offset=-3600,  # Expired 1 hour ago
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.side_effect = ExpiredSignatureError("Token expired")

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert (
            response["data"]["verifyGoogleToken"]["__typename"]
            == "InvalidCredentialsError"
        )


async def test_verify_google_token_adds_oauth_to_existing_password_account(
    graphql_client: GraphQLClient,
    account_repo: AccountRepo,
    mock_jwks: dict,
) -> None:
    """Test adding Google OAuth to an existing password-only account."""
    test_email = generate_test_email()
    test_name = "Password User"
    test_sub = "google-user-password"
    google_client_id = "test-client-id"

    # Create existing account with password only
    existing_account = await account_repo.create(
        email=test_email,
        full_name=test_name,
        password="Password123!",
        auth_providers=["password"],
        analytics_preference="acceptance",
    )

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=True,
        client_id=google_client_id,
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.return_value = {
            "email": test_email,
            "name": test_name,
            "sub": test_sub,
            "email_verified": True,
        }

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert response["data"]["verifyGoogleToken"]["__typename"] == "Account"

        # Verify oauth_google was added to auth_providers
        updated_account = await account_repo.get_by_email(email=test_email)
        assert updated_account is not None
        assert "password" in updated_account.auth_providers
        assert "oauth_google" in updated_account.auth_providers

    # Cleanup
    await account_repo.delete(existing_account)


async def test_verify_google_token_with_2fa_enabled(
    graphql_client: GraphQLClient,
    account_repo: AccountRepo,
    mock_jwks: dict,
) -> None:
    """Test Google signin triggers 2FA when enabled on account."""
    test_email = generate_test_email()
    test_name = "2FA User"
    test_sub = "google-user-2fa"
    google_client_id = "test-client-id"

    # Create account with 2FA enabled
    existing_account = await account_repo.create(
        email=test_email,
        full_name=test_name,
        password=None,
        auth_providers=["oauth_google"],
        analytics_preference="acceptance",
    )

    # Enable 2FA
    await account_repo.set_two_factor_secret(
        account=existing_account,
        totp_secret="JBSWY3DPEHPK3PXP",
    )

    token = create_mock_google_token(
        email=test_email,
        name=test_name,
        sub=test_sub,
        email_verified=True,
        client_id=google_client_id,
    )

    with (
        patch("httpx.AsyncClient.get") as mock_get,
        patch("jose.jwt.decode") as mock_decode,
    ):
        mock_response = Mock()
        mock_response.json.return_value = mock_jwks
        mock_get.return_value = mock_response

        mock_decode.return_value = {
            "email": test_email,
            "name": test_name,
            "sub": test_sub,
            "email_verified": True,
        }

        response = await graphql_client(
            VERIFY_GOOGLE_TOKEN_MUTATION,
            variables={"token": token},
        )

        assert (
            response["data"]["verifyGoogleToken"]["__typename"]
            == "TwoFactorAuthenticationRequiredError"
        )

    # Cleanup
    await account_repo.delete(existing_account)
