import logging
import threading
import uuid
from typing import Any

from app.crews.create_job.crew import CreateJobCrew

from .models import JobResultData


# Thread-safe in-memory storage for task state
class TaskStateStore:
    def __init__(self):
        self._store: dict[uuid.UUID, dict[str, Any]] = {}
        self._lock = threading.Lock()

    def add_task(self, kickoff_id: uuid.UUID):
        with self._lock:
            self._store[kickoff_id] = {
                "status": "pending",
                "result": None,
                "error": None,
            }

    def update_status(self, kickoff_id: uuid.UUID, status: str):
        with self._lock:
            if kickoff_id in self._store:
                self._store[kickoff_id]["status"] = status

    def set_result(self, kickoff_id: uuid.UUID, result: JobResultData | None):
        with self._lock:
            if kickoff_id in self._store:
                self._store[kickoff_id]["result"] = result
                self._store[kickoff_id]["status"] = "completed"

    def set_error(self, kickoff_id: uuid.UUID, error: str):
        with self._lock:
            if kickoff_id in self._store:
                self._store[kickoff_id]["error"] = error
                self._store[kickoff_id]["status"] = "failed"

    def get_task(self, kickoff_id: uuid.UUID) -> dict[str, Any] | None:
        with self._lock:
            return self._store.get(kickoff_id)


# Global store instance
store = TaskStateStore()


def fill_missing_optionals(data: dict) -> dict:
    # Fill missing optional fields with None for JobResultData
    fields = JobResultData.__fields__
    return {k: data.get(k, None) for k in fields}


def to_dict_safe(obj):
    if isinstance(obj, dict):
        return obj
    if hasattr(obj, "dict"):
        return obj.dict()
    if hasattr(obj, "__dict__"):
        return vars(obj)
    raise TypeError(f"Cannot convert object of type {type(obj)} to dict")


def run_crewai_task(kickoff_id: uuid.UUID, outline: str):
    """
    Run the CrewAI job generation process in the background.
    Updates the store with status and result.
    """
    store.update_status(kickoff_id, "in_progress")
    try:
        # Run the CrewAI crew with the outline as input
        crew = CreateJobCrew().crew()
        result = crew.kickoff(inputs={"outline": outline})
        logging.info(f"Raw CrewAI result for kickoff_id {kickoff_id}: {result}")
        # The result should be a dict matching JobResultData
        result_dict = to_dict_safe(result)
        logging.info(f"Result dict for kickoff_id {kickoff_id}: {result_dict}")
        job_result = JobResultData.model_validate(fill_missing_optionals(result_dict))
        store.set_result(kickoff_id, job_result)
    except Exception as e:
        logging.exception(f"Error in run_crewai_task for kickoff_id {kickoff_id}: {e}")
        store.set_error(kickoff_id, str(e))
