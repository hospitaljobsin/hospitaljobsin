from result import Err, Ok, Result

from app.accounts.documents import Account
from app.core.constants import JobAlertFrequency
from app.job_alerts.documents import JobAlert
from app.job_alerts.exceptions import JobAlertAlreadyExistsError
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo


class JobAlertService:
    def __init__(self, job_alert_repo: JobAlertRepo) -> None:
        self._job_alert_repo = job_alert_repo

    async def create(
        self,
        account: Account,
        filters: AlertFilters,
        frequency: JobAlertFrequency,
    ) -> Result[JobAlert, JobAlertAlreadyExistsError]:
        """Create a new job alert."""
        if await self._job_alert_repo.check_exists(
            account_id=account.id,
            filters=filters,
            frequency=frequency,
        ):
            return Err(JobAlertAlreadyExistsError())
        job_alert = await self._job_alert_repo.create(
            account=account,
            frequency=frequency,
            filters=filters,
        )
        return Ok(job_alert)
