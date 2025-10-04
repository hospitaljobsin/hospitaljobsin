from datetime import UTC, datetime, timedelta

from bson import ObjectId

from app.accounts.documents import Account
from app.core.constants import JobAlertFrequency
from app.database.paginator import PaginatedResult, Paginator
from app.job_alerts.documents import JobAlert, RecommendedJobAlert
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

    async def create_many(
        self,
        account: Account,
        frequency: JobAlertFrequency,
        job_alert_filters: list[AlertFilters],
    ) -> None:
        job_alert_docs = [
            JobAlert(
                account=account.id,
                filters=filters,
                frequency=frequency,
            )
            for filters in job_alert_filters
        ]
        await JobAlert.insert_many(job_alert_docs)

    async def delete(self, job_alert: JobAlert) -> None:
        """Delete a job alert."""
        await job_alert.delete()

    async def delete(self, job_alert: JobAlert) -> None:
        """Delete a job alert."""
        await job_alert.delete()

    async def delete_all(self, account: Account) -> None:
        """Delete all job alerts for an account."""
        await JobAlert.find(JobAlert.account.id == account.id).delete_many()

    async def get_by_id(
        self, job_alert_id: ObjectId, *, fetch_links: bool = False
    ) -> JobAlert | None:
        """Get a job alert by its ID."""
        return await JobAlert.get(job_alert_id, fetch_links=fetch_links)

    async def get_all_by_frequency(
        self,
        frequency: JobAlertFrequency,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobAlert, ObjectId]:
        """Get all job alerts paginated by frequency."""
        paginator: Paginator[JobAlert, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobAlert,
            paginate_by="_id",
            entity_paginate_by="id",
            calculate_total_count=True,
        )

        now = datetime.now(UTC)

        return await paginator.paginate(
            search_criteria=JobAlert.find(
                JobAlert.frequency == frequency,
                {
                    "$or": [
                        # {"last_sent_at": {"$exists": False}},
                        {"last_sent_at": None},
                        {"last_sent_at": {"$lt": now - timedelta(days=1)}},
                    ]
                },
            ),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_count(self, account_id: ObjectId) -> int:
        """Get the count of all job alerts for an account."""
        return await JobAlert.find(JobAlert.account.id == account_id).count()

    async def get_all(
        self,
        account: Account,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobAlert, ObjectId]:
        """Get a paginated result of all job alerts for an account."""
        paginator: Paginator[JobAlert, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobAlert,
            paginate_by="_id",
            entity_paginate_by="id",
            calculate_total_count=True,
        )

        return await paginator.paginate(
            search_criteria=JobAlert.find(JobAlert.account.id == account.id),
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
        # Using Beanie's query syntax with find method
        query = JobAlert.find(
            JobAlert.account.id == account_id,
            JobAlert.filters.location == filters.location,
            JobAlert.filters.job_type == filters.job_type,
            JobAlert.filters.work_mode == filters.work_mode,
            JobAlert.filters.min_experience == filters.min_experience,
            JobAlert.filters.max_experience == filters.max_experience,
            JobAlert.filters.min_salary == filters.min_salary,
            JobAlert.filters.max_salary == filters.max_salary,
            JobAlert.filters.search_term == filters.search_term,
            JobAlert.frequency == frequency,
        )
        existing_alert = await query.first_or_none()
        return existing_alert is not None

    async def update_last_sent_at(self, job_alert: JobAlert) -> None:
        """Update the last_sent_at timestamp for a job alert."""
        job_alert.last_sent_at = datetime.now(UTC)
        await job_alert.save()


class RecommendedJobAlertRepo:
    async def create(
        self,
        account: Account,
        filters: AlertFilters,
    ) -> None:
        recommended_job_alert = RecommendedJobAlert(
            account=account.id,
            filters=filters,
        )
        await recommended_job_alert.insert()

    async def create_many(
        self,
        account: Account,
        filters: list[AlertFilters],
    ) -> None:
        recommended_job_alerts = [
            RecommendedJobAlert(
                account=account.id,
                filters=filters,
            )
            for filters in filters
        ]
        await RecommendedJobAlert.insert_many(recommended_job_alerts)

    async def delete_all(self, account: Account) -> None:
        await RecommendedJobAlert.find(
            RecommendedJobAlert.account.id == account.id
        ).delete_many()

    async def get_all(
        self,
        account: Account,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[RecommendedJobAlert, ObjectId]:
        """Get a paginated result of all recommended job alerts for an account."""
        paginator: Paginator[RecommendedJobAlert, ObjectId] = Paginator(
            reverse=True,
            document_cls=RecommendedJobAlert,
            paginate_by="_id",
            entity_paginate_by="id",
            calculate_total_count=True,
        )

        return await paginator.paginate(
            search_criteria=RecommendedJobAlert.find(
                RecommendedJobAlert.account.id == account.id
            ),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_list(
        self,
        account: Account,
    ) -> list[RecommendedJobAlert]:
        """Get a result of all recommended job alerts for an account."""
        return await RecommendedJobAlert.find(
            RecommendedJobAlert.account.id == account.id
        ).to_list()
