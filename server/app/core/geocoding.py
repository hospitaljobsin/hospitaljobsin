from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from http import HTTPStatus

import httpx
from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.nominatim import Nominatim
from types_aiobotocore_location import LocationServiceClient

from app.config import Settings
from app.geocoding.models import GeocodeResult, SearchLocation


class BaseLocationService:
    """Base geocoder class."""

    async def geocode(self, query: str) -> GeocodeResult | None:
        """Geocode a query."""
        raise NotImplementedError

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get locations for a query."""
        raise NotImplementedError


@asynccontextmanager
async def create_nominatim_geocoder(
    settings: Settings,
) -> AsyncGenerator[Nominatim, None]:
    """Create a geocoder instance."""
    async with Nominatim(
        domain=settings.geocoder_domain,
        user_agent=settings.geocoder_user_agent,
        scheme=settings.geocoder_scheme,
        adapter_factory=AioHTTPAdapter,
    ) as geocoder:
        yield geocoder


class NominatimLocationService(BaseLocationService):
    def __init__(self, geocoder: Nominatim, settings: Settings) -> None:
        self._geocoder = geocoder
        self._settings = settings

    async def geocode(
        self,
        query: str,
    ) -> GeocodeResult | None:
        """Geocode a query."""
        location = await self._geocoder.geocode(query)
        if location:
            return GeocodeResult(
                latitude=location.latitude,
                longitude=location.longitude,
            )
        return None

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get relevant search locations for the given search term."""
        async with httpx.AsyncClient() as client:
            url = f"{self._settings.geocoder_scheme}://{self._settings.geocoder_domain}/search?q={search_term}&format=json&limit={limit}"
            response = await client.get(url)
            if response.status_code == HTTPStatus.OK:
                data = response.json()
                return [
                    SearchLocation(
                        latitude=float(item.get("lat")),
                        longitude=float(item.get("lon")),
                        display_name=item.get("display_name"),
                    )
                    for item in data
                ]
            return []


class AWSLocationService(BaseLocationService):
    def __init__(self, location_client: LocationServiceClient) -> None:
        self._location_client = location_client

    async def geocode(
        self,
        query: str,
    ) -> GeocodeResult | None:
        """Geocode a query using AWS LocationServiceClient."""
        # The operation is search_place_index_for_text for geocoding
        response = await self._location_client.search_place_index_for_text(
            IndexName="YourPlaceIndexName",  # Replace with your AWS Place Index name
            Text=query,
            MaxResults=1,
        )
        results = response.get("Results", [])
        if results:
            point = results[0]["Place"]["Geometry"]["Point"]
            return GeocodeResult(
                latitude=point[1],
                longitude=point[0],
            )
        return None

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get relevant search locations for the given search term using AWS LocationServiceClient."""
        response = await self._location_client.search_place_index_for_text(
            IndexName="YourPlaceIndexName",  # Replace with your AWS Place Index name
            Text=search_term,
            MaxResults=limit,
        )
        results = response.get("Results", [])
        locations = []
        for item in results:
            place = item.get("Place", {})
            geometry = place.get("Geometry", {})
            point = geometry.get("Point", None)
            if point and place.get("Label") is not None:
                locations.append(
                    SearchLocation(
                        latitude=point[1],
                        longitude=point[0],
                        display_name=place.get("Label"),
                    )
                )
        return locations
