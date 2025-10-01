import httpx

from app.config import EnvironmentSettings, RevalidateSettings


class BaseRevalidationService:
    async def revalidate_tag(self, tag: str) -> None:
        """Revalidate frontend data cache with the given tag."""
        raise NotImplementedError


class RevalidationService(BaseRevalidationService):
    def __init__(
        self,
        revalidate_settings: RevalidateSettings,
        env_settings: EnvironmentSettings,
    ) -> None:
        self._revalidate_settings = revalidate_settings
        self._env_settings = env_settings

    async def revalidate_tag(self, tag: str) -> None:
        """Revalidate frontend data cache with the given tag."""
        async with httpx.AsyncClient(verify=self._env_settings.is_production) as client:
            response = await client.post(
                self._revalidate_settings.revalidate_base_url,
                json={
                    "secret": self._revalidate_settings.revalidate_secret.get_secret_value(),
                    "tag": tag,
                },
            )

        response.raise_for_status()


class DummyRevalidationService(BaseRevalidationService):
    async def revalidate_tag(self, tag: str) -> None:
        """Dummy revalidation service that does nothing."""
