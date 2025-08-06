import asyncio
from datetime import UTC, datetime

from app.accounts.documents import Account, AnalyticsPreference, TermsAndPolicy
from app.config import DatabaseSettings, get_settings
from app.core.constants import TERMS_AND_POLICY_LATEST_VERSION
from app.database import initialize_database


async def update_acc_terms_policy():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )
    accounts = await Account.find_all(fetch_links=True, nesting_depth=2).to_list()
    print(len(accounts))
    for account in accounts:
        print(account.terms_and_policy)
        account.terms_and_policy = TermsAndPolicy(
            type="acceptance",
            updated_at=datetime.now(UTC),
            version=TERMS_AND_POLICY_LATEST_VERSION,
        )
        account.analytics_preference = AnalyticsPreference(
            type="undecided",
            updated_at=datetime.now(UTC),
        )
        await account.save()


if __name__ == "__main__":
    asyncio.run(update_acc_terms_policy())
