from http import HTTPStatus
from typing import Annotated
from uuid import UUID

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from app.accounts.documents import Account
from app.auth.dependencies import get_current_user_or_none
from app.jobs.services import JobService

jobs_router = APIRouter()


class LogJobViewResult(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"


class LogJobViewInput(BaseModel):
    impression_id: UUID


@jobs_router.post(
    "/organizations/{organization_slug}/jobs/{job_slug}/log_view_start",
    status_code=HTTPStatus.ACCEPTED,
)
@inject
async def log_job_view_start(
    data: LogJobViewInput,
    organization_slug: str,
    job_slug: str,
    request: Request,
    job_service: Injected[JobService],
    current_user: Annotated[
        Account | None,
        Depends(
            dependency=get_current_user_or_none,
        ),
    ],
) -> LogJobViewResult:
    """Log a job view start."""
    await job_service.log_view_start(
        slug=job_slug,
        organization_slug=organization_slug,
        request=request,
        impression_id=data.impression_id,
        account_id=current_user.id if current_user else None,
    )
    return LogJobViewResult(status="OK")


@jobs_router.post(
    "/organizations/{organization_slug}/jobs/{job_slug}/log_view_end",
    status_code=HTTPStatus.ACCEPTED,
)
@inject
async def log_job_view_end(
    data: LogJobViewInput,
    organization_slug: str,
    job_slug: str,
    request: Request,
    job_service: Injected[JobService],
    current_user: Annotated[
        Account | None,
        Depends(
            dependency=get_current_user_or_none,
        ),
    ],
) -> LogJobViewResult:
    """Log a job view end."""
    await job_service.log_view_end(
        slug=job_slug,
        organization_slug=organization_slug,
        request=request,
        impression_id=data.impression_id,
        account_id=current_user.id if current_user else None,
    )
    return LogJobViewResult(status="OK")
