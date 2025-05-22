from http import HTTPStatus
from typing import Annotated

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter, Header, Request

from app.testing.schemas import CreateTestUserSchema, TestUserSchema
from app.testing.services import TestSetupService

test_setup_router = APIRouter(prefix="/test-setup", tags=["test-setup"])


@test_setup_router.post(
    "/create-account",
    description="Create an account for E2E testing.",
    status_code=HTTPStatus.CREATED,
)
@inject
async def create_test_account(
    data: CreateTestUserSchema,
    request: Request,
    test_setup_service: Injected[TestSetupService],
    user_agent: Annotated[str | None, Header()] = "unknown",
) -> TestUserSchema:
    """Create an account for E2E testing."""
    return await test_setup_service.create_account(
        data, request=request, user_agent=user_agent
    )
