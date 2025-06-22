from datetime import datetime
from typing import Any

from app.accounts.documents import Profile
from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class ProfileAnalyzerToolInput(BaseModel):
    """Input schema for ProfileAnalyzerTool."""

    profile: Profile = Field(..., description="Profile to analyze")
    query_context: dict[str, Any] = Field(
        ..., description="Context from the parsed query"
    )


class ProfileAnalyzerTool(BaseTool):
    name: str = "ProfileAnalyzerTool"
    description: str = "Analyzes a profile against job requirements using both structured filters and LLM analysis"
    args_schema: type[BaseModel] = ProfileAnalyzerToolInput

    async def _run(
        self, profile: Profile, query_context: dict[str, Any]
    ) -> dict[str, Any]:
        """Synchronous wrapper for _arun."""
        return await self._arun(profile, query_context)

    async def _arun(
        self, profile: Profile, query_context: dict[str, Any]
    ) -> dict[str, Any]:
        """Analyze a profile against job requirements."""
        structured_filters = query_context.get("structured_filters", {})
        original_query = query_context.get("original_query", "")

        # Apply structured filters
        structured_analysis = self._apply_structured_filters(
            profile, structured_filters
        )
        structured_score = structured_analysis["score"]
        matches = structured_analysis["matches"]
        mismatches = structured_analysis["mismatches"]

        # Apply LLM analysis
        llm_analysis = self._apply_llm_analysis(profile, original_query)
        llm_score = llm_analysis["score"]
        matches.extend(llm_analysis["matches"])
        mismatches.extend(llm_analysis["mismatches"])

        # Calculate total score (70% structured, 30% LLM)
        score = (0.7 * structured_score) + (0.3 * llm_score)
        score = min(score * 100, 100)  # Scale to 0-100

        # Determine match type and summary
        if score >= 90:
            match_type = "PERFECT"
            summary = "Perfect match: Candidate meets all key requirements."
        elif score >= 60:
            match_type = "CLOSE"
            summary = "Close match: Candidate meets most requirements."
        else:
            match_type = "LOW"
            summary = "Low match: Candidate meets some, but not all, key requirements."

        # Generate final analysis aligned with AIApplicantInsight
        analysis = {
            "matchType": match_type,
            "score": score,
            "summary": summary,
            "matchReasons": matches,
            "mismatchedFields": mismatches,
        }

        return analysis

    def _apply_structured_filters(
        self, profile: Profile, filters: dict[str, Any]
    ) -> dict[str, Any]:
        """Apply structured filters to the profile."""
        analysis = {"score": 0.0, "matches": [], "mismatches": []}

        # Check education requirements
        if "education_requirements" in filters:
            edu_req = filters["education_requirements"]
            edu_match = False
            for edu in profile.education:
                if self._matches_education(edu, edu_req):
                    edu_match = True
                    analysis["matches"].append(
                        f"Education: {edu.degree} from {edu.institution}"
                    )
                    analysis["score"] += 0.3  # Higher weight for education match
            if not edu_match:
                analysis["mismatches"].append("Education: Does not match requirements")

        # Check experience requirements
        if "experience_requirements" in filters:
            exp_req = filters["experience_requirements"]
            if self._matches_experience(profile.work_experience, exp_req):
                analysis["matches"].append(
                    f"Experience: {exp_req['min_years']} years required"
                )
                analysis["score"] += 0.3  # Higher weight for experience match
            else:
                analysis["mismatches"].append(
                    f"Experience: Less than {exp_req['min_years']} years"
                )

        # Check location requirements
        if "location_requirements" in filters:
            loc_req = filters["location_requirements"]
            if self._matches_location(profile, loc_req):
                analysis["matches"].append(
                    f"Location: {', '.join(loc_req['locations'])}"
                )
                analysis["score"] += 0.2
            else:
                analysis["mismatches"].append("Location: Not in preferred locations")

        # Check salary requirements
        if "salary_requirements" in filters:
            salary_req = filters["salary_requirements"]
            if self._matches_salary(profile, salary_req):
                analysis["matches"].append("Salary: Within expected range")
                analysis["score"] += 0.2
            else:
                analysis["mismatches"].append("Salary: Outside expected range")

        return analysis

    def _apply_llm_analysis(self, profile: Profile, query: str) -> dict[str, Any]:
        """Apply LLM-based analysis to the profile."""
        # This would typically use an LLM to analyze the profile against the query
        # For now, we'll use a simple scoring based on profile completeness
        analysis = {"score": 0.0, "matches": [], "mismatches": []}

        # Score based on profile completeness
        if profile.education:
            analysis["score"] += 0.2
            analysis["matches"].append("Complete education history")

        if profile.work_experience:
            analysis["score"] += 0.2
            analysis["matches"].append("Detailed work experience")

            # Check for skills in work experience
            skills = set()
            for exp in profile.work_experience:
                if exp.skills:
                    skills.update(exp.skills)
            if skills:
                analysis["score"] += 0.2
                analysis["matches"].append(f"Skills: {', '.join(skills)}")

        if profile.languages:
            analysis["score"] += 0.2
            analysis["matches"].append("Language proficiencies")

        if profile.certifications:
            analysis["score"] += 0.2
            analysis["matches"].append("Professional certifications")

        return analysis

    def _matches_education(self, education: Any, requirements: dict[str, Any]) -> bool:
        """Check if education matches requirements."""
        if not requirements.get("degree_types") and not requirements.get(
            "institutions"
        ):
            return True

        # Check degree types
        if requirements.get("degree_types"):
            if education.degree not in requirements["degree_types"]:
                return False

        # Check institutions
        if requirements.get("institutions"):
            if education.institution not in requirements["institutions"]:
                return False

        return True

    def _matches_experience(
        self, experience: list[Any], requirements: dict[str, Any]
    ) -> bool:
        """Check if experience matches requirements."""
        if not requirements.get("min_years"):
            return True

        total_years = 0
        for exp in experience:
            # Convert date to datetime at midnight
            start_date = datetime.combine(exp.started_at, datetime.min.time())
            end_date = (
                datetime.combine(exp.completed_at, datetime.min.time())
                if exp.completed_at
                else datetime.now()
            )
            years = (end_date - start_date).days / 365.25
            total_years += years

        return total_years >= requirements["min_years"]

    def _matches_location(self, profile: Profile, requirements: dict[str, Any]) -> bool:
        """Check if location matches requirements."""
        if not requirements.get("locations"):
            return True

        return any(
            loc in profile.locations_open_to_work for loc in requirements["locations"]
        )

    def _matches_salary(self, profile: Profile, requirements: dict[str, Any]) -> bool:
        """Check if salary expectations match requirements."""
        if not requirements.get("min_salary") or not profile.salary_expectations:
            return True

        profile_salary = profile.salary_expectations.preferred_monthly_salary_inr
        req_min = requirements["min_salary"]
        req_max = requirements.get("max_salary")

        if req_max:
            return profile_salary >= req_min and profile_salary <= req_max
        return profile_salary >= req_min
