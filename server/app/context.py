from typing import TypedDict

from bson import ObjectId
from fastapi import Request, Response
from strawberry.types import Info as StrawberryInfo

from app.dataloaders import Dataloaders


class Context(TypedDict):
    request: Request
    response: Response
    loaders: Dataloaders
    current_user_id: ObjectId | None


Info = StrawberryInfo[Context, None]
