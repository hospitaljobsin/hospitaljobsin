from typing import Generic, Self, TypeVar

import strawberry
from beanie import Document
from strawberry import relay

ModelType = TypeVar("ModelType")


@strawberry.type
class BaseNodeType(Generic[ModelType], relay.Node):
    id: relay.NodeID[str]

    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into a node instance."""
        raise NotImplementedError


@strawberry.interface(name="Error")
class BaseErrorType:
    message: str


@strawberry.type(name="NotAuthenticatedError")
class NotAuthenticatedErrorType(BaseErrorType):
    message: str = "Not authenticated."


NodeType = TypeVar("NodeType", bound=BaseNodeType[Document])
