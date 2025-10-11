from http import HTTPStatus

from httpx import AsyncClient


async def test_health_check(http_client: AsyncClient) -> None:
    response = await http_client.get("/health/")
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"status": "OK"}
