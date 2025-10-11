from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from tests.integration.graphql_client import GraphQLClient
from urllib.parse import urlparse

REMOVE_ACCOUNT_AVATAR_MUTATION = """
mutation RemoveAccountAvatarMutation {
    removeAccountAvatar {
        __typename
        id
        avatarUrl
    }
}
"""


async def test_remove_account_avatar_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_account_avatar fails when user is not authenticated."""
    response = await graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert "errors" in response
    assert len(response["errors"]) > 0


async def test_remove_account_avatar_no_avatar(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Ensure that remove_account_avatar succeeds even when account has no custom avatar."""
    response = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert response["data"]["removeAccountAvatar"]["__typename"] == "Account"
    assert "avatarUrl" in response["data"]["removeAccountAvatar"]
    assert "id" in response["data"]["removeAccountAvatar"]


async def test_remove_account_avatar_successful(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_avatar succeeds when account has a custom avatar."""
    avatar_url = "https://example.com/avatar.jpg"
    await account_repo.update(account=password_account, avatar_url=avatar_url)

    response = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert response["data"]["removeAccountAvatar"]["__typename"] == "Account"
    assert "id" in response["data"]["removeAccountAvatar"]
    assert response["data"]["removeAccountAvatar"]["avatarUrl"] != avatar_url


async def test_remove_account_avatar_updates_account(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_avatar actually removes the custom avatar from account."""
    avatar_url = "https://example.com/avatar.jpg"
    await account_repo.update(account=password_account, avatar_url=avatar_url)
    await password_account.sync()
    assert password_account.internal_avatar_url == avatar_url

    response = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert response["data"]["removeAccountAvatar"]["__typename"] == "Account"

    await password_account.sync()
    assert password_account.internal_avatar_url is None


async def test_remove_account_avatar_returns_default_avatar(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_avatar returns a default avatar URL."""
    avatar_url = "https://example.com/avatar.jpg"
    await account_repo.update(account=password_account, avatar_url=avatar_url)

    response = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert response["data"]["removeAccountAvatar"]["__typename"] == "Account"
    avatar_url_parsed = urlparse(response["data"]["removeAccountAvatar"]["avatarUrl"])
    assert avatar_url_parsed.hostname is not None and (
        avatar_url_parsed.hostname == "dicebear.com" or
        avatar_url_parsed.hostname.endswith(".dicebear.com")
    )


async def test_remove_account_avatar_idempotent(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that calling remove_account_avatar twice succeeds both times."""
    avatar_url = "https://example.com/avatar.jpg"
    await account_repo.update(account=password_account, avatar_url=avatar_url)

    response1 = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)
    assert response1["data"]["removeAccountAvatar"]["__typename"] == "Account"

    response2 = await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)
    assert response2["data"]["removeAccountAvatar"]["__typename"] == "Account"


async def test_remove_account_avatar_webauthn_account(
    webauthn_auth_graphql_client: GraphQLClient,
    webauthn_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that remove_account_avatar works for webauthn-only accounts."""
    avatar_url = "https://example.com/avatar.jpg"
    await account_repo.update(account=webauthn_account, avatar_url=avatar_url)

    response = await webauthn_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    assert response["data"]["removeAccountAvatar"]["__typename"] == "Account"

    await webauthn_account.sync()
    assert webauthn_account.internal_avatar_url is None


async def test_remove_account_avatar_does_not_affect_other_accounts(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    account_repo: AccountRepo,
) -> None:
    """Ensure that removing avatar from one account doesn't affect other accounts."""
    foreign_avatar_url = "https://example.com/foreign-avatar.jpg"
    await account_repo.update(
        account=foreign_password_account, avatar_url=foreign_avatar_url
    )
    await foreign_password_account.sync()
    original_foreign_avatar = foreign_password_account.internal_avatar_url

    await password_auth_graphql_client(REMOVE_ACCOUNT_AVATAR_MUTATION)

    await foreign_password_account.sync()
    assert foreign_password_account.internal_avatar_url == original_foreign_avatar
