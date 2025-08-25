import re
import unicodedata
from datetime import UTC, datetime

import bleach
from bs4 import BeautifulSoup
from markdown import markdown


def format_datetime(value: datetime) -> str:
    """Format a datetime object as an ISO 8601 string (with the military timezone)."""
    return value.strftime("%Y-%m-%dT%H:%M:%SZ")


def ensure_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)  # assume naive means UTC
    return dt.astimezone(UTC)


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


def markdown_to_clean_html(md_text: str) -> str:
    # Convert Markdown → raw HTML
    raw_html = markdown(md_text, extensions=["extra", "sane_lists"])
    # Whitelist safe tags and attributes
    allowed_tags = [
        "a",
        "abbr",
        "acronym",
        "b",
        "blockquote",
        "code",
        "em",
        "i",
        "li",
        "ol",
        "strong",
        "ul",
        "p",
        "pre",
        "br",
        "hr",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
    ]
    allowed_attrs = {"a": ["href", "title"], "img": ["src", "alt", "title"]}

    # Clean HTML to remove scripts, styles, etc.
    return bleach.clean(
        raw_html, tags=allowed_tags, attributes=allowed_attrs, strip=True
    )
