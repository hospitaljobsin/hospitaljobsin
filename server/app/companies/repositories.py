import asyncio
from datetime import date
from re import search

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In
from bson import ObjectId

from app.accounts.documents import Account
from app.database.paginator import PaginatedResult, Paginator

from .documents import Company, Job, SavedJob


class CompanyRepo:
    async def create(
        self,
        name: str,
        description: str,
        address: str,
        city: str,
        postcode: int,
        country: str,
        phone: int,
        website: str,
        email: str,
    ) -> Company:
        """Create a new company."""
        company = Company(
            name=name,
            description=description,
            address=address,
            city=city,
            postcode=postcode,
            country=country,
            phone=phone,
            website=website,
            email=email,
        )

        return await company.insert()

    async def get(self, company_id: ObjectId) -> Company | None:
        """Get company by ID."""
        return await Company.get(company_id)

    async def update(
        self,
        company: Company,
        *,
        name: str,
        description: str,
        address: str,
        city: str,
        postcode: int,
        country: str,
        phone: str,
        website: str,
        email: str,
    ) -> Company:
        """Update the given company."""
        company.name = name
        company.description = description
        company.address = address
        company.city = city
        company.postcode = postcode
        company.country = country
        company.phone = phone
        company.website = website
        company.email = email
        return await company.save()

    async def get_many_by_ids(
        self, company_ids: list[ObjectId]
    ) -> list[Company | None]:
        """Get multiple companies by IDs."""
        companies = await Company.find(In(Company.id, company_ids)).to_list()
        company_by_id = {company.id: company for company in companies}

        return [
            company_by_id.get(PydanticObjectId(company_id))
            for company_id in company_ids
        ]

    async def get_all(
        self,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Company, ObjectId]:
        """Get a paginated result of companies."""

        paginator: Paginator[Company, ObjectId] = Paginator(
            reverse=True,
            document_cls=Company,
            paginate_by="id",
        )

        return await paginator.paginate(
            search_criteria=Company.find(),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, company: Company) -> None:
        """Delete a company by ID."""
        await company.delete()


class JobRepo:
    async def create(
        self,
        title: str,
        description: str,
        location: str,
        salary: str,
        closing_date: date,
        company: Company,
    ) -> Job:
        """Create a new job."""
        job = Job(
            title=title,
            description=description,
            location=location,
            salary=salary,
            closing_date=closing_date,
            company=company,
        )

        return await job.insert(
            link_rule=WriteRules.DO_NOTHING,
        )

    async def get(self, job_id: ObjectId) -> Job | None:
        """Get job by ID."""
        return await Job.get(job_id)

    async def update(
        self,
        job: Job,
        *,
        title: str,
        description: str,
        location: str,
        salary: str,
        closing_date: date,
    ) -> Job:
        """Update the given job."""
        job.title = title
        job.description = description
        job.location = location
        job.salary = salary
        job.closing_date = closing_date
        return await job.save()

    async def get_many_by_ids(self, job_ids: list[ObjectId]) -> list[Job | None]:
        """Get multiple jobs by IDs."""
        jobs = await Job.find(In(Job.id, job_ids)).to_list()
        job_by_id = {job.id: job for job in jobs}

        return [job_by_id.get(PydanticObjectId(job_id)) for job_id in job_ids]

    async def get_all(
        self,
        search_term: str | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of jobs."""

        paginator: Paginator[Job, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = Job.find()

        if search_term:
            search_criteria = Job.find({"$text": {"$search": search_term}})

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_saved(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[SavedJob, ObjectId]:
        """Get a paginated result of saved jobs for the given account."""

        paginator: Paginator[SavedJob, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = SavedJob.find(
            SavedJob.account.id == account_id,
            fetch_links=True,
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def save_job(self, account: Account, job: Job) -> SavedJob:
        """Save the given job under the given account."""
        # return await SavedJob.find_one(
        #     SavedJob.account.id == account.id, SavedJob.job.id == job.id
        # ).upsert(
        #     Set({Product.price: 3.33}),
        #     on_insert=SavedJob(
        #         account=account,
        #         job=job,
        #     ),
        # )

    async def get_all_by_company_id(
        self,
        company_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of jobs."""

        paginator: Paginator[Job, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = Job.find(Job.company.id == company_id)

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, job: Job) -> None:
        """Delete a job by ID."""
        await job.delete()
