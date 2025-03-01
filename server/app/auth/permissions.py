import typing
from datetime import UTC, datetime

from strawberry.permission import BasePermission

from app.context import Info


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"
    error_extensions = {"code": "UNAUTHENTICATED"}

    # This method can also be async!
    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        return info.context.get("current_user") is not None


class IsInSudoMode(BasePermission):
    message = "Action requires sudo mode"
    error_extensions = {"code": "REQUIRES_SUDO_MODE"}

    # This method can also be async!
    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        sudo_mode_expires_at = info.context["request"].session.get(
            "sudo_mode_expires_at"
        )
        return (
            sudo_mode_expires_at is not None
            and datetime.now(UTC) < sudo_mode_expires_at
        )
