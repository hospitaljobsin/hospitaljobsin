import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException

from .background import job_task_store, run_crewai_task
from .models import JobOutlineInput, JobStatusResponse, KickoffResponse

ai_router = APIRouter()


@ai_router.post("/api/ai/generate-job", response_model=KickoffResponse)
def generate_job(data: JobOutlineInput, background_tasks: BackgroundTasks):
    kickoff_id = uuid.uuid4()
    job_task_store.add_task(kickoff_id)
    background_tasks.add_task(run_crewai_task, kickoff_id, data.outline)
    return KickoffResponse(kickoff_id=kickoff_id)


@ai_router.get(
    "/api/ai/generate-job/status/{kickoff_id}", response_model=JobStatusResponse
)
def get_job_status(kickoff_id: uuid.UUID):
    task = job_task_store.get_task(kickoff_id)
    if not task:
        raise HTTPException(status_code=404, detail="kickoff_id not found")
    return JobStatusResponse(
        kickoff_id=kickoff_id, status=task["status"], result=task["result"]
    )
