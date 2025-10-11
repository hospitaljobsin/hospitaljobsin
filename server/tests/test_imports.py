from collections.abc import Sequence

import pytest
from pytest_archon import archrule


@pytest.mark.parametrize(
    ("modules", "libraries"),
    [
        (
            ["app.core"],
            ["fastapi", "strawberry", "pymongo", "starlette", "granian"],
        ),
    ],
)
def test_banned_libraries(modules: str | list[str], libraries: Sequence[str]) -> None:
    if isinstance(modules, str):
        modules = [modules]

    for module in modules:
        (
            archrule(f"{module}-banned-libs")
            .match(f"{module}.*")
            .should_not_import(*libraries)
            .check(module)
        )


def test_mutations_and_queries_depend_on_services_or_repositories() -> None:
    (
        archrule("mutations_queries_layer")
        .match("app.*.mutation", "app.*.query")
        .may_import(
            "app.*.services",
            "app.*.repositories",
            "app.*.types",
            "app.*.exceptions",
            "app.*.documents",
            "app.*.models",
            "app.*.permissions",
            "app.*.dataloaders",
            "app.base.*",
            "app.context",
            "app.auth.permissions",
        )
        .may_import("strawberry.*", "aioinject.*", "result", "typing", "datetime")
        .check("app")
    )


def test_services_depend_on_repositories() -> None:
    (
        archrule("services_layer")
        .match("app.*.services")
        .should_not_import("app.*.mutation", "app.*.query")
        .check("app")
    )


def test_repositories_dont_import_services() -> None:
    (
        archrule("repositories_layer")
        .match("app.*.repositories")
        .should_not_import("app.*.services", "app.*.mutation", "app.*.query")
        .check("app")
    )
