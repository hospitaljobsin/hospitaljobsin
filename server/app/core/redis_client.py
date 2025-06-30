from redis.asyncio import Redis

from app.config import RedisSettings


def create_redis_client(settings: RedisSettings) -> Redis:
    return Redis.from_url(settings.redis_url)
