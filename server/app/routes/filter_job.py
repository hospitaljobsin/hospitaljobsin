from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

from app.crews.filter_job.crew import FilterJobCrew
from app.ai.background import filter_task_store, run_filter_job_task
from app.ai.models import FilterJobResultData, ProfileMatch

router = APIRouter(prefix="/api/filter-job", tags=["filter-job"])


class FilterJobRequest(BaseModel):
    """Request model for filter job."""

    query: str = Field(..., description="Natural language query for filtering profiles")
    max_results: Optional[int] = Field(
        10, description="Maximum number of results to return"
    )


class FilterJobResponse(BaseModel):
    """Response model for filter job."""

    task_id: str
    status: str
    message: str


@router.post("/filter", response_model=FilterJobResponse)
async def filter_profiles(request: FilterJobRequest, background_tasks: BackgroundTasks):
    """Start a background task to filter profiles based on the query."""
    # Generate task ID
    task_id = str(uuid.uuid4())

    # Initialize task state
    filter_task_store.add_task(task_id, {"status": "pending", "message": "Task queued"})

    # Create crew instance
    crew = FilterJobCrew()

    # Add task to background
    background_tasks.add_task(
        run_filter_job_task,
        task_id=task_id,
        crew=crew,
        query=request.query,
        max_results=request.max_results,
    )

    return FilterJobResponse(
        task_id=task_id, status="pending", message="Profile filtering started"
    )


@router.get("/status/{task_id}")
async def get_filter_status(task_id: str):
    """Get the status and results of a filter job task."""
    task = filter_task_store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] == "error":
        raise HTTPException(status_code=500, detail=task["error"])

    if task["status"] == "completed":
        return task["result"]

    return {"status": task["status"], "message": task.get("message", "")}
