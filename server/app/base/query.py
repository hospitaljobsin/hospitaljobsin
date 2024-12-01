import strawberry
from strawberry import relay


@strawberry.type
class BaseQuery:
    node: relay.Node | None = relay.node()
