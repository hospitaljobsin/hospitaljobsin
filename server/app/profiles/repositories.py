from datetime import date

from bson import ObjectId

from app.database.paginator import PaginatedResult, Paginator

from .documents import (
    Address,
    CurrentJob,
    Education,
    JobSeekerProfile,
    Links,
    Preferences,
)


class ProfileRepo:
    async def create(
        self,
        user_id: str,
        gender: str,
        date_of_birth: date,
        address: Address | None,
        is_differently_abled: bool,
        category: str | None,
        education: list[Education] | None,
        current_job: CurrentJob | None,
        total_job_experience: float | None,
        preferences: Preferences | None,
        links: Links | None,
    ) -> JobSeekerProfile:
        """Create a new profile."""
        profile = JobSeekerProfile(
            user_id=user_id,
            gender=gender,
            date_of_birth=date_of_birth,
            address=address,
            is_differently_abled=is_differently_abled,
            category=category,
            education=education,
            current_job=current_job,
            total_job_experience=total_job_experience,
            preferences=preferences,
            links=links,
        )

        return await profile.insert()

    async def get(self, profile_id: str) -> JobSeekerProfile | None:
        """Get profile by ID."""
        return await JobSeekerProfile.get(profile_id)

    async def get_by_user_id(self, user_id: str) -> JobSeekerProfile | None:
        """Get profile by user ID."""
        return await JobSeekerProfile.find_one(JobSeekerProfile.user_id == user_id)

    async def delete(self, profile: JobSeekerProfile) -> None:
        """Delete a profile by ID."""
        await profile.delete()
