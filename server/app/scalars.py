from datetime import datetime

import strawberry

from app.core.formatting import format_datetime

DateTime = strawberry.scalar(
    datetime,
    name="DateTime",
    description="DateTime scalar represents an ISO 8601-encoded date and time string.",
    serialize=format_datetime,
    parse_value=lambda value: datetime.fromisoformat(value),
)
