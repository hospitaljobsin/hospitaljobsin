from collections.abc import AsyncGenerator

from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.base import Geocoder
from geopy.geocoders.nominatim import Nominatim

from app.config import Settings


async def create_geocoder(settings: Settings) -> AsyncGenerator[Geocoder]:
    """Create a geocoder instance."""
    async with Nominatim(
        domain=settings.geocoder_domain,
        user_agent=settings.geocoder_user_agent,
        scheme="http",
        adapter_factory=AioHTTPAdapter,
    ) as geocoder:
        yield geocoder
