import asyncio
from datetime import UTC, datetime

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.jobs.documents import Job
from beanie.operators import Or


async def generate_whatsapp_messages():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    messages = []
    job_ids_being_processed = []

    jobs = await Job.find(
        Job.is_active == True,
        Job.whatsapp_channel_posted_at == None,
        Or(Job.expires_at == None, Job.expires_at > datetime.now(UTC)),
        fetch_links=True,
        nesting_depth=2,
    ).to_list()
    print(f"Number of new jobs to process: {len(jobs)}")

    if not jobs:
        print(
            "✅ No new jobs to process. All eligible jobs have already been posted to WhatsApp."
        )
        return

    # Store job IDs for safety tracking
    for job in jobs:
        job_ids_being_processed.append(str(job.id))

    print(f"📋 Job IDs being processed: {job_ids_being_processed}")

    # Save job IDs to a tracking file for safety
    from pathlib import Path

    tracking_file = Path("whatsapp_job_tracking.json")

    import json

    tracking_data = {
        "batch_timestamp": datetime.now(UTC).isoformat(),
        "job_ids": job_ids_being_processed,
        "total_jobs": len(job_ids_being_processed),
    }

    with open(tracking_file, "w", encoding="utf-8") as f:
        json.dump(tracking_data, f, indent=2)

    print(f"💾 Job tracking saved to: {tracking_file}")

    for job in jobs:

        def format_salary(job):
            """Format salary based on available fields"""
            if hasattr(job, "min_salary") and hasattr(job, "max_salary"):
                if job.min_salary and job.max_salary:
                    return f"₹{job.min_salary} - ₹{job.max_salary}"
                elif job.min_salary:
                    return f"From ₹{job.min_salary}"
                elif job.max_salary:
                    return f"Up to ₹{job.max_salary}"
                else:
                    return "Not specified"
            else:
                return "Not specified"

        def format_experience(job):
            """Format experience based on available fields"""
            if hasattr(job, "min_experience") and hasattr(job, "max_experience"):
                if job.min_experience and job.max_experience:
                    return f"{job.min_experience} - {job.max_experience} years"
                elif job.min_experience:
                    return f"From {job.min_experience} years"
                elif job.max_experience:
                    return f"Up to {job.max_experience} years"
                else:
                    return "Not specified"
            elif hasattr(job, "experience") and job.experience:
                return job.experience
            else:
                return "Not specified"

        # message to be published to whatsapp public channel
        message = f"""
*{job.title.strip()}*
{job.organization.name.strip()}

*Location:* {job.location if job.location else "Not specified"}
*Salary:* {format_salary(job)}
*Vacancies:* {job.vacancies if job.vacancies else "Not specified"}
*Experience:* {format_experience(job)}

🔗 *Apply Now:*
https://hospitaljobs.in/organizations/{job.organization.slug}/jobs/{job.slug}
        """
        messages.append(message)
        # Mark job as posted to WhatsApp
        job.whatsapp_channel_posted_at = datetime.now(UTC)
        await job.save()
        print(f"  ✓ Marked '{job.title}' as posted to WhatsApp")

    # Export messages as individual markdown files
    from pathlib import Path

    # Create output directory
    output_dir = Path("whatsapp_messages")
    output_dir.mkdir(exist_ok=True)

    print(f"\nExporting {len(messages)} messages to markdown files...")

    for i, message in enumerate(messages, 1):
        # Create filename with job title (sanitized)
        job_title = messages[i - 1].split("\n")[0].replace("*", "").strip()
        safe_title = "".join(
            c for c in job_title if c.isalnum() or c in (" ", "-", "_")
        ).rstrip()
        safe_title = safe_title.replace(" ", "_")[:50]  # Limit length

        filename = f"{i:02d}_{safe_title}.md"
        filepath = output_dir / filename

        # Write message to markdown file
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(message.strip())

        print(f"✓ Exported: {filename}")

    print(f"\n✅ All messages exported to '{output_dir}' directory")
    print(f"📁 Total files created: {len(messages)}")


if __name__ == "__main__":
    asyncio.run(generate_whatsapp_messages())
