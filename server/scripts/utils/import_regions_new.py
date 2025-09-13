import asyncio
from pathlib import Path

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database

EXPORT_DIR = Path(__file__).parent.parent.parent / "notebooks" / "export"


async def main() -> None:
    """Run the main import process."""
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    # TODO: get continents from EXPORT_DIR/continents.json and import them to DB

    # TODO: get countries from EXPORT_DIR/countries.json and import them to DB

    # TODO: get states from EXPORT_DIR/states.json and import them to DB

    # TODO: get localities from EXPORT_DIR/localities/*.json and import them to DB


if __name__ == "__main__":
    asyncio.run(main())
