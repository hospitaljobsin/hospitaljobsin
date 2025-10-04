from datetime import datetime

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
    last_sent_at: datetime | None = None

    class Settings:
        name = "job_alerts"


class RecommendedJobAlert(Document):
    filters: AlertFilters
    account: Link[Account]

    class Settings:
        name = "recommended_job_alerts"
