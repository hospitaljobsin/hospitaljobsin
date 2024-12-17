from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Result

from app.companies.documents import Job
from app.companies.exceptions import JobNotFoundError
from app.companies.repositories import JobRepo


class JobService:
    def __init__(self, job_repo: JobRepo) -> None:
        self._job_repo = job_repo

    async def save_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[Job, JobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        job = await self._job_repo.get(job_id=job_id)
        if job is None:
            return Err(JobNotFoundError())
        await self._job_repo.save_job(
            account_id=account_id,
            job=job,
        )

        return job
