import logging
import threading
import uuid
from typing import Any, Dict, Optional, Union

from app.crews.create_job.crew import CreateJobCrew
from app.crews.filter_job.crew import FilterJobCrew
from app.accounts.repositories import ProfileRepo

from .models import JobResultData, FilterJobResultData


# Thread-safe in-memory storage for task state
class TaskStateStore:
    def __init__(self):
        self._tasks: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def add_task(self, task_id: str, initial_state: Dict[str, Any]) -> None:
        with self._lock:
            self._tasks[task_id] = initial_state

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._tasks.get(task_id)

    def update_task(self, task_id: str, updates: Dict[str, Any]) -> None:
        with self._lock:
            if task_id in self._tasks:
                self._tasks[task_id].update(updates)

    def remove_task(self, task_id: str) -> None:
        with self._lock:
            self._tasks.pop(task_id, None)


# Create task store instances
job_task_store = TaskStateStore()
filter_task_store = TaskStateStore()


def fill_missing_optionals(data: dict, model_class) -> dict:
    # Fill missing optional fields with None for the given model
    fields = model_class.__fields__
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
    job_task_store.update_task(str(kickoff_id), {"status": "in_progress"})
    try:
        # Run the CrewAI crew with the outline as input
        crew = CreateJobCrew().crew()
        result = crew.kickoff(inputs={"outline": outline})
        logging.info(f"Raw CrewAI result for kickoff_id {kickoff_id}: {result}")
        # The result should be a dict matching JobResultData
        result_dict = to_dict_safe(result)
        logging.info(f"Result dict for kickoff_id {kickoff_id}: {result_dict}")
        job_result = JobResultData.model_validate(
            fill_missing_optionals(result_dict, JobResultData)
        )
        set_result(str(kickoff_id), job_result, job_task_store)
    except Exception as e:
        logging.exception(f"Error in run_crewai_task for kickoff_id {kickoff_id}: {e}")
        job_task_store.update_task(
            str(kickoff_id), {"status": "error", "error": str(e)}
        )


async def run_filter_job_task(
    task_id: str, crew, query: str, max_results: int = 10
) -> None:
    """Run a filter job task in the background."""
    try:
        # Update task state to processing
        filter_task_store.update_task(
            task_id, {"status": "processing", "message": "Filtering profiles..."}
        )

        # Run the crew
        result = await crew.run(query, max_results)

        # Update task state with result
        filter_task_store.update_task(
            task_id, {"status": "completed", "result": result.dict()}
        )
    except Exception as e:
        # Update task state with error
        filter_task_store.update_task(task_id, {"status": "error", "error": str(e)})


def set_result(
    task_id: str,
    result: Union[JobResultData, FilterJobResultData],
    store: TaskStateStore,
) -> None:
    """Set the result for a task."""
    store.update_task(task_id, {"status": "completed", "result": result.dict()})
