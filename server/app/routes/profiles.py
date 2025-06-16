from fastapi import APIRouter

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.get("/")
async def list_profiles():
    """Placeholder for listing profiles."""
    return {"message": "List profiles endpoint"}


@router.get("/{profile_id}")
async def get_profile(profile_id: str):
    """Placeholder for getting a specific profile."""
    return {"message": f"Get profile {profile_id} endpoint"}
