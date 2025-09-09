from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo

from tests.utils.emails import generate_test_email


@pytest.fixture(scope="session")
async def password_account(account_repo: AccountRepo) -> AsyncGenerator[Account]:
    account = await account_repo.create(
        full_name="Aryan Iyappan",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    yield account
    await account_repo.delete(account)
