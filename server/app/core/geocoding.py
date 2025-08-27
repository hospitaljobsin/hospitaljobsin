from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from http import HTTPStatus

import httpx
from geopy.adapters import AioHTTPAdapter
from geopy.geocoders.nominatim import Nominatim
from nanoid import generate
from types_aiobotocore_geo_places.client import LocationServicePlacesV2Client

from app.config import GeocoderSettings
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
    ) -> GeocodeResult | None:
        """Geocode a query."""
        location = await self._geocoder.geocode(query)
        if location:
            return GeocodeResult(
                display_name=location.display_name,
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
                        coordinates=GeocodeResult(
                            display_name=item.get("display_name"),
                            latitude=item.get("lat"),
                            longitude=item.get("lon"),
                        ),
                    )
                    for item in data
                ]
            return []


class AWSLocationService(BaseLocationService):
    def __init__(self, location_client: LocationServicePlacesV2Client) -> None:
        self._location_client = location_client

    async def geocode(
        self,
        query: str,
    ) -> GeocodeResult | None:
        """Geocode a query using AWS LocationServicePlacesV2Client."""
        # The operation is search_place_index_for_text for geocoding
        response = await self._location_client.geocode(
            QueryText=query,
            MaxResults=1,
            IntendedUse="Storage",
        )
        results = response.get("ResultItems", [])
        if results:
            position = results[0].get("Position")
            address = results[0].get("Address")
            if position and address:
                # Build street address from components
                street_address_parts = []
                address_number = address.get("AddressNumber")
                street = address.get("Street")

                if address_number:
                    street_address_parts.append(address_number)
                if street:
                    street_address_parts.append(street)

                street_address = (
                    " ".join(street_address_parts) if street_address_parts else None
                )

                return GeocodeResult(
                    display_name=results[0].get("Title"),
                    latitude=position[1],
                    longitude=position[0],
                    postal_code=address.get("PostalCode"),
                    address_region=address.get("Region", {}).get("Name")
                    if address.get("Region")
                    else None,
                    address_locality=address.get("Locality"),
                    street_address=street_address,
                    country=address.get("Country", {}).get("Code2")
                    if address.get("Country")
                    else None,
                )
        return None

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get relevant search locations for the given search term using AWS LocationServiceClient."""
        # Use suggest to get place suggestions without expensive geocoding
        response = await self._location_client.suggest(
            QueryText=search_term,
            MaxResults=limit,
            IntendedUse="SingleUse",
            BiasPosition=[
                0.0,
                0.0,
            ],  # Default bias position to satisfy validation requirement
            AdditionalFeatures=["Core"],
        )
        results = response.get("ResultItems", [])

        search_locations = []
        for item in results:
            if (
                item.get("Place") is not None
                and item["Place"].get("Address") is not None
                and item["Place"].get("Position") is not None
                and item["Place"]["Address"].get("Label") is not None
            ):
                # TODO: filter through item["Place"]["PlaceType"]
                search_locations.append(
                    SearchLocation(
                        place_id=str(item.get("PlaceId", generate(size=10))),
                        display_name=item["Title"],
                        coordinates=GeocodeResult(
                            latitude=item["Place"]["Position"][1],
                            longitude=item["Place"]["Position"][0],
                            postal_code=item["Place"]["Address"].get("PostalCode"),
                            address_region=item["Place"]["Address"]
                            .get("Region", {})
                            .get("Name")
                            if item["Place"]["Address"].get("Region")
                            else None,
                            address_locality=(
                                item["Place"]["Address"].get("Locality")
                                or item["Place"]["Address"]
                                .get("SubRegion", {})
                                .get("Name")
                                if item["Place"]["Address"].get("SubRegion")
                                else None
                            ),
                            street_address=(
                                f"{item['Place']['Address'].get('AddressNumber', '')} {item['Place']['Address'].get('Street', '')}".strip()
                                if item["Place"]["Address"].get("AddressNumber")
                                or item["Place"]["Address"].get("Street")
                                else None
                            ),
                            country=item["Place"]["Address"]
                            .get("Country", {})
                            .get("Code2")
                            if item["Place"]["Address"].get("Country")
                            else None,
                        ),
                    )
                )

        return search_locations
