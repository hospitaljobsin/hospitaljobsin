from typing import ClassVar, Generic, Self, TypeVar

import strawberry
from beanie import Document
from strawberry import relay

from app.base.models import Address
from app.database.paginator import PaginatedResult

ModelType = TypeVar("ModelType")


@strawberry.type
class BaseNodeType(Generic[ModelType], relay.Node):
    id: relay.NodeID[str]

    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into a node instance."""
        raise NotImplementedError


NodeType = TypeVar("NodeType", bound=BaseNodeType[Document])


@strawberry.type
class BaseEdgeType(Generic[NodeType, ModelType], relay.Edge[NodeType]):
    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into an edge instance."""
        pass


EdgeType = TypeVar("EdgeType", bound=BaseEdgeType[NodeType, ModelType])


class BaseConnectionType(Generic[NodeType, EdgeType], relay.Connection[NodeType]):
    node_type: ClassVar[NodeType]

    edge_type: ClassVar[EdgeType]

    @classmethod
    def from_paginated_result(
        cls, paginated_result: PaginatedResult[ModelType, str]
    ) -> Self:
        return cls(
            page_info=relay.PageInfo(
                has_next_page=paginated_result.page_info.has_next_page,
                has_previous_page=paginated_result.page_info.has_previous_page,
                start_cursor=relay.to_base64(
                    cls.node_type,
                    paginated_result.page_info.start_cursor,
                )
                if paginated_result.page_info.start_cursor
                else None,
                end_cursor=relay.to_base64(
                    cls.node_type,
                    paginated_result.page_info.end_cursor,
                )
                if paginated_result.page_info.end_cursor
                else None,
            ),
            edges=[
                cls.edge_type.marshal(entity) for entity in paginated_result.entities
            ],
        )


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
    city: str | None
    state: str | None
    country: str | None
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


@strawberry.input(name="AddressInput")
class AddressInputType:
    line1: str | None
    line2: str | None
    city: str | None
    state: str | None
    country: str | None
    pincode: str | None

    def to_document(self) -> Address:
        """Marshal into a document instance."""
        return Address(
            line1=self.line1,
            line2=self.line2,
            city=self.city,
            state=self.state,
            country=self.country,
            pincode=self.pincode,
        )
