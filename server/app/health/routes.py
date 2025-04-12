from http import HTTPStatus

from fastapi import APIRouter
from pydantic import BaseModel

health_router = APIRouter(prefix="/health")


class HealthCheckResult(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"


@health_router.get(
    "/",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    status_code=HTTPStatus.OK,
)
def get_health() -> HealthCheckResult:
    """Perform a health check."""
    return HealthCheckResult(status="OK")
