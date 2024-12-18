from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.companies.documents import Job
from app.companies.exceptions import JobNotFoundError
from app.companies.repositories import JobRepo, SavedJobRepo


class SavedJobService:
    def __init__(self, saved_job_repo: SavedJobRepo, job_repo: JobRepo) -> None:
        self._saved_job_repo = saved_job_repo
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
        result = await self._saved_job_repo.save_job(
            account_id=account_id,
            job=job,
        )

        return Ok(result)

    async def unsave_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[Job, JobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        job = await self._job_repo.get(job_id=job_id)
        if job is None:
            return Err(JobNotFoundError())
        result = await self._saved_job_repo.unsave_job(
            account_id=account_id,
            job=job,
        )

        return Ok(result)
