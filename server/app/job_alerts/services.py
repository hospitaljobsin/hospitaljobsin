from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.core.constants import JobAlertFrequency
from app.job_alerts.documents import JobAlert
from app.job_alerts.exceptions import JobAlertAlreadyExistsError, JobAlertNotFoundError
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

    async def update(
        self,
        account: Account,
        job_alert_id: str,
        filters: AlertFilters,
        frequency: JobAlertFrequency,
    ) -> Result[JobAlert, JobAlertAlreadyExistsError | JobAlertNotFoundError]:
        """Update an existing job alert."""
        try:
            job_alert_id = ObjectId(job_alert_id)
        except InvalidId:
            return Err(JobAlertNotFoundError())
        job_alert = await self._job_alert_repo.get_by_id(job_alert_id)
        if not job_alert or job_alert.account.id != account.id:
            return Err(JobAlertNotFoundError())
        if await self._job_alert_repo.check_exists(
            account_id=account.id,
            filters=filters,
            frequency=frequency,
        ):
            return Err(JobAlertAlreadyExistsError())
        job_alert.filters = filters
        job_alert.frequency = frequency
        await job_alert.save()
        return Ok(job_alert)

    async def delete(
        self, account: Account, job_alert_id: str
    ) -> Result[JobAlert, JobAlertNotFoundError]:
        """Delete a job alert."""
        try:
            job_alert_id = ObjectId(job_alert_id)
        except InvalidId:
            return Err(JobAlertNotFoundError())
        job_alert = await self._job_alert_repo.get_by_id(job_alert_id)
        if not job_alert or job_alert.account.id != account.id:
            return Err(JobAlertNotFoundError())
        await self._job_alert_repo.delete(job_alert)
        return Ok(job_alert)
