from redis.asyncio import Redis

from app.config import RedisSettings


def create_redis_client(settings: RedisSettings) -> Redis:
    return Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        username=settings.redis_username,
        password=settings.redis_password.get_secret_value()
        if settings.redis_password
        else None,
        decode_responses=True,
    )
