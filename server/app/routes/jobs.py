from fastapi import APIRouter

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/")
async def list_jobs():
    """Placeholder for listing jobs."""
    return {"message": "List jobs endpoint"}


@router.get("/{job_id}")
async def get_job(job_id: str):
    """Placeholder for getting a specific job."""
    return {"message": f"Get job {job_id} endpoint"}
