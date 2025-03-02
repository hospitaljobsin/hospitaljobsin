from datetime import UTC, datetime
from typing import Any, ClassVar

from strawberry.permission import BasePermission

from app.context import Info


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"
    error_extensions: ClassVar[dict[str, str]] = {"code": "UNAUTHENTICATED"}

    # This method can also be async!
    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:  # noqa: ANN003, ANN401, ARG002
        return info.context.get("current_user") is not None


class RequiresSudoMode(BasePermission):
    message = "Action requires sudo mode"
    error_extensions: ClassVar[dict[str, str]] = {"code": "REQUIRES_SUDO_MODE"}

    # This method can also be async!
    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:  # noqa: ANN003, ANN401, ARG002
        sudo_mode_expires_at = info.context["request"].session.get(
            "sudo_mode_expires_at"
        )
        return sudo_mode_expires_at is not None and datetime.now(
            UTC
        ) < datetime.fromisoformat(sudo_mode_expires_at)
