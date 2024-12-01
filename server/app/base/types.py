from typing import Generic, Self, TypeVar

import strawberry
from beanie import Document
from strawberry import relay

ModelType = TypeVar("ModelType", bound=Document)


@strawberry.type
class BaseNodeType(Generic[ModelType], relay.Node):
    id: relay.NodeID[int]

    @classmethod
    def from_orm(cls, model: ModelType) -> Self:
        """Construct a node from an ORM instance."""
        raise NotImplementedError


@strawberry.interface(name="Error")
class BaseErrorType:
    message: str


NodeType = TypeVar("NodeType", bound=BaseNodeType[Document])
