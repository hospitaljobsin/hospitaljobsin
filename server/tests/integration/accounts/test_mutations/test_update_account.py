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


async def test_update_account_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account works for webauthn accounts."""
    response = await webauthn_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "WebAuthn User Updated",
            "avatarUrl": "https://example.com/avatar.jpg",
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "WebAuthn User Updated"
    assert (
        response["data"]["updateAccount"]["avatarUrl"]
        == "https://example.com/avatar.jpg"
    )


@pytest.mark.parametrize(
    ("full_name", "description"),
    [
        ("A", "Single character name"),
        ("A" * 100, "Maximum length name"),
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
            "avatarUrl": "https://example.com/avatar.jpg",
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
            "avatarUrl": None,
        },
    )
    assert response1["data"]["updateAccount"]["fullName"] == "First Update"

    # Second update
    response2 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Second Update",
            "avatarUrl": None,
        },
    )
    assert response2["data"]["updateAccount"]["fullName"] == "Second Update"

    # Third update
    response3 = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "Third Update",
            "avatarUrl": None,
        },
    )
    assert response3["data"]["updateAccount"]["fullName"] == "Third Update"


async def test_update_account_empty_string_full_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account strips whitespace from empty string."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "",
            "avatarUrl": None,
        },
    )

    assert "errors" in response


async def test_update_account_whitespace_full_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account strips leading and trailing whitespace."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "  John   Doe  ",
            "avatarUrl": None,
        },
    )

    assert response["data"]["updateAccount"]["__typename"] == "Account"
    assert response["data"]["updateAccount"]["fullName"] == "John   Doe"


async def test_update_account_special_characters_in_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account handles special characters in name."""
    special_name = "Test!@#$%^&*()_+-=[]{}|;:',.<>?/~`"
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": special_name,
            "avatarUrl": None,
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
            "avatarUrl": None,
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
            "avatarUrl": None,
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
            "avatarUrl": None,
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
            "avatarUrl": None,
        },
    )

    # Verify the foreign account was not affected
    await foreign_password_account.sync()
    assert foreign_password_account.full_name == original_foreign_name


async def test_update_account_full_name_exceeds_max_length(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account rejects full name exceeding 100 characters."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "A" * 101,
            "avatarUrl": None,
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_account_invalid_avatar_url(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account rejects invalid avatar URL."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "John Doe",
            "avatarUrl": "not-a-valid-url",
        },
    )

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_update_account_whitespace_only_full_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that update_account strips whitespace-only full name to empty string."""
    response = await password_auth_graphql_client(
        UPDATE_ACCOUNT_MUTATION,
        variables={
            "fullName": "   ",
            "avatarUrl": None,
        },
    )

    assert "errors" in response
