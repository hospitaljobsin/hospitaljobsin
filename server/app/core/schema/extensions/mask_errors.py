from collections.abc import Callable, Iterator
from typing import Any

import sentry_sdk
from graphql.error import GraphQLError
from graphql.execution.execute import ExecutionResult as GraphQLExecutionResult
from strawberry.extensions.base_extension import SchemaExtension
from strawberry.types.execution import ExecutionResult as StrawberryExecutionResult


def default_should_mask_error(_: GraphQLError) -> bool:
    # Mask all errors
    return True


class MaskErrors(SchemaExtension):
    should_mask_error: Callable[[GraphQLError], bool]
    error_message: str

    def __init__(
        self,
        should_mask_error: Callable[[GraphQLError], bool] = default_should_mask_error,
        error_message: str = "Unexpected error.",
    ) -> None:
        self.should_mask_error = should_mask_error
        self.error_message = error_message

    def anonymise_error(self, error: GraphQLError) -> GraphQLError:
        # Log the original error to Sentry before masking
        sentry_sdk.capture_exception(
            error,
            extra={
                "graphql_message": error.message,
                "graphql_path": error.path,
                "graphql_positions": error.positions,
                "graphql_locations": getattr(error, "locations", None),
            },
        )
        return GraphQLError(
            message=self.error_message,
            nodes=error.nodes,
            source=error.source,
            positions=error.positions,
            path=error.path,
            original_error=None,
        )

    # TODO: proper typing
    def _process_result(self, result: Any) -> None:
        if not result.errors:
            return

        processed_errors: list[GraphQLError] = []

        for error in result.errors:
            if self.should_mask_error(error):
                processed_errors.append(self.anonymise_error(error))
            else:
                processed_errors.append(error)

        result.errors = processed_errors

    def on_operation(self) -> Iterator[None]:
        yield

        result = self.execution_context.result

        if isinstance(result, (GraphQLExecutionResult, StrawberryExecutionResult)):
            self._process_result(result)
        elif result:
            self._process_result(result.initial_result)
