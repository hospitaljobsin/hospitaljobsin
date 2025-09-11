import uuid


def generate_test_slug() -> str:
    """Generate a unique test slug."""
    return f"test-{uuid.uuid4().hex[:8]}"
