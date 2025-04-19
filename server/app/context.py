from typing import TypedDict

from fastapi import Request, Response
from strawberry.types import Info as StrawberryInfo

from app.accounts.documents import Account
from app.auth.documents import Session
from app.dataloaders import Dataloaders


class BaseContext(TypedDict):
    request: Request
    response: Response
    loaders: Dataloaders
    user_agent: str


class Context(BaseContext):
    current_user: Account | None
    session: Session | None


Info = StrawberryInfo[Context, None]


class AuthContext(BaseContext):
    current_user: Account
    session: Session
    session_token: str


AuthInfo = StrawberryInfo[AuthContext, None]
