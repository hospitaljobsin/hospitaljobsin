from http import HTTPStatus

from fastapi import APIRouter

from app.testing.schemas import CreateTestUserSchema, TestUserSchema

test_setup_router = APIRouter(prefix="/test-setup", tags=["test-setup"])


@test_setup_router.post(
    "/create-user",
    description="Create a test user",
    status_code=HTTPStatus.CREATED,
)
async def create_test_user(data: CreateTestUserSchema) -> TestUserSchema:
    raise NotImplementedError
