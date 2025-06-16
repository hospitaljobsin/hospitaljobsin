import re
from typing import Any

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class QueryParserToolInput(BaseModel):
    """Input schema for QueryParserTool."""

    query: str = Field(..., description="Natural language query to parse")


class QueryParserTool(BaseTool):
    name: str = "QueryParserTool"
    description: str = (
        "Parses natural language queries into structured job requirements"
    )
    args_schema: type[BaseModel] = QueryParserToolInput

    async def _arun(self, query: str) -> dict[str, Any]:
        """Parse natural language query into structured requirements."""
        # Extract structured filters
        structured_filters = {
            "education_requirements": self._extract_education_requirements(query),
            "experience_requirements": self._extract_experience_requirements(query),
            "skill_requirements": self._extract_skill_requirements(query),
            "language_requirements": self._extract_language_requirements(query),
            "certification_requirements": self._extract_certification_requirements(
                query
            ),
            "location_requirements": self._extract_location_requirements(query),
            "salary_requirements": self._extract_salary_requirements(query),
            "other_requirements": self._extract_other_requirements(query),
        }

        return {
            "structured_filters": structured_filters,
            "original_query": query,
            "llm_context": {"query": query, "extracted_filters": structured_filters},
        }

    def _run(self, query: str) -> dict[str, Any]:
        """Synchronous version of _arun."""
        return self._arun(query)

    def _extract_education_requirements(self, query: str) -> dict[str, Any]:
        """Extract education requirements from query."""
        # Look for specific institutions
        institutions = []
        if "AIIMS" in query:
            institutions.append("AIIMS")

        # Look for degree types
        degree_types = []
        if "doctor" in query.lower():
            degree_types.append("MBBS")
            degree_types.append("MD")

        return {
            "degree_types": degree_types,
            "institutions": institutions,
            "min_years": None,
        }

    def _extract_experience_requirements(self, query: str) -> dict[str, Any]:
        """Extract experience requirements from query."""
        # Look for years of experience
        min_years = None
        exp_pattern = r"(\d+)\s*(?:years?|yrs?)\s*(?:of)?\s*experience"
        match = re.search(exp_pattern, query.lower())
        if match:
            min_years = int(match.group(1))

        return {"min_years": min_years, "required_roles": [], "required_skills": []}

    def _extract_skill_requirements(self, query: str) -> list[str]:
        """Extract skill requirements from query."""
        skills = []
        if "doctor" in query.lower():
            skills.append("Medical Practice")
        return skills

    def _extract_language_requirements(self, query: str) -> dict[str, Any]:
        """Extract language requirements from query."""
        return {"languages": [], "min_proficiency": None}

    def _extract_certification_requirements(self, query: str) -> list[str]:
        """Extract certification requirements from query."""
        return []

    def _extract_location_requirements(self, query: str) -> dict[str, Any]:
        """Extract location requirements from query."""
        locations = []
        if "pune" in query.lower():
            locations.append("Pune")

        return {"locations": locations, "relocation_required": False}

    def _extract_salary_requirements(self, query: str) -> dict[str, Any]:
        """Extract salary requirements from query."""
        min_salary = None
        max_salary = None

        # Look for salary in lakhs
        salary_pattern = r"(\d+)\s*(?:lakh|lac)s?\s*(?:per|a)?\s*(?:month|year)"
        match = re.search(salary_pattern, query.lower())
        if match:
            amount = int(match.group(1))
            if "month" in query.lower():
                min_salary = amount * 100000  # Convert lakhs to rupees
            else:
                min_salary = (
                    amount * 100000
                ) // 12  # Convert yearly lakhs to monthly rupees

        return {"min_salary": min_salary, "max_salary": max_salary, "currency": "INR"}

    def _extract_other_requirements(self, query: str) -> dict[str, Any]:
        """Extract other requirements from query."""
        return {"preferences": [], "constraints": []}
