from typing import AsyncIterator

from aioboto3 import Session
from types_aiobotocore_cognito_idp import CognitoIdentityProviderClient


async def get_session() -> Session:
    return Session()


async def get_cognito_idp_client(
    session: Session,
) -> AsyncIterator[CognitoIdentityProviderClient]:
    async with session.client("cognito-idp") as client:
        yield client
