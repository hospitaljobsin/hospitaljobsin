from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.core.constants import (
    MAX_JOB_ALERTS_PER_ACCOUNT,
    JobAlertFrequency,
)
from app.job_alerts.documents import JobAlert, RecommendedJobAlert
from app.job_alerts.exceptions import (
    JobAlertAlreadyExistsError,
    JobAlertNotFoundError,
    MaxJobAlertsReachedError,
    RecommendedJobAlertsNotFoundError,
)
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo, RecommendedJobAlertRepo


class JobAlertService:
    def __init__(
        self,
        job_alert_repo: JobAlertRepo,
        recommended_job_alert_repo: RecommendedJobAlertRepo,
    ) -> None:
        self._job_alert_repo = job_alert_repo
        self._recommended_job_alert_repo = recommended_job_alert_repo

    async def create(
        self,
        account: Account,
        filters: AlertFilters,
        frequency: JobAlertFrequency,
    ) -> Result[JobAlert, JobAlertAlreadyExistsError | MaxJobAlertsReachedError]:
        """Create a new job alert."""
        if await self._job_alert_repo.check_exists(
            account_id=account.id,
            filters=filters,
            frequency=frequency,
        ):
            return Err(JobAlertAlreadyExistsError())
        if (
            await self._job_alert_repo.get_all_count(account.id)
            >= MAX_JOB_ALERTS_PER_ACCOUNT
        ):
            return Err(MaxJobAlertsReachedError())
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
        if not job_alert or job_alert.account.ref.id != account.id:
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
        if not job_alert or job_alert.account.ref.id != account.id:
            return Err(JobAlertNotFoundError())
        await self._job_alert_repo.delete(job_alert)
        return Ok(job_alert)

    async def enable_recommended_alerts(
        self,
        account: Account,
        frequency: JobAlertFrequency,
    ) -> Result[
        tuple[list[JobAlert], list[RecommendedJobAlert]],
        RecommendedJobAlertsNotFoundError,
    ]:
        recommended_job_alerts = await self._recommended_job_alert_repo.get_all_list(
            account=account
        )
        if len(recommended_job_alerts) < 1:
            # cannot enable recommended job alerts if we have no recommendations
            return Err(RecommendedJobAlertsNotFoundError())

        job_alerts = await self._job_alert_repo.create_many(
            account=account,
            job_alert_filters=[r.filters for r in recommended_job_alerts],
            frequency=frequency,
        )

        await self._recommended_job_alert_repo.delete_all(account)

        return Ok((job_alerts, recommended_job_alerts))

    async def remove_recommended_alerts(
        self, account: Account
    ) -> Result[Account, RecommendedJobAlertsNotFoundError]:
        recommended_job_alerts = await self._recommended_job_alert_repo.get_all_list(
            account=account
        )
        if len(recommended_job_alerts) < 1:
            # cannot remove recommended job alerts if we have no recommendations
            return Err(RecommendedJobAlertsNotFoundError())

        await self._recommended_job_alert_repo.delete_all(account)

        return Ok(account)
