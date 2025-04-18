import contextlib
from collections.abc import AsyncGenerator

import aioboto3
from types_aiobotocore_s3 import S3Client
from types_aiobotocore_ses import SESClient

from app.config import Settings


def create_aioboto3_session() -> aioboto3.Session:
    """Create an aioboto3 session."""
    return aioboto3.Session()


@contextlib.asynccontextmanager
async def create_s3_client(
    session: aioboto3.Session, settings: Settings
) -> AsyncGenerator[S3Client, None]:
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
) -> AsyncGenerator[SESClient, None]:
    """Create an S3 client."""
    async with session.client("ses") as ses_client:
        yield ses_client
