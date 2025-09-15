from bson import ObjectId

from app.accounts.documents import Account
from app.core.constants import JobAlertFrequency
from app.database.paginator import PaginatedResult, Paginator
from app.job_alerts.documents import JobAlert
from app.job_alerts.models import AlertFilters


class JobAlertRepo:
    async def create(
        self,
        account: Account,
        filters: AlertFilters,
        frequency: JobAlertFrequency,
    ) -> JobAlert:
        """Create a new job alert."""
        job_alert = JobAlert(
            account=account.id,
            filters=filters,
            frequency=frequency,
        )
        await job_alert.insert()
        return job_alert

    async def delete(self, job_alert: JobAlert) -> None:
        """Delete a job alert."""
        await job_alert.delete()

    async def delete_all(self, account: Account) -> None:
        """Delete all job alerts for an account."""
        await JobAlert.find(JobAlert.account.id == account.id).delete_many()

    async def get_all_list(self, account_id: ObjectId) -> list[JobAlert]:
        """Get all job alerts for an account."""
        return await JobAlert.find(JobAlert.account.id == account_id).to_list()

    async def get_all(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobAlert, ObjectId]:
        """Get a paginated result of all job alerts for an account."""
        paginator: Paginator[JobAlert, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobAlert,
            paginate_by="id",
        )

        return await paginator.paginate(
            search_criteria=JobAlert.find(JobAlert.account.id == account_id),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def check_exists(
        self,
        account_id: ObjectId,
        filters: AlertFilters,
        frequency: JobAlertFrequency,
    ) -> bool:
        """Check if a job alert with the same filters and frequency already exists for the account."""
        existing_alert = await JobAlert.find_one(
            (JobAlert.account.id == account_id)
            & (JobAlert.filters == filters)
            & (JobAlert.frequency == frequency)
        )
        return existing_alert is not None
