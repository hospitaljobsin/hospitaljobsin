from typing import Generic, Self, TypeVar

import strawberry
from beanie import Document
from strawberry import relay

from app.base.models import Address

ModelType = TypeVar("ModelType")


@strawberry.type
class BaseNodeType(Generic[ModelType], relay.Node):
    id: relay.NodeID[str]

    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into a node instance."""
        raise NotImplementedError


NodeType = TypeVar("NodeType", bound=BaseNodeType[Document])


@strawberry.interface(name="Error")
class BaseErrorType:
    message: str


@strawberry.type(name="NotAuthenticatedError")
class NotAuthenticatedErrorType(BaseErrorType):
    message: str = "Not authenticated."


@strawberry.type(name="Address")
class AddressType:
    line1: str | None
    line2: str | None
    city: str
    state: str
    country: str
    pincode: str | None

    @classmethod
    def marshal(cls, address: Address) -> Self:
        """Marshal into a node instance."""
        return cls(
            line1=address.line1,
            line2=address.line2,
            city=address.city,
            state=address.state,
            country=address.country,
            pincode=address.pincode,
        )
