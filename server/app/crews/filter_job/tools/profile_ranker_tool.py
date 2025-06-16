from typing import Any

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class ProfileRankerToolInput(BaseModel):
    """Input schema for ProfileRankerTool."""

    enhanced_profiles: list[dict[str, Any]] = Field(
        ..., description="List of enhanced profiles with semantic match scores"
    )
    query_context: dict[str, Any] = Field(
        ..., description="Context from the original query"
    )


class ProfileRankerTool(BaseTool):
    """Tool for ranking and scoring matched profiles."""

    name: str = "Profile Ranker"
    description: str = (
        "Rank and score matched profiles based on relevance to search criteria. "
        "Considers multiple factors and generates clear match reasons."
    )
    args_schema: type[BaseModel] = ProfileRankerToolInput

    def _run(
        self, enhanced_profiles: list[dict[str, Any]], query_context: dict[str, Any]
    ) -> str:
        """
        Rank and score matched profiles.

        Args:
            enhanced_profiles: List of enhanced profiles with semantic match scores
            query_context: Context from the original query

        Returns:
            JSON string containing ranked profiles with scores and match reasons
        """
        # Sort profiles by match score
        ranked_profiles = sorted(
            enhanced_profiles, key=lambda x: x["match_score"], reverse=True
        )

        # Take top 10 profiles
        top_profiles = ranked_profiles[:10]

        # Enhance match reasons based on ranking
        for profile in top_profiles:
            # Add ranking-specific reasons
            if profile["match_score"] > 0.8:
                profile["match_reasons"].append("Excellent match for all key criteria")
            elif profile["match_score"] > 0.6:
                profile["match_reasons"].append("Strong match for most criteria")
            else:
                profile["match_reasons"].append("Good match with some criteria")

            # Add specific strengths
            if profile["profile"].work_experience:
                profile["match_reasons"].append(
                    f"Has {len(profile['profile'].work_experience)} relevant work experiences"
                )

            if profile["profile"].certifications:
                profile["match_reasons"].append(
                    f"Has {len(profile['profile'].certifications)} relevant certifications"
                )

        return str(top_profiles)
