import uuid
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from http import HTTPStatus

import httpx
from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.nominatim import Nominatim
from types_aiobotocore_location import LocationServiceClient

from app.config import Settings
from app.geocoding.models import Coordinates, SearchLocation


def generate_place_id(text: str) -> str:
    """Generate a place ID from the text."""
    return text.replace(" ", "_").replace(",", "").lower() + uuid.uuid4().hex


class BaseLocationService:
    """Base geocoder class."""

    async def geocode(self, query: str) -> Coordinates | None:
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
    ) -> Coordinates | None:
        """Geocode a query."""
        location = await self._geocoder.geocode(query)
        if location:
            return Coordinates(
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
                        place_id=str(
                            item.get(
                                "place_id", generate_place_id(item["display_name"])
                            )
                        ),
                        display_name=item.get("display_name"),
                        coordinates=Coordinates(
                            latitude=item.get("lat"),
                            longitude=item.get("lon"),
                        ),
                    )
                    for item in data
                ]
            return []


# TODO: ensure we use the singleuse places index only for suggestions and autocomplete (0.50$ per 1k requests)
# we need to use a storage (intended use) places index for geocoding and storing the coordinates (4.0$ per 1k requests)
# as a result, we need to update the job search to directly enter coordinates as arguments- no search term and then geocoding it again- which is expensive
class AWSLocationService(BaseLocationService):
    def __init__(
        self, location_client: LocationServiceClient, settings: Settings
    ) -> None:
        self._location_client = location_client
        self._settings = settings

    async def geocode(
        self,
        query: str,
    ) -> Coordinates | None:
        """Geocode a query using AWS LocationServiceClient."""
        # The operation is search_place_index_for_text for geocoding
        response = await self._location_client.search_place_index_for_text(
            IndexName=self._settings.storage_location_place_index_name,
            Text=query,
            MaxResults=1,
        )
        results = response.get("Results", [])
        if results:
            point = results[0]["Place"]["Geometry"]["Point"]
            return Coordinates(
                latitude=point[1],
                longitude=point[0],
            )
        return None

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get relevant search locations for the given search term using AWS LocationServiceClient."""
        response = await self._location_client.search_place_index_for_text(
            IndexName=self._settings.single_use_location_place_index_name,
            Text=search_term,
            MaxResults=limit,
        )
        results = response.get("Results", [])
        return [
            SearchLocation(
                place_id=str(item.get("PlaceId", generate_place_id(item["Text"]))),
                display_name=item["Text"],
                coordinates=Coordinates(
                    latitude=item["Place"]["Geometry"]["Point"][1],
                    longitude=item["Place"]["Geometry"]["Point"][0],
                ),
            )
            for item in results
            if item["Place"]["Geometry"].get("Point") is not None
        ]
