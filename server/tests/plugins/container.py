import pytest
from aioinject import Container
from app.container import create_container


@pytest.fixture(scope="session")
def container() -> Container:
    """Create a dependency injection container for tests."""
    return create_container()
