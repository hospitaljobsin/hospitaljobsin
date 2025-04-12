from http import HTTPStatus

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel

from app.jobs.services import JobService

jobs_router = APIRouter(prefix="/jobs")


class LogJobViewResult(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"


@jobs_router.post(
    "/{slug}/view",
    status_code=HTTPStatus.ACCEPTED,
)
@inject
async def log_job_view(
    slug: str,
    background_tasks: BackgroundTasks,
    job_service: Injected[JobService],
) -> LogJobViewResult:
    """Log a job view."""
    background_tasks.add_task(job_service.log_view, slug=slug)
    return LogJobViewResult(status="OK")
