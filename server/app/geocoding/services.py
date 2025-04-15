from http import HTTPStatus

import httpx

from app.config import Settings
from app.geocoding.models import SearchLocation


class GeocodingService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def get_locations(self, search_term: str, limit: int) -> list[SearchLocation]:
        """Get relevant search locations for the given search term."""
        async with httpx.AsyncClient() as client:
            url = f"{self._settings.geocoder_scheme}://{self._settings.geocoder_domain}/search?q={search_term}&format=json&addressdetails=1&limit={limit}"
            response = await client.get(url)
            if response.status_code == HTTPStatus.OK:
                data = response.json()
                return [
                    SearchLocation(
                        latitude=float(item.get("lat")),
                        longitude=float(item.get("lon")),
                        display_name=item.get("display_name"),
                        place_id=item.get("place_id"),
                    )
                    for item in data
                ]
            return []
