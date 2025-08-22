from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from http import HTTPStatus

import httpx
from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.nominatim import Nominatim
from nanoid import generate
from types_aiobotocore_location import LocationServiceClient

from app.config import GeocoderSettings
from app.geocoding.models import Coordinates, SearchLocation


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
    settings: GeocoderSettings,
) -> AsyncGenerator[Nominatim]:
    """Create a geocoder instance."""
    async with Nominatim(
        domain=settings.geocoder_domain,
        user_agent=settings.geocoder_user_agent,
        scheme=settings.geocoder_scheme,
        adapter_factory=AioHTTPAdapter,
    ) as geocoder:
        yield geocoder


class NominatimLocationService(BaseLocationService):
    def __init__(self, geocoder: Nominatim, settings: GeocoderSettings) -> None:
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
                        place_id=str(item.get("place_id", generate(size=10))),
                        display_name=item.get("display_name"),
                        coordinates=Coordinates(
                            latitude=item.get("lat"),
                            longitude=item.get("lon"),
                        ),
                    )
                    for item in data
                ]
            return []


class AWSLocationService(BaseLocationService):
    def __init__(
        self, location_client: LocationServiceClient, settings: GeocoderSettings
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
            point = results[0]["Place"]["Geometry"].get("Point")
            if point:
                return Coordinates(
                    latitude=point[1],
                    longitude=point[0],
                )
        return None

    def get_readable_name(self, place: dict) -> str:
        """Get a readable name for a place."""
        # Pick the most specific fields available
        neighborhood = place.get("Neighborhood")
        municipality = place.get("Municipality")
        region = place.get("Region")

        if neighborhood and municipality:
            return f"{neighborhood}, {municipality}"
        if municipality and region:
            return f"{municipality}, {region}"
        if municipality:
            return municipality
        return place.get("Label", "")

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
                place_id=str(item.get("PlaceId", generate(size=10))),
                display_name=self.get_readable_name(item["Place"]),
                coordinates=Coordinates(
                    latitude=item["Place"]["Geometry"]["Point"][1],
                    longitude=item["Place"]["Geometry"]["Point"][0],
                ),
            )
            for item in results
            if item["Place"]["Geometry"].get("Point") is not None
            and item["Place"].get("Label") is not None
        ]
