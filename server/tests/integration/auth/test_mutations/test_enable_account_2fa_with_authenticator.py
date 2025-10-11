import pyotp
import pytest
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient

GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION = """
mutation GenerateAuthenticator2FAChallengeMutation {
    generateAuthenticator2faChallenge {
        __typename
        ... on GenerateAuthenticator2FAChallengeSuccess {
            otpUri
            secret
        }
    }
}
"""

ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION = """
mutation EnableAccount2FAWithAuthenticatorMutation($token: String!) {
    enableAccount2faWithAuthenticator(token: $token) {
        __typename
        ... on EnableAccount2FAWithAuthenticatorSuccess {
            account {
                id
            }
            recoveryCodes
        }
        ... on InvalidCredentialsError {
            __typename
        }
        ... on TwoFactorAuthenticationChallengeNotFoundError {
            __typename
        }
    }
}
"""


async def test_enable_2fa_with_valid_token(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we can enable 2FA with a valid TOTP token."""
    challenge_response = await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION
    )

    assert (
        challenge_response["data"]["generateAuthenticator2faChallenge"]["__typename"]
        == "GenerateAuthenticator2FAChallengeSuccess"
    )

    secret = challenge_response["data"]["generateAuthenticator2faChallenge"]["secret"]
    totp = pyotp.TOTP(secret)
    valid_token = totp.now()

    response = await password_auth_sudo_graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": valid_token},
    )

    assert (
        response["data"]["enableAccount2faWithAuthenticator"]["__typename"]
        == "EnableAccount2FAWithAuthenticatorSuccess"
    )
    assert (
        len(response["data"]["enableAccount2faWithAuthenticator"]["recoveryCodes"]) > 0
    )


async def test_enable_2fa_with_invalid_token(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot enable 2FA with an invalid TOTP token."""
    await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION
    )

    response = await password_auth_sudo_graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": "000000"},
    )

    assert (
        response["data"]["enableAccount2faWithAuthenticator"]["__typename"]
        == "InvalidCredentialsError"
    )


async def test_enable_2fa_without_challenge(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot enable 2FA without generating a challenge first."""
    response = await password_auth_sudo_graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": "123456"},
    )

    assert (
        response["data"]["enableAccount2faWithAuthenticator"]["__typename"]
        == "TwoFactorAuthenticationChallengeNotFoundError"
    )


async def test_enable_2fa_with_empty_token(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot enable 2FA with an empty token."""
    await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION
    )

    response = await password_auth_sudo_graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": ""},
    )

    assert (
        response["data"]["enableAccount2faWithAuthenticator"]["__typename"]
        == "InvalidCredentialsError"
    )


async def test_enable_2fa_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot enable 2FA without sudo mode."""
    response = await password_auth_graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": "123456"},
    )

    assert "errors" in response


async def test_enable_2fa_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot enable 2FA."""
    response = await graphql_client(
        ENABLE_ACCOUNT_2FA_WITH_AUTHENTICATOR_MUTATION,
        variables={"token": "123456"},
    )

    assert "errors" in response
