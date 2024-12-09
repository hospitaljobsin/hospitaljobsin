from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay

from app.context import Info

from .services import AuthService
from .types import (
    AuthType,
    CreateAuthPayload,
)


@strawberry.type
class AuthMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateAuthPayload,
        description="Register a new user.",
    )
    @inject
    async def register(
        self,
        info: Info,
        username: Annotated[
            str,
            strawberry.argument(
                description="The username of the new user.",
            ),
        ],
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the new user.",
            ),
        ],
        password: Annotated[
            str,
            strawberry.argument(
                description="The password of the new user.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> CreateAuthPayload:
        """Create a new question."""
        result = await auth_service.create(
            title=title,
            description=description,
            user_id=info.context["user"].id,
        )

        question = result.unwrap()

        return CreateAuthPayload(
            question_edge=relay.Edge(
                node=AuthType.from_orm(question),
                cursor=relay.to_base64(AuthType, question.id),
            ),
        )
