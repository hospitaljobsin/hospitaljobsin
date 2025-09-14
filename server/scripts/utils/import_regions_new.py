import asyncio
import json
from pathlib import Path
from typing import Any, Literal

import aiofiles
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONMultiPolygon, GeoJSONPoint, GeoJSONPolygon
from pydantic_extra_types.country import CountryAlpha2
from shapely import Polygon, get_parts
from shapely.validation import make_valid

EXPORT_DIR = Path(__file__).parent.parent.parent / "notebooks" / "export"
STATE_DIR = Path(__file__).parent.parent / "import_state"
BATCH_SIZE = 100
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds
BACKOFF_MULTIPLIER = 2


class ImportState:
    """Tracks the state of the import process for resumability."""

    def __init__(self, state_file: Path):
        self.state_file = state_file
        self.state = self._load_state()

    def _load_state(self) -> dict[str, Any]:
        """Load existing state or create new one."""
        try:
            if self.state_file.exists():
                with open(self.state_file, encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load state file: {e}")

        return {
            "continents": {"completed": False, "processed_count": 0, "total_count": 0},
            "countries": {"completed": False, "processed_count": 0, "total_count": 0},
            "states": {"completed": False, "processed_count": 0, "total_count": 0},
            "localities": {
                "completed": False,
                "processed_count": 0,
                "total_count": 0,
                "processed_files": [],
            },
        }

    async def save_state(self) -> None:
        """Save current state to file."""
        try:
            # Ensure state directory exists
            self.state_file.parent.mkdir(parents=True, exist_ok=True)

            # Write state atomically
            temp_file = self.state_file.with_suffix(".tmp")
            async with aiofiles.open(temp_file, "w", encoding="utf-8") as f:
                await f.write(json.dumps(self.state, indent=2))

            # Atomic rename
            temp_file.rename(self.state_file)

        except Exception as e:
            print(f"Warning: Could not save state: {e}")

    def is_completed(self, level: str) -> bool:
        """Check if a level is already completed."""
        return self.state.get(level, {}).get("completed", False)

    def get_processed_count(self, level: str) -> int:
        """Get number of processed items for a level."""
        return self.state.get(level, {}).get("processed_count", 0)

    def get_processed_files(self) -> list[str]:
        """Get list of processed locality files."""
        return self.state.get("localities", {}).get("processed_files", [])

    def mark_completed(self, level: str) -> None:
        """Mark a level as completed."""
        if level not in self.state:
            self.state[level] = {}
        self.state[level]["completed"] = True

    def update_progress(
        self, level: str, processed_count: int, total_count: int
    ) -> None:
        """Update progress for a level."""
        if level not in self.state:
            self.state[level] = {}
        self.state[level]["processed_count"] = processed_count
        self.state[level]["total_count"] = total_count

    def add_processed_file(self, filename: str) -> None:
        """Add a processed locality file."""
        if "localities" not in self.state:
            self.state["localities"] = {"processed_files": []}
        if "processed_files" not in self.state["localities"]:
            self.state["localities"]["processed_files"] = []

        if filename not in self.state["localities"]["processed_files"]:
            self.state["localities"]["processed_files"].append(filename)


async def robust_batch_insert(
    regions: list[Region], max_retries: int = MAX_RETRIES
) -> bool:
    """Insert a batch of regions with retry logic and connection error handling."""
    if not regions:
        return True

    retry_count = 0
    delay = RETRY_DELAY

    while retry_count <= max_retries:
        try:
            await Region.insert_many(regions)
            print(f"Successfully inserted batch of {len(regions)} regions")
            return True

        except Exception as e:
            retry_count += 1
            error_msg = str(e).lower()

            # Check if it's a connection-related error
            is_connection_error = any(
                keyword in error_msg
                for keyword in [
                    "connection",
                    "timeout",
                    "network",
                    "unreachable",
                    "reset",
                    "refused",
                ]
            )

            if retry_count <= max_retries and is_connection_error:
                print(
                    f"Connection error on attempt {retry_count}/{max_retries + 1}: {e}"
                )
                print(f"Retrying in {delay} seconds...")
                await asyncio.sleep(delay)
                delay *= BACKOFF_MULTIPLIER

                # Try to reinitialize database connection
                try:
                    await initialize_database(
                        str(get_settings(DatabaseSettings).database_url),
                        get_settings(DatabaseSettings).default_database_name,
                    )
                except Exception as init_error:
                    print(f"Failed to reinitialize database: {init_error}")

                continue

            # If it's not a connection error or we've exhausted retries
            print(f"Error inserting batch (attempt {retry_count}): {e}")

            if retry_count > max_retries:
                print(f"Failed to insert batch after {max_retries} retries")
                return False

            # For non-connection errors, try inserting one by one
            if not is_connection_error:
                print("Attempting individual inserts...")
                success_count = 0
                for i, region in enumerate(regions):
                    try:
                        await region.insert()
                        success_count += 1
                    except Exception as individual_error:
                        print(
                            f"Failed to insert region {region.name} (index {i}): {individual_error}"
                        )

                print(f"Individual inserts: {success_count}/{len(regions)} successful")
                return success_count > 0

    return False


async def load_json_file(file_path: Path) -> list[dict[str, Any]]:
    """Load data from a JSON file."""
    try:
        async with aiofiles.open(file_path, encoding="utf-8") as f:
            content = await f.read()
            data = json.loads(content)
            return data if isinstance(data, list) else [data]
    except FileNotFoundError:
        print(f"Warning: {file_path} not found")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing {file_path}: {e}")
        return []


from shapely.geometry import MultiPolygon, Polygon, mapping, shape


def fix_polygon(polygon: list[list[list[float]]]) -> list[list[list[float]]]:
    """
    Fix a Polygon geometry: clamp values, close rings, and repair topology.
    """
    # Clamp & close rings
    rings = []
    for ring in polygon:
        fixed = []
        for lon, lat in ring:
            fixed_lon = max(-180.0, min(180.0, lon))
            fixed_lat = max(-90.0, min(90.0, lat))
            fixed.append([fixed_lon, fixed_lat])
        if fixed[0] != fixed[-1]:
            fixed.append(fixed[0])
        rings.append(fixed)

    # Build polygon with exterior + interiors
    exterior = rings[0]
    interiors = rings[1:] if len(rings) > 1 else None
    poly = Polygon(exterior, interiors)

    # Repair if invalid
    if not poly.is_valid:
        poly = make_valid(poly)

    # If result is MultiPolygon, take the largest
    if isinstance(poly, MultiPolygon):
        poly = max(poly.geoms, key=lambda g: g.area)

    # Export to GeoJSON-style coords
    fixed_coords = [list(poly.exterior.coords)]
    for interior in poly.interiors:
        fixed_coords.append(list(interior.coords))
    return fixed_coords


def fix_polygon_outer(
    coords: list[list[list[float]]],
) -> list[list[list[list[float]]]]:
    """
    Fix a Polygon geometry using Shapely.
    Returns GeoJSON-style coordinates.
    """
    try:
        # Convert coords → shapely Polygon
        poly = shape({"type": "Polygon", "coordinates": coords})

        # Make geometry valid
        valid = make_valid(poly)

        # Explode multiparts
        parts = list(get_parts(valid))

        if not parts:
            raise ValueError("No valid polygon parts after make_valid")

        # Pick the largest polygon part (area-based)
        largest = max(parts, key=lambda p: p.area)

        # Convert back to GeoJSON coords
        return mapping(largest)["coordinates"]

    except Exception as e:
        print(f"Shapely polygon repair failed: {e}")
        return coords


def fix_geometry(geometry: dict) -> dict:
    """Fix Polygon or MultiPolygon geometry."""
    gtype = geometry.get("type")
    coords = geometry.get("coordinates")

    if gtype == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": fix_polygon_outer(fix_polygon(coords)),
        }
    elif gtype == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [fix_polygon_outer(fix_polygon(p)) for p in coords],
        }
    else:
        return geometry


def create_region_from_data(
    data: dict[str, Any], level: Literal["locality", "state", "country", "continent"]
) -> Region | None:
    """Create a Region document from data dictionary."""
    # Handle geometry
    geometry = None

    if data.get("geometry"):
        geom_data = data["geometry"]
        try:
            # Always run geometry through cleaner before inserting
            geom_data = fix_geometry(geom_data)

            if geom_data.get("type") == "Polygon":
                geometry = GeoJSONPolygon(
                    type="Polygon", coordinates=geom_data["coordinates"]
                )
            elif geom_data.get("type") == "MultiPolygon":
                geometry = GeoJSONMultiPolygon(
                    type="MultiPolygon", coordinates=geom_data["coordinates"]
                )
        except Exception as e:
            print(f"Failed to repair geometry for {data.get('name', 'unknown')}: {e}")
            # Continue without geometry rather than skipping the region entirely
    # Handle address
    address = Address()
    if any(
        key in data
        for key in [
            "street_address",
            "address_locality",
            "address_region",
            "postal_code",
            "iso_a2",
        ]
    ):
        address.street_address = data.get("street_address")
        address.address_locality = data.get("address_locality")
        address.address_region = data.get("address_region")
        address.postal_code = data.get("postal_code")
        if data.get("iso_a2"):
            address.country = CountryAlpha2(data["iso_a2"])
        address.display_name = data.get("name")

    coordinates = None
    if data.get("coordinates") and len(data["coordinates"]) >= 2:
        raw_coords = data["coordinates"]

        # The data appears to be in [latitude, longitude] format, but GeoJSON expects [longitude, latitude]
        # Let's check if we need to swap them based on valid ranges
        coord1, coord2 = raw_coords[0], raw_coords[1]

        latitude, longitude = coord1, coord2

        # Validate coordinates are within bounds
        if -90 <= latitude <= 90 and -180 <= longitude <= 180:
            # MongoDB's GeoJSON standard expects coordinates in [longitude, latitude] order
            coordinates = GeoJSONPoint(coordinates=[longitude, latitude])
        else:
            print(
                f"Warning: Coordinates out of bounds for {data.get('name', 'unknown')}: lat={latitude}, lon={longitude}"
            )
            return None

    return Region(
        name=data.get("name", ""),
        level=level,
        geometry=geometry,
        address=address,
        coordinates=coordinates,
        aliases=data.get("aliases", []),
    )


async def import_continents(state: ImportState) -> None:
    """Import continents."""
    if state.is_completed("continents"):
        print("Continents already imported, skipping...")
        return

    print("Importing continents...")
    continents_file = EXPORT_DIR / "continents.json"
    continents_data = await load_json_file(continents_file)

    if not continents_data:
        state.mark_completed("continents")
        await state.save_state()
        return

    processed_count = state.get_processed_count("continents")
    regions_batch = []
    current_index = processed_count
    skipped_count = 0

    print(f"Resuming from continent {processed_count + 1}/{len(continents_data)}")

    for i in range(processed_count, len(continents_data)):
        continent_data = continents_data[i]
        region = create_region_from_data(continent_data, "continent")
        if region is None:
            skipped_count += 1
            current_index = i
            continue
        regions_batch.append(region)
        current_index = i

        if len(regions_batch) >= BATCH_SIZE:
            success = await robust_batch_insert(regions_batch)
            if success:
                processed_count = current_index + 1
                state.update_progress(
                    "continents", processed_count, len(continents_data)
                )
                await state.save_state()

                print(f"Progress: {processed_count}/{len(continents_data)} continents")
            else:
                print("Batch insert failed, stopping continent import")
                return

            regions_batch = []

    # Insert remaining regions
    if regions_batch:
        await robust_batch_insert(regions_batch)

    state.mark_completed("continents")
    await state.save_state()

    print(
        f"Imported {len(continents_data) - skipped_count} continents (skipped: {skipped_count})"
    )


async def import_countries(state: ImportState) -> None:
    """Import countries."""
    if state.is_completed("countries"):
        print("Countries already imported, skipping...")
        return

    print("Importing countries...")
    countries_file = EXPORT_DIR / "countries.json"
    countries_data = await load_json_file(countries_file)

    if not countries_data:
        state.mark_completed("countries")
        await state.save_state()
        return

    processed_count = state.get_processed_count("countries")
    regions_batch = []
    current_index = processed_count
    skipped_count = 0

    print(f"Resuming from country {processed_count + 1}/{len(countries_data)}")

    for i in range(processed_count, len(countries_data)):
        country_data = countries_data[i]
        region = create_region_from_data(country_data, "country")
        if region is None:
            skipped_count += 1
            current_index = i
            continue
        regions_batch.append(region)
        current_index = i

        if len(regions_batch) >= BATCH_SIZE:
            success = await robust_batch_insert(regions_batch)
            if success:
                processed_count = current_index + 1
                state.update_progress("countries", processed_count, len(countries_data))
                await state.save_state()

                print(f"Progress: {processed_count}/{len(countries_data)} countries")
            else:
                print("Batch insert failed, stopping country import")
                return

            regions_batch = []

    # Insert remaining regions
    if regions_batch:
        await robust_batch_insert(regions_batch)

    state.mark_completed("countries")
    await state.save_state()

    print(
        f"Imported {len(countries_data) - skipped_count} countries (skipped: {skipped_count})"
    )


async def import_states(state: ImportState) -> None:
    """Import states."""
    if state.is_completed("states"):
        print("States already imported, skipping...")
        return

    print("Importing states...")
    states_file = EXPORT_DIR / "states.json"
    states_data = await load_json_file(states_file)

    if not states_data:
        state.mark_completed("states")
        await state.save_state()
        return

    processed_count = state.get_processed_count("states")
    regions_batch = []
    current_index = processed_count
    skipped_count = 0

    print(f"Resuming from state {processed_count + 1}/{len(states_data)}")

    for i in range(processed_count, len(states_data)):
        state_data = states_data[i]
        region = create_region_from_data(state_data, "state")
        if region is None:
            skipped_count += 1
            current_index = i
            continue
        regions_batch.append(region)
        current_index = i

        if len(regions_batch) >= BATCH_SIZE:
            success = await robust_batch_insert(regions_batch)
            if success:
                processed_count = current_index + 1
                state.update_progress("states", processed_count, len(states_data))
                await state.save_state()

                print(f"Progress: {processed_count}/{len(states_data)} states")
            else:
                print("Batch insert failed, stopping state import")
                return

            regions_batch = []

    # Insert remaining regions
    if regions_batch:
        await robust_batch_insert(regions_batch)

    state.mark_completed("states")
    await state.save_state()
    print(
        f"Imported {len(states_data) - skipped_count} states (skipped: {skipped_count})"
    )


async def import_localities(state: ImportState) -> None:
    """Import localities from all JSON files in the localities directory."""
    if state.is_completed("localities"):
        print("Localities already imported, skipping...")
        return

    print("Importing localities...")
    localities_dir = EXPORT_DIR / "localities"

    if not localities_dir.exists():
        print("Warning: localities directory not found")
        state.mark_completed("localities")
        await state.save_state()
        return

    processed_files = set(state.get_processed_files())
    json_files = sorted(localities_dir.glob("*.json"))
    total_localities = state.get_processed_count("localities")
    regions_batch = []
    total_skipped = 0

    print(
        f"Found {len(json_files)} locality files, {len(processed_files)} already processed"
    )

    # Process all JSON files in the localities directory
    for json_file in json_files:
        if json_file.name in processed_files:
            print(f"Skipping already processed file: {json_file.name}")
            continue

        print(f"Processing {json_file.name}...")
        localities_data = await load_json_file(json_file)

        if not localities_data:
            # Mark empty file as processed
            state.add_processed_file(json_file.name)
            await state.save_state()
            continue

        file_processed_count = 0
        file_skipped_count = 0

        for locality_data in localities_data:
            region = create_region_from_data(locality_data, "locality")
            if region is None:
                file_skipped_count += 1
                total_skipped = 1
                continue
            regions_batch.append(region)

            if len(regions_batch) >= BATCH_SIZE:
                success = await robust_batch_insert(regions_batch)
                if success:
                    file_processed_count += len(regions_batch)
                    total_localities += len(regions_batch)

                    # Update progress periodically
                    state.update_progress(
                        "localities", total_localities, 0
                    )  # Total unknown for localities
                    await state.save_state()

                    print(
                        f"Progress: {file_processed_count}/{len(localities_data)} in {json_file.name} (skipped: {file_skipped_count})"
                    )
                else:
                    print(
                        f"Batch insert failed for {json_file.name}, moving to next file"
                    )
                    break

                regions_batch = []

        # Insert remaining regions for this file
        if regions_batch:
            success = await robust_batch_insert(regions_batch)
            if success:
                total_localities += len(regions_batch)
                file_processed_count += len(regions_batch)
            regions_batch = []

        # Mark file as completely processed
        state.add_processed_file(json_file.name)
        state.update_progress("localities", total_localities, 0)
        await state.save_state()

        print(
            f"Completed {json_file.name}: {file_processed_count}/{len(localities_data)} localities (skipped: {file_skipped_count})"
        )

    state.mark_completed("localities")
    await state.save_state()

    print(
        f"Imported {total_localities} localities total (skipped: {total_skipped} with invalid coordinates)"
    )


async def main() -> None:
    """Run the main import process."""
    print("Starting region import process...")

    # Initialize state tracking
    state_file = STATE_DIR / "import_progress.json"
    state = ImportState(state_file)

    print(f"State file: {state_file}")
    if state_file.exists():
        print("Found existing state file, resuming import...")
    else:
        print("No existing state found, starting fresh import...")

    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    # Clear existing regions (optional - uncomment if needed)
    # NOTE: If you clear existing regions, also delete the state file to start fresh
    # print("Clearing existing regions...")
    # await Region.delete_all()
    # if state_file.exists():
    #     state_file.unlink()
    #     state = ImportState(state_file)

    try:
        # Import in hierarchical order
        await import_continents(state)
        await import_countries(state)
        await import_states(state)
        await import_localities(state)

        print("Region import process completed successfully!")
        print(f"Final state saved to: {state_file}")

    except KeyboardInterrupt:
        print("\nImport interrupted by user. Progress has been saved.")
        print(f"To resume, run the script again. State file: {state_file}")

    except Exception as e:
        print(f"Error during import process: {e}")
        print(f"Progress has been saved to: {state_file}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
