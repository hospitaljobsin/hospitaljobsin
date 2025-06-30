from redis.asyncio import Redis

from app.config import RedisSettings, SecretSettings


def create_redis_client(
    settings: RedisSettings, secret_settings: SecretSettings
) -> Redis:
    return Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        username=settings.redis_username,
        password=secret_settings.redis_password.get_secret_value()
        if secret_settings.redis_password
        else None,
        decode_responses=True,
    )
