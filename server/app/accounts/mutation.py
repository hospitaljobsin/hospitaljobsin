from typing import Annotated

import strawberry
from aioinject.ext.strawberry import inject

from app.context import Info

from .types import (
    RegisterPayload,
)


@strawberry.type
class AccountMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RegisterPayload,
        description="Save a job.",
    )
    @inject
    async def save_job(
        self,
        info: Info,
        job_id: Annotated[
            str,
            strawberry.argument(
                description="The ID of the job to save.",
            ),
        ],
    ) -> RegisterPayload:
        """Save a job."""
        pass
