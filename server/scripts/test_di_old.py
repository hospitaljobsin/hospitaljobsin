import asyncio
import time

from app.container import create_container
from app.dataloaders import Dataloaders


async def main() -> None:
    async with create_container() as container:
        # async with container.context() as ctx:
        #     await ctx.resolve(genai.Client)

        async with container.context() as ctx:
            t = time.perf_counter()
            await ctx.resolve(Dataloaders)
            print(time.perf_counter() - t)


asyncio.run(main())
