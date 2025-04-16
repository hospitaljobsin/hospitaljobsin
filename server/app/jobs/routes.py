from http import HTTPStatus

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel

from app.jobs.services import JobService

jobs_router = APIRouter()


class LogJobViewResult(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"


@jobs_router.post(
    "/organizations/{organization_slug}/jobs/{job_slug}/log_view",
    status_code=HTTPStatus.ACCEPTED,
)
@inject
async def log_job_view(
    organization_slug: str,
    job_slug: str,
    background_tasks: BackgroundTasks,
    job_service: Injected[JobService],
) -> LogJobViewResult:
    """Log a job view."""
    background_tasks.add_task(
        job_service.log_view,
        slug=job_slug,
        organization_slug=organization_slug,
    )
    return LogJobViewResult(status="OK")
