import asyncio
from datetime import datetime, UTC, date
from typing import List

from app.config import DatabaseSettings, get_settings
from app.accounts.documents import (
    Profile,
    Education,
    WorkExperience,
    Language,
    SalaryExpectations,
    License,
    Certification,
    GenderEnum,
    MaritalStatusEnum,
    LanguageProficiencyEnum,
    LicenseVerificationStatusEnum,
)
from app.database import initialize_database
from app.crews.filter_job.crew import FilterJobCrew
from app.ai.models import FilterJobResultData


async def insert_test_profiles():
    """Insert test profiles with various attributes."""
    async with initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    ):
        # Clean up existing profiles
        await Profile.delete_all()
        print("Cleaned up existing profiles")

        # Create test profiles
        profiles = [
            # Profile 1: Matches all criteria
            Profile(
                gender="MALE",
                date_of_birth=date(1985, 1, 1),
                address="Pune, Maharashtra",
                marital_status="MARRIED",
                category="GENERAL",
                locations_open_to_work=["Pune", "Mumbai"],
                open_to_relocation_anywhere=False,
                education=[
                    Education(
                        degree="MBBS",
                        institution="AIIMS Delhi",
                        started_at=date(2005, 7, 1),
                        completed_at=date(2010, 6, 30),
                    ),
                    Education(
                        degree="MD",
                        institution="AIIMS Delhi",
                        started_at=date(2010, 7, 1),
                        completed_at=date(2015, 6, 30),
                    ),
                ],
                languages=[
                    Language(name="English", proficiency="NATIVE"),
                    Language(name="Hindi", proficiency="PROFESSIONAL"),
                ],
                work_experience=[
                    WorkExperience(
                        title="Resident Doctor",
                        organization="AIIMS Delhi",
                        started_at=date(2010, 7, 1),
                        completed_at=date(2015, 6, 30),
                        employment_type="FULL_TIME",
                        skills=["General Medicine", "Patient Care"],
                    ),
                    WorkExperience(
                        title="Senior Doctor",
                        organization="Sassoon Hospital, Pune",
                        started_at=date(2015, 7, 1),
                        completed_at=None,  # Current job
                        employment_type="FULL_TIME",
                        skills=["Internal Medicine", "Emergency Care"],
                    ),
                ],
                salary_expectations=SalaryExpectations(
                    preferred_monthly_salary_inr=200000,  # 2L/month
                    negotiable=True,
                ),
                licenses=[
                    License(
                        name="Medical Council of India Registration",
                        issuer="Medical Council of India",
                        license_number="12345",
                        issued_at=date(2010, 7, 1),
                        expires_at=date(2030, 7, 1),
                        verification_status="verified",
                        verified_at=date(2010, 7, 15),
                    )
                ],
                job_preferences=["FULL_TIME", "HOSPITAL", "DAY_SHIFT"],
                certifications=[
                    Certification(
                        name="Advanced Cardiac Life Support",
                        issuer="American Heart Association",
                        certification_url="https://example.com/acls/12345",
                        created_at=date(2015, 1, 1),
                        expires_at=date(2025, 1, 1),
                    )
                ],
            ),
            # Profile 2: Matches some criteria
            Profile(
                gender="FEMALE",
                date_of_birth=date(1988, 6, 15),
                address="Mumbai, Maharashtra",
                marital_status="SINGLE",
                category="GENERAL",
                locations_open_to_work=["Mumbai", "Pune", "Delhi"],
                open_to_relocation_anywhere=True,
                education=[
                    Education(
                        degree="MBBS",
                        institution="Grant Medical College",
                        started_at=date(2008, 7, 1),
                        completed_at=date(2012, 6, 30),
                    ),
                    Education(
                        degree="MD",
                        institution="KEM Hospital",
                        started_at=date(2012, 7, 1),
                        completed_at=date(2017, 6, 30),
                    ),
                ],
                languages=[
                    Language(name="English", proficiency="NATIVE"),
                    Language(name="Hindi", proficiency="PROFESSIONAL"),
                    Language(name="Marathi", proficiency="PROFESSIONAL"),
                ],
                work_experience=[
                    WorkExperience(
                        title="Resident Doctor",
                        organization="KEM Hospital",
                        started_at=date(2012, 7, 1),
                        completed_at=date(2017, 6, 30),
                        employment_type="FULL_TIME",
                        skills=["General Medicine", "Patient Care"],
                    ),
                    WorkExperience(
                        title="Consultant",
                        organization="Apollo Hospital, Mumbai",
                        started_at=date(2017, 7, 1),
                        completed_at=None,  # Current job
                        employment_type="FULL_TIME",
                        skills=["Internal Medicine", "Critical Care"],
                    ),
                ],
                salary_expectations=SalaryExpectations(
                    preferred_monthly_salary_inr=175000,  # 1.75L/month
                    negotiable=True,
                ),
                licenses=[
                    License(
                        name="Medical Council of India Registration",
                        issuer="Medical Council of India",
                        license_number="67890",
                        issued_at=date(2012, 7, 1),
                        expires_at=date(2032, 7, 1),
                        verification_status="verified",
                        verified_at=date(2012, 7, 15),
                    )
                ],
                job_preferences=[
                    "FULL_TIME",
                    "PART_TIME",
                    "HOSPITAL",
                    "DAY_SHIFT",
                    "NIGHT_SHIFT",
                ],
                certifications=[
                    Certification(
                        name="Basic Life Support",
                        issuer="Indian Red Cross Society",
                        certification_url="https://example.com/bls/67890",
                        created_at=date(2012, 7, 1),
                        expires_at=date(2024, 7, 1),
                    )
                ],
            ),
            # Profile 3: Doesn't match most criteria
            Profile(
                gender="MALE",
                date_of_birth=date(1990, 3, 20),
                address="Bangalore, Karnataka",
                marital_status="SINGLE",
                category="GENERAL",
                locations_open_to_work=["Bangalore", "Hyderabad"],
                open_to_relocation_anywhere=False,
                education=[
                    Education(
                        degree="MBBS",
                        institution="Bangalore Medical College",
                        started_at=date(2010, 7, 1),
                        completed_at=date(2015, 6, 30),
                    ),
                    Education(
                        degree="MD",
                        institution="St. John's Medical College",
                        started_at=date(2015, 7, 1),
                        completed_at=date(2020, 6, 30),
                    ),
                ],
                languages=[
                    Language(name="English", proficiency="NATIVE"),
                    Language(name="Kannada", proficiency="NATIVE"),
                ],
                work_experience=[
                    WorkExperience(
                        title="Resident Doctor",
                        organization="St. John's Hospital",
                        started_at=date(2015, 7, 1),
                        completed_at=date(2020, 6, 30),
                        employment_type="FULL_TIME",
                        skills=["General Medicine", "Patient Care"],
                    ),
                    WorkExperience(
                        title="Consultant",
                        organization="Manipal Hospital",
                        started_at=date(2020, 7, 1),
                        completed_at=None,  # Current job
                        employment_type="FULL_TIME",
                        skills=["Internal Medicine", "Emergency Care"],
                    ),
                ],
                salary_expectations=SalaryExpectations(
                    preferred_monthly_salary_inr=150000,  # 1.5L/month
                    negotiable=True,
                ),
                licenses=[
                    License(
                        name="Medical Council of India Registration",
                        issuer="Medical Council of India",
                        license_number="54321",
                        issued_at=date(2015, 7, 1),
                        expires_at=date(2035, 7, 1),
                        verification_status="verified",
                        verified_at=date(2015, 7, 15),
                    )
                ],
                job_preferences=["FULL_TIME", "HOSPITAL", "DAY_SHIFT"],
                certifications=[
                    Certification(
                        name="Basic Life Support",
                        issuer="Indian Red Cross Society",
                        certification_url="https://example.com/bls/54321",
                        created_at=date(2015, 7, 1),
                        expires_at=date(2025, 7, 1),
                    )
                ],
            ),
        ]

        # Insert profiles
        for profile in profiles:
            await profile.insert()
            print(f"Inserted profile: {profile.id}")


async def test_filter_job():
    """Test the filter job functionality."""
    # Create filter job crew
    crew = FilterJobCrew()

    # Test query
    query = "I want a doctor from Bangalore who is willing to work for 2 lakhs a month, who graduated from some college and has some work experience"

    # Run the filter job
    result = await crew.run(query)

    # Print results
    print("\nFilter Job Results:")
    print(f"Query: {result.query}")
    print(f"Total matches found: {result.total_matches}")
    print(f"Execution time: {result.execution_time:.2f} seconds")
    print("\nTop matches:")
    for match in result.matches:
        print(f"\nProfile ID: {match.profile_id}")
        print(f"Match score: {match.score:.2f}")
        print("Match reasons:")
        for reason in match.match_reasons:
            print(f"- {reason}")


async def main():
    """Main function to run the test."""
    print("Inserting test profiles...")
    await insert_test_profiles()

    print("\nTesting filter job...")
    async with initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    ):
        await test_filter_job()


if __name__ == "__main__":
    asyncio.run(main())
