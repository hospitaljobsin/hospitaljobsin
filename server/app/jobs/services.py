from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.jobs.documents import SavedJob
from app.jobs.exceptions import JobNotFoundError, SavedJobNotFoundError
from app.jobs.repositories import JobRepo, SavedJobRepo


class SavedJobService:
    def __init__(self, saved_job_repo: SavedJobRepo, job_repo: JobRepo) -> None:
        self._saved_job_repo = saved_job_repo
        self._job_repo = job_repo

    async def save_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[SavedJob, JobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        job = await self._job_repo.get(job_id=job_id)
        if job is None:
            return Err(JobNotFoundError())
        result = await self._saved_job_repo.create(
            account_id=account_id,
            job=job,
        )

        return Ok(result)

    async def unsave_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[SavedJob, SavedJobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(SavedJobNotFoundError())
        saved_job = await self._saved_job_repo.get(account_id=account_id, job_id=job_id)
        if saved_job is None:
            return Err(SavedJobNotFoundError())
        await self._saved_job_repo.delete(saved_job)

        return Ok(saved_job)
