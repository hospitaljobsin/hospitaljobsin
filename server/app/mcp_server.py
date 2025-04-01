from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from mcp.server import Server
from mcp.server.fastmcp import FastMCP

from app.config import Settings
from app.database import initialize_database

# need to create a prompt template
# need to perform only a single tool call
# need to return results


@asynccontextmanager
async def server_lifespan(_server: Server) -> AsyncGenerator[None, None]:
    """Initialize the database when the server starts."""
    settings = Settings()  # type: ignore[call-arg]
    async with initialize_database(database_url=str(settings.database_url)):
        yield


# Create an MCP server
mcp = FastMCP("Demo", lifespan=server_lifespan)


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting."""
    return f"Hello, {name}!"
