import asyncio
import time

from app.container import create_container
from google import genai


async def main() -> None:
    async with create_container() as container:
        # async with container.context() as ctx:
        #     await ctx.resolve(AuthService)

        async with container.context() as ctx:
            t = time.perf_counter()
            await ctx.resolve(genai.Client)
            print(time.perf_counter() - t)


asyncio.run(main())
