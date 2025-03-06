from typing import ClassVar, Generic, Self, TypeVar

import strawberry
from beanie import Document
from strawberry import field, relay

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
        raise NotImplementedError


EdgeType = TypeVar("EdgeType", bound=BaseEdgeType[NodeType, ModelType])


@strawberry.type(name="Connection")
class BaseConnectionType(Generic[NodeType, EdgeType]):
    node_type: ClassVar[NodeType]

    edge_type: ClassVar[EdgeType]

    page_info: relay.PageInfo = field(
        description="Information to aid in pagination.",
    )

    edges: list[EdgeType] = field(
        description="A list of edges.",
    )

    @classmethod
    def marshal(cls, paginated_result: PaginatedResult[ModelType, str]) -> Self:
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


@strawberry.interface(name="Error", description="Human readable error.")
class BaseErrorType:
    message: str = field(
        description="Human readable error message.",
    )


@strawberry.type(name="NotAuthenticatedError")
class NotAuthenticatedErrorType(BaseErrorType):
    message: str = field(
        default="Not authenticated.",
        description="Human readable error message.",
    )


@strawberry.type(name="Address")
class AddressType:
    line1: str | None = field(
        description="Address line 1.",
    )
    line2: str | None = field(
        description="Address line 2.",
    )
    city: str | None = field(
        description="City.",
    )
    state: str | None = field(
        description="State.",
    )
    country: str | None = field(
        description="Country.",
    )
    pincode: str | None = field(
        description="Pincode.",
    )

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
    line1: str | None = field(
        description="Address line 1.",
    )
    line2: str | None = field(
        description="Address line 2.",
    )
    city: str | None = field(
        description="City.",
    )
    state: str | None = field(
        description="State.",
    )
    country: str | None = field(
        description="Country.",
    )
    pincode: str | None = field(
        description="Pincode.",
    )

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
