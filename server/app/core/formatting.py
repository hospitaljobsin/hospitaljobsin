import re
import unicodedata
from datetime import datetime

from bs4 import BeautifulSoup
from markdown import markdown


def format_datetime(value: datetime) -> str:
    """Format a datetime object as an ISO 8601 string (with the military timezone)."""
    return value.strftime("%Y-%m-%dT%H:%M:%SZ")


def slugify(text: str) -> str:
    """Normalize and slugify text to be URL-safe."""
    # Normalize unicode characters to ASCII
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    # Replace non-alphanumeric characters with hyphens
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text)
    # Remove leading/trailing hyphens and convert to lowercase
    return text.strip("-").lower()


def clean_markdown_text(text: str) -> str:
    """Clean markdown text by removing HTML tags and other unwanted characters."""
    html = markdown(text)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()
