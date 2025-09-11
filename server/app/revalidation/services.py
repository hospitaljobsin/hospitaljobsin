import httpx

from app.config import RevalidateSettings


class RevalidationService:
    def __init__(self, revalidate_settings: RevalidateSettings) -> None:
        self._revalidate_settings = revalidate_settings

    async def revalidate_tag(self, tag: str) -> None:
        """Revalidate frontend data cache with the given tag."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self._revalidate_settings.revalidate_base_url,
                json={
                    "secret": self._revalidate_settings.revalidate_secret.get_secret_value(),
                    "tag": tag,
                },
            )

        response.raise_for_status()
