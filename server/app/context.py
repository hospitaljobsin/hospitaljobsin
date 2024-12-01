from typing import TypedDict

from fastapi import Request
from strawberry.types import Info as StrawberryInfo

from app.dataloaders import Dataloaders


class Context(TypedDict):
    request: Request
    loaders: Dataloaders


Info = StrawberryInfo[Context, None]
