from typing import TypedDict

from bson import ObjectId
from fastapi import BackgroundTasks, Request, Response
from strawberry.types import Info as StrawberryInfo

from app.dataloaders import Dataloaders


class BaseContext(TypedDict):
    request: Request
    response: Response
    background_tasks: BackgroundTasks
    loaders: Dataloaders
    user_agent: str


class Context(BaseContext):
    current_user_id: ObjectId | None


Info = StrawberryInfo[Context, None]


class AuthContext(BaseContext):
    current_user_id: ObjectId
    session_token: str


AuthInfo = StrawberryInfo[AuthContext, None]
