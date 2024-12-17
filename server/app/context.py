from typing import TypedDict

from bson import ObjectId
from fastapi import Request, Response
from strawberry.types import Info as StrawberryInfo

from app.dataloaders import Dataloaders


class BaseContext(TypedDict):
    request: Request
    response: Response
    loaders: Dataloaders
    user_agent: str


class Context(BaseContext):
    current_user_id: ObjectId | None


Info = StrawberryInfo[Context, None]


class AuthContext(BaseContext):
    current_user_id: ObjectId


AuthInfo = StrawberryInfo[AuthContext, None]
