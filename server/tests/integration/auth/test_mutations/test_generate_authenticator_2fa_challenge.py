from urllib.parse import unquote

import pyotp
from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient

GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION = """
mutation GenerateAuthenticator2FAChallengeMutation {
    generateAuthenticator2faChallenge {
        __typename
        ... on GenerateAuthenticator2FAChallengeSuccess {
            __typename
            otpUri
            secret
        }
    }
}
"""


async def test_generate_authenticator_2fa_challenge_success(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that we can generate a 2FA challenge with valid sudo mode."""
    response = await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )

    assert response == {
        "data": {
            "generateAuthenticator2faChallenge": {
                "__typename": "GenerateAuthenticator2FAChallengeSuccess",
                "otpUri": response["data"]["generateAuthenticator2faChallenge"][
                    "otpUri"
                ],
                "secret": response["data"]["generateAuthenticator2faChallenge"][
                    "secret"
                ],
            },
        },
    }

    data = response["data"]["generateAuthenticator2faChallenge"]
    assert "otpUri" in data
    assert "secret" in data
    assert data["otpUri"].startswith("otpauth://totp/")
    assert password_account.email in unquote(data["otpUri"])
    assert len(data["secret"]) == 32


async def test_generate_authenticator_2fa_challenge_valid_secret(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that the generated secret is a valid TOTP secret."""
    response = await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )

    data = response["data"]["generateAuthenticator2faChallenge"]
    secret = data["secret"]

    totp = pyotp.TOTP(secret)
    token = totp.now()
    assert len(token) == 6
    assert token.isdigit()


async def test_generate_authenticator_2fa_challenge_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that we cannot generate a 2FA challenge without sudo mode."""
    response = await password_auth_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )

    assert "errors" in response


async def test_generate_authenticator_2fa_challenge_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that unauthenticated users cannot generate a 2FA challenge."""
    response = await graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )

    assert "errors" in response


async def test_generate_authenticator_2fa_challenge_multiple_times(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Ensure that generating multiple challenges returns different secrets."""
    response1 = await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )
    response2 = await password_auth_sudo_graphql_client(
        GENERATE_AUTHENTICATOR_2FA_CHALLENGE_MUTATION,
    )

    data1 = response1["data"]["generateAuthenticator2faChallenge"]
    data2 = response2["data"]["generateAuthenticator2faChallenge"]

    assert data1["secret"] != data2["secret"]
    assert data1["otpUri"] != data2["otpUri"]
