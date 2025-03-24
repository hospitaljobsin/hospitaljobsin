from datetime import UTC, datetime
from typing import Any

from strawberry.permission import BasePermission

from app.context import Info


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"
    error_extensions = {"code": "UNAUTHENTICATED"}  # noqa: RUF012

    # This method can also be async!
    def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:  # noqa:  ANN401, ARG002
        return info.context.get("current_user") is not None


class RequiresSudoMode(BasePermission):
    message = "Action requires sudo mode"
    error_extensions = {"code": "REQUIRES_SUDO_MODE"}  # noqa: RUF012

    # This method can also be async!
    def has_permission(self, source: Any, info: Info, **kwargs: Any) -> bool:  # noqa:  ANN401, ARG002
        sudo_mode_expires_at = info.context["request"].session.get(
            "sudo_mode_expires_at"
        )
        return sudo_mode_expires_at is not None and datetime.now(
            UTC
        ) < datetime.fromisoformat(sudo_mode_expires_at)
