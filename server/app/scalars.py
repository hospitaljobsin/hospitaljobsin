from datetime import datetime

import strawberry
from strawberry.relay import GlobalID

from app.lib.formatting import format_datetime

# temporary hack until strawberry fixes relay ID scalar generation
# https://github.com/strawberry-graphql/strawberry/issues/3551
ID = strawberry.scalar(
    strawberry.ID,
    serialize=str,
    parse_value=GlobalID.from_id,
)

DateTime = strawberry.scalar(
    datetime,
    serialize=format_datetime,
    parse_value=lambda value: datetime.fromisoformat(value),
)
