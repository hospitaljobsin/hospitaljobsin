from fastapi import APIRouter

geocoding_router = APIRouter(prefix="/locations")


@geocoding_router.get("/")
async def get_locations():
    """Get all locations."""
    return {"message": "Get all locations"}
