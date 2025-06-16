from typing import Any, Dict, List
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from app.accounts.repositories import ProfileRepo


class MongoFilterToolInput(BaseModel):
    """Input schema for MongoFilterTool."""

    filter_criteria: Dict[str, Any] = Field(
        ..., description="Dictionary of filter criteria"
    )


class MongoFilterTool(BaseTool):
    name: str = "MongoFilterTool"
    description: str = "Converts structured filter criteria into MongoDB queries"
    args_schema: type[BaseModel] = MongoFilterToolInput

    def __init__(self, profile_repo: ProfileRepo):
        super().__init__()
        self.profile_repo = profile_repo

    async def _run(self, filter_criteria: Dict[str, Any]) -> str:
        """Convert filter criteria to MongoDB query and execute it."""
        # Extract filter parameters
        gender = filter_criteria.get("gender")
        marital_status = filter_criteria.get("marital_status")
        category = filter_criteria.get("category")
        min_age = filter_criteria.get("min_age")
        max_age = filter_criteria.get("max_age")
        locations = filter_criteria.get("locations")
        open_to_relocation = filter_criteria.get("open_to_relocation")
        min_experience_years = filter_criteria.get("min_experience_years")
        languages = filter_criteria.get("languages")
        min_salary = filter_criteria.get("min_salary")
        max_salary = filter_criteria.get("max_salary")
        job_preferences = filter_criteria.get("job_preferences")
        limit = filter_criteria.get("limit", 10)

        # Use repository to filter profiles
        profiles = await self.profile_repo.filter_profiles(
            gender=gender,
            marital_status=marital_status,
            category=category,
            min_age=min_age,
            max_age=max_age,
            locations=locations,
            open_to_relocation=open_to_relocation,
            min_experience_years=min_experience_years,
            languages=languages,
            min_salary=min_salary,
            max_salary=max_salary,
            job_preferences=job_preferences,
            limit=limit,
        )

        # Convert profiles to JSON-serializable format
        return [profile.dict() for profile in profiles]
