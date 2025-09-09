import time
import uuid


def generate_test_email() -> str:
    """Generate a unique test email address."""
    return f"test-{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}@outlook.com"
