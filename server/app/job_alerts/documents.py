from beanie import (
    Document,
    Link,
)

from app.accounts.documents import Account
from app.core.constants import JobAlertFrequency
from app.job_alerts.models import AlertFilters


class JobAlert(Document):
    filters: AlertFilters
    frequency: JobAlertFrequency
    account: Link[Account]

    class Settings:
        name = "job_alerts"
