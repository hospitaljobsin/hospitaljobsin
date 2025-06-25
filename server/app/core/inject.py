import functools

import aioinject
import sentry_sdk
from aioinject import Context
from aioinject.ext.strawberry import inject as strawberry_inject


def context_getter(
    context: Context,
) -> aioinject.Context | aioinject.SyncContext:
    with sentry_sdk.start_span(op="context_getter"):
        return context.context


inject = functools.partial(strawberry_inject, context_getter=context_getter)
