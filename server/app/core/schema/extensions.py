import json
from collections.abc import AsyncIterator

# Add import for loading persisted queries
from pathlib import Path

from fastapi import Request
from graphql import (
    ExecutionResult,
    GraphQLError,
)
from strawberry.extensions import SchemaExtension


class PersistedQueriesExtension(SchemaExtension):
    def __init__(self, *, persisted_queries_path: Path) -> None:
        self.cache: dict[str, str] = {}

        with Path.open(persisted_queries_path, "r") as f:
            self.cache = json.load(f)

    async def on_operation(self) -> AsyncIterator[None]:
        request: Request = self.execution_context.context.get("request")
        document_id = request.query_params.get("document_id")
        if document_id is None:
            body = await request.json()
            document_id = body.get("document_id")
        persisted_query = self.cache.get(document_id)
        print("document_id", document_id)
        print(f"persisted_query: {persisted_query}")
        if persisted_query is None:
            self.execution_context.result = ExecutionResult(
                data=None,
                errors=[
                    GraphQLError("Invalid query provided."),
                ],
            )
        else:
            self.execution_context.query = persisted_query
        yield None
