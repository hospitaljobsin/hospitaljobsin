from http import HTTPStatus
from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter

from app.testing.schemas import CreateTestUserSchema, TestUserSchema
from app.testing.services import TestSetupService

test_setup_router = APIRouter(prefix="/test-setup", tags=["test-setup"])


@test_setup_router.post(
    "/create-user",
    description="Create an account for E2E testing",
    status_code=HTTPStatus.CREATED,
)
@inject
async def create_test_account(
    data: CreateTestUserSchema,
    test_setup_service: Annotated[TestSetupService, Injected],
) -> TestUserSchema:
    """Create an account for E2E testing."""
    return await test_setup_service.create_account(data)
