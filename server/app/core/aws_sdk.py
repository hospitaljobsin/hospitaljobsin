from collections.abc import AsyncGenerator

import aioboto3
from types_aiobotocore_s3 import S3Client


def get_aioboto3_session() -> aioboto3.Session:
    """Get an aioboto3 session."""
    return aioboto3.Session()


async def get_s3_client(session: aioboto3.Session) -> AsyncGenerator[S3Client, None]:
    """Get an S3 client."""
    async with session.client("s3") as s3_client:
        yield s3_client
