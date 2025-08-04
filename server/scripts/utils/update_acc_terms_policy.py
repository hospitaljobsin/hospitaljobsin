import asyncio

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.accounts.documents import Account, AnalyticsPreference
from app.accounts.documents import TermsAndPolicy
from datetime import datetime
from datetime import UTC

from app.core.constants import TERMS_AND_POLICY_LATEST_VERSION
from app.organizations.documents import Organization


async def update_acc_terms_policy():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )
    accounts = await Account.find_all(fetch_links=True, nesting_depth=2).to_list()
    print(len(accounts))
    for account in accounts:
        print(account.analytics_preference)
        if account.analytics_preference is not None:
            continue
        account.analytics = None
        account.analytics_preference = AnalyticsPreference(
            type="undecided",
            updated_at=datetime.now(UTC),
        )
        await account.save()


if __name__ == "__main__":
    asyncio.run(update_acc_terms_policy())
