import typing

from strawberry.permission import BasePermission

from app.context import Info


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"
    error_extensions = {"code": "UNAUTHENTICATED"}

    # This method can also be async!
    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        return info.context.get("current_user_id") is not None
