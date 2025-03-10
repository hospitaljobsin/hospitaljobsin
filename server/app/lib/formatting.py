from datetime import datetime


def format_datetime(value: datetime) -> str:
    """Format a datetime object as an ISO 8601 string (with the military timezone)."""
    return value.strftime("%Y-%m-%dT%H:%M:%SZ")
