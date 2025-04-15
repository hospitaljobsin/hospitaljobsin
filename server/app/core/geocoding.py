from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.base import Geocoder
from geopy.geocoders.nominatim import Nominatim

from app.config import Settings


@asynccontextmanager
async def create_geocoder(settings: Settings) -> AsyncGenerator[Geocoder, None]:
    """Create a geocoder instance."""
    async with Nominatim(
        domain=settings.geocoder_domain,
        user_agent=settings.geocoder_user_agent,
        scheme=settings.geocoder_scheme,
        adapter_factory=AioHTTPAdapter,
    ) as geocoder:
        yield geocoder
