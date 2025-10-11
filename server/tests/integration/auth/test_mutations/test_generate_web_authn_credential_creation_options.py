import json

from app.accounts.documents import Account

from tests.integration.graphql_client import GraphQLClient

GENERATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION = """
mutation GenerateWebAuthnCredentialCreationOptionsMutation {
    generateWebAuthnCredentialCreationOptions {
        __typename
        ... on GeneratePasskeyCreationOptionsSuccess {
            registrationOptions
        }
    }
}
"""


async def test_generate_web_authn_credential_creation_options_successful(
    webauthn_auth_sudo_graphql_client: GraphQLClient,
    webauthn_account: Account,
) -> None:
    """Ensure that generate_web_authn_credential_creation_options succeeds with valid authentication and sudo mode."""
    response = await webauthn_auth_sudo_graphql_client(
        GENERATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
    )

    data = response["data"]["generateWebAuthnCredentialCreationOptions"]
    assert data["__typename"] == "GeneratePasskeyCreationOptionsSuccess"
    assert "registrationOptions" in data

    registration_options = data["registrationOptions"]
    assert isinstance(registration_options, str)
    assert len(registration_options) > 0

    parsed_options = json.loads(registration_options)
    assert isinstance(parsed_options, dict)

    assert "challenge" in parsed_options
    assert "rp" in parsed_options
    assert "user" in parsed_options
    assert "pubKeyCredParams" in parsed_options

    user_info = parsed_options["user"]
    assert user_info["name"] == webauthn_account.email
    assert user_info["displayName"] == webauthn_account.full_name
    assert "id" in user_info


async def test_generate_web_authn_credential_creation_options_without_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_web_authn_credential_creation_options fails without authentication."""
    response = await graphql_client(
        GENERATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
    )

    assert "errors" in response


async def test_generate_web_authn_credential_creation_options_without_sudo_mode(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that generate_web_authn_credential_creation_options fails without sudo mode."""
    response = await webauthn_auth_graphql_client(
        GENERATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
    )

    assert "errors" in response


async def test_generate_web_authn_credential_creation_options_with_password_account(
    password_auth_sudo_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that generate_web_authn_credential_creation_options works for password-based accounts."""
    response = await password_auth_sudo_graphql_client(
        GENERATE_WEB_AUTHN_CREDENTIAL_CREATION_OPTIONS_MUTATION,
    )

    data = response["data"]["generateWebAuthnCredentialCreationOptions"]
    assert data["__typename"] == "GeneratePasskeyCreationOptionsSuccess"
    assert "registrationOptions" in data

    registration_options = data["registrationOptions"]
    parsed_options = json.loads(registration_options)

    user_info = parsed_options["user"]
    assert user_info["name"] == password_account.email
    assert user_info["displayName"] == password_account.full_name
