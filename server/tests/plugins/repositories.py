import pytest
from aioinject import Container
from app.accounts.repositories import AccountRepo


@pytest.fixture(scope="session")
async def account_repo(container: Container) -> AccountRepo:
    async with container.context() as ctx:
        return await ctx.resolve(AccountRepo)
