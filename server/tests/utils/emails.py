import time


def generate_test_email() -> str:
    """Generate a unique test email address."""
    return f"test-{int(time.time() * 1000)}-{id(generate_test_email)}@outlook.com"
