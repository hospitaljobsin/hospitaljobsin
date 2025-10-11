import pytest
from app.accounts.documents import Account
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient

UPDATE_ACCOUNT_MUTATION = """
mutation UpdateAccountMutation($fullName: String!, $avatarUrl: String) {
    updateAccount(fullName: $fullName, avatarUrl: $avatarUrl) {
        __typename
        ... on Account {
            __typename
            id
            fullName
            avatarUrl
        }
    }
}
"""


async def test_update_account_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account fails when user is not authenticated."""
    response = await graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "New Name",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_account_full_name_only(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account works when updating only full name."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Updated Name",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "Updated Name"
    assert "id" in response["data"]["updateAccount"]


async def test_update_account_both_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account works when updating both fields."""
    avatar_url = "https://example.com/avatar.jpg"
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Both Fields Updated",
            "avatarUrl": avatar_url,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "Both Fields Updated"
    assert response["data"]["updateAccount"]["avatarUrl"] == avatar_url


async def test_update_account_avatar_url_to_default(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account can set avatar URL to default."""
    # First set an avatar
    await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "avatarUrl": "https://example.com/avatar.jpg",
            "fullName": "John Doe",
        },
    )

    # Then set it to null
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "avatarUrl": None,
            "fullName": "John Doe",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["avatarUrl"] is not None
    assert (
        response["data"]["updateAccount"]["avatarUrl"]
        != "https://example.com/avatar.jpg"
    )


async def test_update_account_persists_changes(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that update_account actually persists changes to the database."""
    original_full_name = password_account.full_name
    new_full_name = "Persisted Name"

    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": new_full_name,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == new_full_name

    # Verify the account was actually updated by refreshing from database
    await password_account.sync()
    assert password_account.full_name == new_full_name
    assert password_account.full_name != original_full_name


async def test_update_account_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "WebAuthn User Updated",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "WebAuthn User Updated"


@pytest.mark.parametrize(
    ("full_name", "description"),
    [
        ("A", "Single character name"),
        ("A" * 100, "Very long name"),
        ("John Doe", "Name with space"),
        ("José García", "Name with accents"),
        ("李明", "Chinese characters"),
        ("محمد", "Arabic characters"),
        ("Иван Петров", "Cyrillic characters"),
        ("O'Brien", "Name with apostrophe"),
        ("Mary-Jane", "Name with hyphen"),
        ("Dr. Smith Jr.", "Name with title and suffix"),
    ],
)
async def test_update_account_various_full_names(
    password_auth_graphql_client: GraphQLClient,
    full_name: str,
    description: str,
) -> None:
    """Test various valid full name formats."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": full_name,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == full_name, (
        f"Failed for case: {description}"
    )


@pytest.mark.parametrize(
    ("avatar_url", "description"),
    [
        ("https://example.com/avatar.jpg", "HTTPS URL"),
        ("https://cdn.example.com/images/avatar.png", "CDN URL"),
        ("https://example.com/path/to/avatar.gif", "URL with path"),
        (
            "https://example.com/avatar.jpg?size=large&format=webp",
            "URL with query params",
        ),
        ("https://s3.amazonaws.com/bucket/avatar.jpg", "S3 URL"),
    ],
)
async def test_update_account_various_avatar_urls(
    password_auth_graphql_client: GraphQLClient,
    avatar_url: str,
    description: str,
) -> None:
    """Test various valid avatar URL formats."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "avatarUrl": avatar_url,
            "fullName": "John Doe",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["avatarUrl"] == avatar_url, (
        f"Failed for case: {description}"
    )


async def test_update_account_multiple_times(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account can be called multiple times."""
    # First update
    response1 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "First Update",
        },
    )
    assert response1["data"]["updateAccount"]["fullName"] == "First Update"

    # Second update
    response2 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Second Update",
        },
    )
    assert response2["data"]["updateAccount"]["fullName"] == "Second Update"

    # Third update
    response3 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Third Update",
        },
    )
    assert response3["data"]["updateAccount"]["fullName"] == "Third Update"


async def test_update_account_empty_string_full_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account accepts empty string for full name."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == ""


async def test_update_account_whitespace_full_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account preserves whitespace in full name."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "  John   Doe  ",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "  John   Doe  "


async def test_update_account_special_characters_in_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account handles special characters in name."""
    special_name = "Test!@#$%^&*()_+-=[]{}|;:',.<>?/~`"
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": special_name,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == special_name


async def test_update_account_newline_in_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account handles newlines in name."""
    name_with_newline = "John\nDoe"
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": name_with_newline,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == name_with_newline


async def test_update_account_emoji_in_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account handles emojis in name."""
    emoji_name = "John 😀 Doe 🎉"
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": emoji_name,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == emoji_name


async def test_update_account_returns_same_account_id(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
) -> None:
    """Ensure that update_account returns the same account ID."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "ID Check",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["id"] == relay.to_base64(
        "Account", password_account.id
    )


async def test_update_account_does_not_affect_other_accounts(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Ensure that updating one account doesn't affect other accounts."""
    original_foreign_name = foreign_password_account.full_name

    # Update the authenticated account
    await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Updated Current Account",
        },
    )

    # Verify the foreign account was not affected
    await foreign_password_account.sync()
    assert foreign_password_account.full_name == original_foreign_name
