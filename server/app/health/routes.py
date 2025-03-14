from http import HTTPStatus

from fastapi import APIRouter

from app.health.schemas import HealthCheck

health_router = APIRouter(prefix="/health")


@health_router.get(
    "/",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    status_code=HTTPStatus.OK,
    response_model=HealthCheck,
)
def get_health() -> HealthCheck:
    """Perform a health check."""
    return HealthCheck(status="OK")
