import asyncio

from app.config import FrontendSettings, get_settings
from app.container import create_container
from app.core.emails import BaseEmailSender


async def send_resume_upload_reminder(
    user_email: str,
    user_name: str,
) -> None:
    """Send resume upload reminder email to a user."""
    container = create_container()

    async with container.context() as ctx:
        email_sender = await ctx.resolve(BaseEmailSender)
        frontend_settings = get_settings(FrontendSettings)

        await email_sender.send_template_email(
            receiver=user_email,
            template="resume-upload-reminder",
            context={
                "user_name": user_name,
                "upload_resume_url": f"{frontend_settings.seeker_portal_base_url}/resume-builder?utm_source=email&utm_medium=email&utm_campaign=resume_upload_reminder",
            },
        )

        print(f"✅ Resume upload reminder sent to {user_email}")


if __name__ == "__main__":
    # Example usage
    asyncio.run(
        send_resume_upload_reminder(
            user_email="user@example.com",
            user_name="John Doe",
        )
    )
