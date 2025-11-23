import asyncio
import json

from app.config import (
    DatabaseSettings,
    EnvironmentSettings,
    FacebookSettings,
    FrontendSettings,
    get_settings,
)
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.typing import LambdaContext
from facebook_business.adobjects.page import Page
from facebook_business.api import FacebookAdsApi
from facebook_business.exceptions import FacebookRequestError
from pymongo import AsyncMongoClient
from structlog import get_logger

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

setup_logging(human_readable=env_settings.debug)

container = create_container()

logger = get_logger(__name__)

# Batch size for processing jobs
BATCH_SIZE = 10

# Description length limit for Facebook job postings
DESCRIPTION_LENGTH_LIMIT = 5000

# Validation constants
MAX_TITLE_LENGTH = 100
MIN_DESCRIPTION_LENGTH = 50
MAX_SKILLS_COUNT = 10
MAX_LIST_ITEMS_COUNT = 5
MIN_LINE_LENGTH = 10
BATCH_SIZE = 10

# Description length limit for Facebook job postings
DESCRIPTION_LENGTH_LIMIT = 5000


async def initialize_handler() -> None:
    database_settings = get_settings(DatabaseSettings)
    await initialize_database(
        db_client=AsyncMongoClient(
            str(database_settings.database_url),
            connectTimeoutMS=1000 * 15,
            socketTimeoutMS=1000 * 12,
            serverSelectionTimeoutMS=1000 * 15,
        ),
        default_database_name=database_settings.default_database_name,
    )


# 🟢 Create a persistent event loop and use it both for init and handler
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

# ✅ run once per cold start
loop.run_until_complete(initialize_handler())


def lambda_handler(event: dict, context: LambdaContext) -> str:
    """Lambda handler for posting jobs to Facebook Jobs platform."""
    _ = event, context  # Mark as unused
    return loop.run_until_complete(post_jobs_to_facebook_jobs())


async def post_jobs_to_facebook_jobs() -> str:
    """Post active jobs to Facebook Jobs platform and close expired jobs."""

    # Initialize Facebook API
    facebook_settings = get_settings(FacebookSettings)
    frontend_settings = get_settings(FrontendSettings)

    # Validate Facebook settings
    if not all(
        [
            facebook_settings.facebook_app_id,
            facebook_settings.facebook_app_secret,
            facebook_settings.facebook_page_access_token,
            facebook_settings.facebook_page_id,
        ]
    ):
        error_msg = "Missing required Facebook settings"
        logger.error(error_msg)
        return json.dumps(
            {
                "status": "error",
                "error": error_msg,
                "posted": 0,
                "updated": 0,
                "closed": 0,
                "failed": 0,
            }
        )

    FacebookAdsApi.init(
        app_id=facebook_settings.facebook_app_id,
        app_secret=facebook_settings.facebook_app_secret,
        access_token=facebook_settings.facebook_page_access_token,
    )

    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)

    total_posted = 0
    total_updated = 0
    total_closed = 0
    total_failed = 0
    validation_errors = 0

    try:
        # First, close expired jobs on Facebook Jobs
        expired_jobs = await job_repo.get_expired_facebook_jobs()
        for job in expired_jobs:
            try:
                await job.fetch_all_links()

                # Close the job on Facebook Jobs
                success = await _close_facebook_job(job.facebook_job_id)

                if success:
                    total_closed += 1
                    # Clear Facebook job reference
                    await job_repo.clear_facebook_job_reference(job.id)
                    logger.info(
                        "Closed expired Facebook job",
                        extra={
                            "job_id": str(job.id),
                            "job_title": job.title,
                            "facebook_job_id": job.facebook_job_id,
                        },
                    )
                else:
                    total_failed += 1

            except Exception as e:
                total_failed += 1
                logger.exception(
                    "Failed to close expired Facebook job",
                    extra={
                        "job_id": str(job.id),
                        "job_title": job.title,
                        "error": str(e),
                    },
                )

        # Now post new jobs to Facebook Jobs
        jobs_result = await job_repo.get_for_facebook_jobs_posting(first=BATCH_SIZE)

        while jobs_result.entities:
            posted_jobs_with_ids = []

            for job in jobs_result.entities:
                try:
                    # Fetch linked organization data
                    await job.fetch_all_links()

                    # Validate job data before processing
                    is_valid, error_message = _validate_job_data(job)
                    if not is_valid:
                        validation_errors += 1
                        logger.warning(
                            "Job validation failed - skipping",
                            extra={
                                "job_id": str(job.id),
                                "job_title": job.title,
                                "validation_error": error_message,
                            },
                        )
                        continue

                    # Create Facebook Jobs posting data
                    facebook_job_data = _create_facebook_job_data(
                        job, frontend_settings
                    )

                    # Post job to Facebook Jobs
                    facebook_job_id = await _create_facebook_job(facebook_job_data)

                    if facebook_job_id:
                        posted_jobs_with_ids.append((job.id, facebook_job_id))
                        total_posted += 1

                        logger.info(
                            "Successfully posted job to Facebook Jobs",
                            extra={
                                "job_id": str(job.id),
                                "job_title": job.title,
                                "organization": job.organization.name,
                                "facebook_job_id": facebook_job_id,
                            },
                        )
                    else:
                        total_failed += 1

                except FacebookRequestError as e:
                    total_failed += 1
                    error_details = _get_api_error_details(e)
                    logger.exception(
                        "Facebook Jobs API error posting job",
                        extra={
                            "job_id": str(job.id),
                            "job_title": job.title,
                            **error_details,
                        },
                    )
                except Exception as e:
                    total_failed += 1
                    logger.exception(
                        "Failed to post job to Facebook Jobs",
                        extra={
                            "job_id": str(job.id),
                            "job_title": job.title,
                            "error": str(e),
                        },
                    )

            # Mark successfully posted jobs
            if posted_jobs_with_ids:
                await job_repo.mark_as_posted_on_facebook_jobs(posted_jobs_with_ids)

            # Check if there are more jobs to process
            if not jobs_result.page_info.has_next_page:
                break

            # Get next batch
            jobs_result = await job_repo.get_for_facebook_jobs_posting(
                first=BATCH_SIZE, after=str(jobs_result.page_info.end_cursor)
            )

    except Exception as e:
        logger.exception("Fatal error in Facebook Jobs posting process")
        return json.dumps(
            {
                "status": "error",
                "error": str(e),
                "posted": total_posted,
                "updated": total_updated,
                "closed": total_closed,
                "failed": total_failed,
                "validation_errors": validation_errors,
            }
        )

    logger.info(
        "Completed Facebook Jobs posting process",
        extra={
            "posted": total_posted,
            "updated": total_updated,
            "closed": total_closed,
            "failed": total_failed,
            "validation_errors": validation_errors,
        },
    )

    return json.dumps(
        {
            "status": "success",
            "posted": total_posted,
            "updated": total_updated,
            "closed": total_closed,
            "failed": total_failed,
            "validation_errors": validation_errors,
        }
    )


def _validate_job_data(job: Job) -> tuple[bool, str | None]:
    """Validate job data before posting to Facebook Jobs."""
    if not job.title:
        return False, "Job title is required"

    if not job.description_cleaned:
        return False, "Job description is required"

    if not job.organization or not job.organization.name:
        return False, "Organization name is required"

    if len(job.title) > MAX_TITLE_LENGTH:
        return False, f"Job title too long (max {MAX_TITLE_LENGTH} characters)"

    if len(job.description_cleaned) < MIN_DESCRIPTION_LENGTH:
        return (
            False,
            f"Job description too short (min {MIN_DESCRIPTION_LENGTH} characters)",
        )

    return True, None


def _get_api_error_details(e: FacebookRequestError) -> dict:
    """Extract detailed error information from Facebook API error."""
    return {
        "error_code": e.api_error_code(),
        "error_message": e.api_error_message(),
        "error_user_msg": e.api_error_message(),
        "error_user_title": e.api_error_message(),
        "http_error_code": e.http_status_code(),
        "error_subcode": getattr(e, "error_subcode", None),
    }


def _sanitize_string(value: str | None, max_length: int = None) -> str | None:
    """Sanitize string values for API submission."""
    if not value:
        return None

    # Remove control characters and excess whitespace
    sanitized = " ".join(str(value).split())

    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length].rsplit(" ", 1)[
            0
        ]  # Truncate at word boundary

    return sanitized


async def _create_facebook_job(job_data: dict) -> str | None:
    """Create a job on Facebook Jobs platform using Graph API directly."""
    try:
        from facebook_business.api import FacebookAdsApi

        # Get the Facebook Page ID from settings or environment
        facebook_settings = get_settings(FacebookSettings)
        page_id = getattr(facebook_settings, "facebook_page_id", None)

        if not page_id:
            logger.error("Facebook Page ID not configured")
            return None

        # Validate required fields
        required_fields = [
            "title",
            "description",
            "location",
            "application_url",
            "company_name",
        ]
        missing_fields = [field for field in required_fields if not job_data.get(field)]
        if missing_fields:
            logger.error(
                "Missing required fields for Facebook job creation",
                extra={"missing_fields": missing_fields},
            )
            return None

        # Sanitize and prepare job data
        sanitized_job_data = {
            "title": _sanitize_string(job_data["title"], 100),
            "description": _sanitize_string(job_data["description"], 5000),
            "location": json.dumps(job_data["location"]),
            "application_url": job_data["application_url"][:500],  # URL length limit
            "employment_type": job_data.get("employment_type", "FULL_TIME"),
            "company_name": _sanitize_string(job_data["company_name"], 255),
            "remote_ok": bool(job_data.get("remote_ok", False)),
        }

        # Add optional fields if they exist and are valid
        if job_data.get("skills") and isinstance(job_data["skills"], list):
            sanitized_job_data["skills"] = json.dumps(
                job_data["skills"][:10]
            )  # Limit to 10 skills

        if job_data.get("salary") and isinstance(job_data["salary"], dict):
            salary = job_data["salary"]
            if salary.get("min_amount") or salary.get("max_amount"):
                sanitized_salary = {
                    "currency": salary.get("currency", "INR"),
                    "pay_period": salary.get("pay_period", "YEARLY"),
                }
                if salary.get("min_amount"):
                    sanitized_salary["min_amount"] = float(salary["min_amount"])
                if salary.get("max_amount"):
                    sanitized_salary["max_amount"] = float(salary["max_amount"])
                sanitized_job_data["salary"] = json.dumps(sanitized_salary)

        if job_data.get("experience_level"):
            sanitized_job_data["experience_level"] = job_data["experience_level"]

        if job_data.get("work_mode"):
            sanitized_job_data["work_mode"] = job_data["work_mode"]

        if job_data.get("education_level"):
            sanitized_job_data["education_level"] = job_data["education_level"]

        # Experience years
        if job_data.get("min_experience_years") is not None:
            sanitized_job_data["min_experience_years"] = int(
                job_data["min_experience_years"]
            )

        if job_data.get("max_experience_years") is not None:
            sanitized_job_data["max_experience_years"] = int(
                job_data["max_experience_years"]
            )

        # Lists - sanitize and limit length
        list_fields = ["responsibilities", "qualifications", "benefits"]
        for field in list_fields:
            if job_data.get(field) and isinstance(job_data[field], list):
                sanitized_list = [
                    _sanitize_string(item, 200)
                    for item in job_data[field]
                    if _sanitize_string(item, 200)
                ]
                if sanitized_list:
                    sanitized_job_data[field] = json.dumps(
                        sanitized_list[:5]
                    )  # Limit to 5 items

        # Use the underlying API directly
        api = FacebookAdsApi.get_default_api()

        # Make direct Graph API call to create job
        url = f"/{page_id}/jobs"
        response = api.call("POST", url, params=sanitized_job_data)

        if response and "id" in response:
            job_id = response["id"]
            logger.info(
                "Facebook job created successfully",
                extra={"job_id": job_id, "job_title": sanitized_job_data["title"]},
            )
            return job_id
        else:
            logger.error(
                "Failed to create Facebook job: No ID returned in response",
                extra={"response": str(response)},
            )
            return None

    except FacebookRequestError as e:
        error_details = _get_api_error_details(e)
        logger.error(
            "Facebook API error creating job",
            extra={"job_title": job_data.get("title", "Unknown"), **error_details},
        )
        return None
    except Exception as e:
        logger.exception(
            "Unexpected error creating Facebook job",
            extra={"job_title": job_data.get("title", "Unknown")},
        )
        return None


async def _close_facebook_job(facebook_job_id: str) -> bool:
    """Close a job on Facebook Jobs platform using Graph API."""
    try:
        # Validate Facebook job ID
        if not facebook_job_id or not isinstance(facebook_job_id, str):
            logger.error(
                "Invalid Facebook job ID provided",
                extra={"facebook_job_id": facebook_job_id},
            )
            return False

        # Get the Facebook Page ID from settings or environment
        facebook_settings = get_settings(FacebookSettings)
        page_id = getattr(facebook_settings, "facebook_page_id", None)

        if not page_id:
            logger.error("Facebook Page ID not configured")
            return False

        # Use the underlying API directly
        api = FacebookAdsApi.get_default_api()

        # Close the job using Graph API endpoint
        url = f"/{page_id}/jobs/{facebook_job_id}"
        response = api.call("POST", url, params={"status": "CLOSED"})

        if response and response.get("success", False):
            logger.info(
                "Facebook job closed successfully",
                extra={"facebook_job_id": facebook_job_id},
            )
            return True
        else:
            logger.error(
                "Failed to close Facebook job",
                extra={"facebook_job_id": facebook_job_id, "response": str(response)},
            )
            return False

    except FacebookRequestError as e:
        error_details = _get_api_error_details(e)
        logger.error(
            "Facebook API error closing job",
            extra={"facebook_job_id": facebook_job_id, **error_details},
        )
        return False
    except Exception as e:
        logger.exception(
            "Unexpected error closing Facebook job",
            extra={"facebook_job_id": facebook_job_id},
        )
        return False


def _create_facebook_job_data(job: Job, frontend_settings: FrontendSettings) -> dict:
    """Create Facebook Jobs posting data from a job document."""

    # Validate required fields
    if not job.title:
        raise ValueError("Job title is required")

    if not job.description_cleaned:
        raise ValueError("Job description is required")

    if not job.organization or not job.organization.name:
        raise ValueError("Organization name is required")

    # Build location data for Facebook Jobs API
    location_data = {
        "city": job.location if job.location else "Remote",
        "country": "India",  # Default to India, adjust as needed
    }

    # Add state if available in location
    if job.location and "," in job.location:
        parts = job.location.split(",")
        if len(parts) >= 2:
            location_data["city"] = parts[0].strip()
            location_data["state"] = parts[1].strip()

    # Map employment types
    employment_type_map = {
        "full_time": "FULL_TIME",
        "part_time": "PART_TIME",
        "contract": "CONTRACT",
        "temporary": "TEMPORARY",
        "internship": "INTERN",
    }

    # Map work modes
    work_mode_map = {"remote": "REMOTE", "onsite": "ON_SITE", "hybrid": "HYBRID"}

    # Map experience levels - using experience_level field instead of work_mode
    experience_level_map = {
        "entry": "ENTRY_LEVEL",
        "mid": "MID_LEVEL",
        "senior": "SENIOR_LEVEL",
        "director": "DIRECTOR",
        "executive": "EXECUTIVE",
    }

    # Truncate description to Facebook's limit
    description = job.description_cleaned[:DESCRIPTION_LENGTH_LIMIT]
    if len(job.description_cleaned) > DESCRIPTION_LENGTH_LIMIT:
        description += "..."

    # Build salary information
    salary_info = None
    if job.min_salary or job.max_salary:
        salary_info = {"currency": "INR", "pay_period": "YEARLY"}
        if job.min_salary:
            salary_info["min_amount"] = float(job.min_salary)
        if job.max_salary:
            salary_info["max_amount"] = float(job.max_salary)

    # Create the job data with proper field mapping and validation
    job_data = {
        "title": job.title,
        "description": description,
        "location": location_data,
        "application_url": f"{frontend_settings.seeker_portal_base_url}/organizations/{job.organization.slug}/jobs/{job.slug}",
        "employment_type": employment_type_map.get(job.job_type.value, "FULL_TIME")
        if job.job_type
        else "FULL_TIME",
        "company_name": job.organization.name,
        "skills": list(job.skills) if job.skills else [],
        "salary": salary_info,
        "min_experience_years": int(job.min_experience) if job.min_experience else None,
        "max_experience_years": int(job.max_experience) if job.max_experience else None,
        "remote_ok": job.work_mode.value == "remote" if job.work_mode else False,
        "responsibilities": _extract_responsibilities(description),
        "qualifications": _extract_qualifications(description),
        "benefits": _extract_benefits(description),
    }

    # Add optional fields with proper mapping
    if job.work_mode:
        job_data["work_mode"] = work_mode_map.get(job.work_mode.value, "ON_SITE")

    # Map experience level - try to get from experience_level field or fall back to work_mode
    experience_level = "MID_LEVEL"  # default
    if hasattr(job, "experience_level") and job.experience_level:
        experience_level = experience_level_map.get(
            job.experience_level.value, "MID_LEVEL"
        )
    elif job.work_mode:
        # Fall back to work_mode for experience level mapping
        work_mode_value = job.work_mode.value
        if work_mode_value == "remote":
            experience_level = (
                "MID_LEVEL"  # Remote jobs often require mid-level experience
            )
        elif work_mode_value == "onsite":
            experience_level = "ENTRY_LEVEL"  # Onsite jobs can be more flexible
        else:
            experience_level = "MID_LEVEL"

    job_data["experience_level"] = experience_level

    return job_data


def _extract_responsibilities(description: str) -> list[str]:
    """Extract responsibilities from job description."""
    # Simple extraction - look for responsibility keywords
    responsibilities = []
    lines = description.split("\n")
    for line in lines:
        line_lower = line.lower().strip()
        if any(
            keyword in line_lower
            for keyword in [
                "responsibility",
                "responsible",
                "handle",
                "manage",
                "develop",
            ]
        ):
            if len(line.strip()) > 10:  # Filter out very short lines
                responsibilities.append(line.strip())
    return responsibilities[:5]  # Limit to 5 responsibilities


def _extract_qualifications(description: str) -> list[str]:
    """Extract qualifications from job description."""
    qualifications = []
    lines = description.split("\n")
    for line in lines:
        line_lower = line.lower().strip()
        if any(
            keyword in line_lower
            for keyword in [
                "qualification",
                "qualified",
                "degree",
                "experience",
                "skill",
            ]
        ):
            if len(line.strip()) > 10:  # Filter out very short lines
                qualifications.append(line.strip())
    return qualifications[:5]  # Limit to 5 qualifications


def _extract_benefits(description: str) -> list[str]:
    """Extract benefits from job description."""
    benefits = []
    lines = description.split("\n")
    for line in lines:
        line_lower = line.lower().strip()
        if any(
            keyword in line_lower
            for keyword in [
                "benefit",
                "insurance",
                "health",
                "salary",
                "bonus",
                "perks",
            ]
        ):
            if len(line.strip()) > 10:  # Filter out very short lines
                benefits.append(line.strip())
    return benefits[:3]  # Limit to 3 benefits


if __name__ == "__main__":
    # for local testing only
    loop.run_until_complete(post_jobs_to_facebook_jobs())
