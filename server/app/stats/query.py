import strawberry
from aioinject import Injected
from aioinject.ext.strawberry import inject

from app.stats.services import StatsService

from .types import (
    StatsType,
)


@strawberry.type
class StatsQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=StatsType,
        description="Get core site statistics.",
    )
    @inject
    async def stats(self, stats_service: Injected[StatsService]) -> StatsType:
        stats = await stats_service.get()
        return StatsType.marshal(stats)
