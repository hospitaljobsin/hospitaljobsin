from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo


@pytest.fixture(scope="session")
async def password_account(account_repo: AccountRepo) -> AsyncGenerator[Account]:
    # TODO: dynamically create email here.
    # and also use the dynamic email instead of aryan@outlook.com in the pytest parameterized tests
    account = await account_repo.create(
        full_name="Aryan Iyappan",
        email="aryan@outlook.com",
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    yield account
    await account_repo.delete(account)
