import asyncio
import time

import aioboto3
from app.container import create_container


async def main() -> None:
    async with create_container() as container:
        # async with container.context() as ctx:
        #     await ctx.resolve(AuthService)

        async with container.context() as ctx:
            t = time.perf_counter()
            await ctx.resolve(aioboto3.Session)
            print(time.perf_counter() - t)


asyncio.run(main())
