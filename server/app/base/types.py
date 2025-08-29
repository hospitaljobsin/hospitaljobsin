from typing import Generic, Self, TypeVar, get_args, get_origin

import strawberry
from beanie import Document
from strawberry import field, relay

from app.base.models import Address
from app.database.paginator import CursorType, PaginatedResult

ModelType = TypeVar("ModelType", bound=Document)


@strawberry.type
class BaseNodeType(Generic[ModelType], relay.Node):
    id: relay.NodeID[str]

    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into a node instance."""
        raise NotImplementedError


NodeType = TypeVar("NodeType", bound=BaseNodeType)


@strawberry.type
class BaseEdgeType(Generic[NodeType, ModelType], relay.Edge[NodeType]):
    @classmethod
    def marshal(cls, model: ModelType) -> Self:
        """Marshal into an edge instance."""
        raise NotImplementedError


EdgeType = TypeVar("EdgeType", bound=BaseEdgeType)


@strawberry.type(name="Connection")
class BaseConnectionType(Generic[NodeType, EdgeType]):
    page_info: relay.PageInfo = field(
        description="Information to aid in pagination.",
    )

    edges: list[EdgeType] = field(
        description="A list of edges.",
    )

    total_count: int | None = field(
        description="The total number of items in the connection.",
    )

    @classmethod
    def _extract_generic_arg(cls, index: int, error_message: str) -> type:
        """Simpler helper to extract a generic argument from BaseConnectionType."""
        for base in getattr(cls, "__orig_bases__", []):
            if (
                (args := get_args(base))
                and get_origin(base) is BaseConnectionType
                and len(args) > index
                and isinstance(args[index], type)
            ):
                return args[index]
        raise RuntimeError(error_message)

    @classmethod
    def get_node_type(cls) -> type[NodeType]:
        """Extract the NodeType from the generic bases."""
        return cls._extract_generic_arg(0, f"NodeType not found for {cls.__name__}")

    @classmethod
    def get_edge_type(cls) -> type[EdgeType]:
        """Extract the EdgeType from the generic bases."""
        return cls._extract_generic_arg(1, f"EdgeType not found for {cls.__name__}")

    @classmethod
    def marshal(cls, paginated_result: PaginatedResult[ModelType, CursorType]) -> Self:
        return cls(
            page_info=relay.PageInfo(
                has_next_page=paginated_result.page_info.has_next_page,
                has_previous_page=paginated_result.page_info.has_previous_page,
                start_cursor=relay.to_base64(
                    cls.get_node_type(),
                    paginated_result.page_info.start_cursor,
                )
                if paginated_result.page_info.start_cursor
                else None,
                end_cursor=relay.to_base64(
                    cls.get_node_type(),
                    paginated_result.page_info.end_cursor,
                )
                if paginated_result.page_info.end_cursor
                else None,
            ),
            edges=[
                cls.get_edge_type().marshal(entity)
                for entity in paginated_result.entities
            ],
            total_count=paginated_result.page_info.total_count,
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
    street_address: str | None = field(
        description="Street address.",
    )
    address_locality: str | None = field(
        description="Address locality.",
    )
    address_region: str | None = field(
        description="Address region.",
    )
    country: str | None = field(
        description="Country.",
    )
    postal_code: str | None = field(
        description="Postal code.",
    )

    @classmethod
    def marshal(cls, address: Address) -> Self:
        """Marshal into a node instance."""
        return cls(
            street_address=address.street_address,
            address_locality=address.address_locality,
            address_region=address.address_region,
            postal_code=address.postal_code,
            country=address.country,
        )


@strawberry.input(name="AddressInput")
class AddressInputType:
    street_address: str | None = field(
        description="Address line 2.",
    )
    address_locality: str | None = field(
        description="City.",
    )
    address_region: str | None = field(
        description="Address region.",
    )
    country: str | None = field(
        description="Country.",
    )
    postal_code: str | None = field(
        description="Postal code.",
    )

    def to_document(self) -> Address:
        """Marshal into a document instance."""
        return Address(
            street_address=self.street_address,
            address_locality=self.address_locality,
            address_region=self.address_region,
            country=self.country,
            postal_code=self.postal_code,
        )


@strawberry.type(
    name="CreatePresignedURLPayloadType",
    description="The payload for creating a presigned URL.",
)
class CreatePresignedURLPayloadType:
    presigned_url: str = strawberry.field(
        description="The presigned URL.",
    )
