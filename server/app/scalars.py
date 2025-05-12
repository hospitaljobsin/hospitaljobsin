from datetime import datetime

import strawberry

from app.core.formatting import format_datetime

DateTime = strawberry.scalar(
    datetime,
    serialize=format_datetime,
    parse_value=lambda value: datetime.fromisoformat(value),
)
