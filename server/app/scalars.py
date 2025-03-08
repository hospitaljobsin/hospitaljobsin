from datetime import datetime

import strawberry
from strawberry.relay import GlobalID

# temporary hack until strawberry fixes relay ID scalar generation
# https://github.com/strawberry-graphql/strawberry/issues/3551
ID = strawberry.scalar(
    strawberry.ID,
    serialize=str,
    parse_value=GlobalID.from_id,
)

DateTime = strawberry.scalar(
    datetime,
    serialize=lambda value: value.strftime("%Y-%m-%dT%H:%M:%SZ"),
    parse_value=lambda value: datetime.fromisoformat(value),
)
