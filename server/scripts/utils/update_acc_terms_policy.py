import asyncio

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.accounts.documents import Account
from app.accounts.documents import TermsAndPolicy
from datetime import datetime
from datetime import UTC

from app.core.constants import TERMS_AND_POLICY_LATEST_VERSION


async def update_acc_terms_policy():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )
    accounts = await Account.find_all(fetch_links=True, nesting_depth=2).to_list()
    print(accounts)
    for account in accounts:
        print(account.terms_and_policy)
        if (
            account.terms_and_policy is not None
            and account.terms_and_policy.version == TERMS_AND_POLICY_LATEST_VERSION
        ):
            continue
        account.terms_and_policy = TermsAndPolicy(
            type="undecided",
            updated_at=datetime.now(UTC),
            version=TERMS_AND_POLICY_LATEST_VERSION,
        )
        await account.save()


if __name__ == "__main__":
    asyncio.run(update_acc_terms_policy())
