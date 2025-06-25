import asyncio
import time

from app.auth.services import AuthService
from app.container import create_container


async def main() -> None:
    async with create_container() as container:
        async with container.context() as ctx:
            await ctx.resolve(AuthService)

        async with container.context() as ctx:
            t = time.perf_counter()
            await ctx.resolve(AuthService)
            print(time.perf_counter() - t)


asyncio.run(main())
