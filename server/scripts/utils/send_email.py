import asyncio

from app.config import FrontendSettings, get_settings
from app.container import create_container
from app.core.emails import BaseEmailSender
from bson import ObjectId


async def send_candidate_application_notification(
    recruiter_email: str,
    recruiter_name: str,
) -> None:
    """Send candidate application notification email to a recruiter."""
    container = create_container()

    async with container.context() as ctx:
        email_sender = await ctx.resolve(BaseEmailSender)
        frontend_settings = get_settings(FrontendSettings)

        # Mock data for demonstration
        mock_job = type(
            "Job",
            (),
            {
                "title": "Senior Software Engineer",
                "slug": "senior-software-engineer-123",
            },
        )()

        mock_organization = type(
            "Organization",
            (),
            {
                "slug": "example-hospital",
            },
        )()

        mock_applicant_id = ObjectId()
        mock_applicants = [
            type(
                "Applicant",
                (),
                {
                    "id": mock_applicant_id,
                    "account_full_name": "Dr. Sarah Johnson",
                    "slug": "dr-sarah-johnson-456",
                    "profile_snapshot": type(
                        "Profile",
                        (),
                        {
                            "headline": "Experienced Cardiologist with 8+ years",
                            "resume_url": "https://example.com/resume.pdf",
                            "career_profile": type(
                                "CareerProfile",
                                (),
                                {
                                    "locations_open_to_work": ["Mumbai", "Delhi"],
                                },
                            )(),
                        },
                    )(),
                },
            )(),
            type(
                "Applicant",
                (),
                {
                    "id": ObjectId(),
                    "account_full_name": "Dr. Rajesh Kumar",
                    "slug": "dr-rajesh-kumar-789",
                    "profile_snapshot": type(
                        "Profile",
                        (),
                        {
                            "headline": "Neurologist specializing in pediatric care",
                            "resume_url": None,
                            "career_profile": type(
                                "CareerProfile",
                                (),
                                {
                                    "locations_open_to_work": ["Bangalore"],
                                },
                            )(),
                        },
                    )(),
                },
            )(),
        ]

        await email_sender.send_template_email(
            receiver=recruiter_email,
            template="candidate-application-notification",
            context={
                "recruiter_name": recruiter_name,
                "job": mock_job,
                "organization": mock_organization,
                "applicants": mock_applicants,
                "applicant_count": len(mock_applicants),
                "applicants_url": f"{frontend_settings.recruiter_dashboard_base_url}/organizations/{mock_organization.slug}/jobs/{mock_job.slug}/applicants",
                "manage_jobs_url": f"https://{mock_organization.slug}.{frontend_settings.base_domain}/jobs",
            },
        )

        print(f"✅ Candidate application notification sent to {recruiter_email}")


if __name__ == "__main__":
    # Example usage
    asyncio.run(
        send_candidate_application_notification(
            recruiter_email="recruiter@example.com",
            recruiter_name="John Smith",
        )
    )
