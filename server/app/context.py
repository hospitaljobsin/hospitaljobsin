from typing import TypedDict

from bson import ObjectId
from fastapi import Request
from strawberry.types import Info as StrawberryInfo

from app.dataloaders import Dataloaders


class Context(TypedDict):
    request: Request
    loaders: Dataloaders
    current_user_id: ObjectId | None


Info = StrawberryInfo[Context, None]
