import contextlib
from collections.abc import AsyncGenerator

import aioboto3
from types_aiobotocore_location import LocationServiceClient
from types_aiobotocore_s3 import S3Client
from types_aiobotocore_ses import SESClient
from types_aiobotocore_sqs import SQSClient
from types_aiobotocore_textract.client import TextractClient

from app.config import AWSSettings


def create_aioboto3_session() -> aioboto3.Session:
    """Create an aioboto3 session."""
    return aioboto3.Session()


@contextlib.asynccontextmanager
async def create_s3_client(
    session: aioboto3.Session, settings: AWSSettings
) -> AsyncGenerator[S3Client]:
    """Create an S3 client."""
    async with session.client(
        "s3",
        endpoint_url=settings.aws_endpoint_url,
        aws_secret_access_key=settings.aws_secret_access_key.get_secret_value()
        if settings.aws_secret_access_key
        else None,
        aws_access_key_id=settings.aws_access_key_id,
    ) as s3_client:
        yield s3_client


@contextlib.asynccontextmanager
async def create_ses_client(
    session: aioboto3.Session,
) -> AsyncGenerator[SESClient]:
    """Create an SES client."""
    async with session.client("ses") as ses_client:
        yield ses_client


@contextlib.asynccontextmanager
async def create_location_service_client(
    session: aioboto3.Session,
) -> AsyncGenerator[LocationServiceClient]:
    """Create a location service client."""
    async with session.client("location") as location_client:
        yield location_client


@contextlib.asynccontextmanager
async def create_sqs_client(
    session: aioboto3.Session,
) -> AsyncGenerator[SQSClient]:
    """Create an SQS client."""
    async with session.client("sqs") as sqs_client:
        yield sqs_client


@contextlib.asynccontextmanager
async def create_textract_client(
    session: aioboto3.Session,
) -> AsyncGenerator[TextractClient]:
    """Create an Textract client."""
    async with session.client("textract") as textract_client:
        yield textract_client
