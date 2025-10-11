from datetime import date

from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.settings import ModelSettings

from app.accounts.documents import (
    CareerProfile,
    Certification,
    Education,
    Language,
    WorkExperience,
)
from app.core.constants import GenderType, JobKindType, MaritalStatusType, WorkModeType


class RecommendedJobAlert(BaseModel):
    search_term: str = Field(
        ...,
        description="Generate a relevant job search term based on the candidate's experience, skills, and career profile from their resume.",
    )
    location: str = Field(
        ...,
        description="Suggest a job location based on the candidate's current address or work history from their resume (broader the better).",
    )
    min_experience: int | None = Field(
        None,
        description="Recommend minimum experience years based on the candidate's total work experience from their resume.",
    )
    max_experience: int | None = Field(
        None,
        description="Recommend maximum experience years based on the candidate's career level and aspirations from their resume.",
    )
    min_salary: int | None = Field(
        None,
        description="Suggest minimum salary expectations based on the candidate's experience and role level from their resume.",
    )
    max_salary: int | None = Field(
        None,
        description="Suggest maximum salary expectations based on the candidate's experience and role level from their resume.",
    )
    job_type: list[JobKindType] = Field(
        ...,
        description="Recommend suitable job types (a list of 'full_time', 'part_time', 'internship', 'contract' or 'locum') based on the candidate's career stage and preferences from their resume.",
    )
    work_mode: list[WorkModeType] = Field(
        ...,
        description="Suggest appropriate work modes (a list of 'remote', 'hybrid' or 'office') based on the candidate's experience and role type from their resume.",
    )


class PartialLicense(BaseModel):
    name: str = Field(..., description="The name of the license.")
    issuer: str = Field(..., description="The issuer of the license.")
    license_number: str = Field(..., description="The license number.")
    registration_year: int = Field(
        ..., description="The year the license was registered."
    )


class ProfileOutput(BaseModel):
    gender: GenderType | None = Field(
        ...,
        description="The gender of the applicant.",
    )
    date_of_birth: date | None = Field(
        ...,
        description="The date of birth of the applicant.",
    )
    address: str | None = Field(
        ...,
        description="The address of the applicant.",
    )
    marital_status: MaritalStatusType | None = Field(
        ...,
        description="The marital status of the applicant.",
    )
    category: str | None = Field(
        ...,
        description="The socio-economic category of the applicant (caste).",
    )
    education: list[Education] = Field(
        ...,
        description="The education of the applicant.",
    )
    licenses: list[PartialLicense] = Field(
        ...,
        description="The licenses of the applicant.",
    )
    languages: list[Language] = Field(
        ...,
        description="The languages of the applicant.",
    )
    job_preferences: list[str] = Field(
        ...,
        description="The job preferences of the applicant.",
    )
    work_experience: list[WorkExperience] = Field(
        ...,
        description="The work experience of the applicant.",
    )
    career_profile: CareerProfile | None = Field(
        ...,
        description="The career profile of the applicant.",
    )
    certifications: list[Certification] = Field(
        ...,
        description="The certifications of the applicant.",
    )
    professional_summary: str | None = Field(
        ...,
        description="The professional summary of the applicant.",
    )
    headline: str | None = Field(
        ...,
        description="The headline of the applicant.",
    )
    recommended_job_alerts: list[RecommendedJobAlert] = Field(
        default_factory=list,
        description="Generate personalized job alert recommendations only when the resume contains sufficient career information (skills, experience, education, or clear job preferences). Base alerts on the candidate's background and career trajectory.",
    )


type ProfileParserAgent = Agent[None, ProfileOutput]


def create_profile_parser_agent() -> ProfileParserAgent:
    return Agent(
        model="bedrock:us.amazon.nova-pro-v1:0",
        model_settings=ModelSettings(
            temperature=0.2,
        ),
        output_type=ProfileOutput,
        system_prompt=(
            "You are an expert information extraction agent.\n"
            "You will be given raw OCR text extracted from scanned resume PDFs.\n"
            "Your job is to extract structured information strictly according to the provided schema.\n\n"
            "EXTRACTION RULES:\n"
            "- Only extract data that is **explicitly and clearly** present in the text.\n"
            "- If a value is **missing**, **uncertain**, or **ambiguous**, set it to `null` (or empty list for list fields).\n"
            "- Do **not** infer or guess. Do **not** hallucinate plausible values.\n"
            "- Ignore decorative, irrelevant, or boilerplate text. Focus only on meaningful, resume-related content.\n"
            "- Be strict: partial or malformed data should be skipped or set to null.\n\n"
            "SPECIAL CASES:\n"
            "- For nested fields (education, work_experience, certifications, licenses, etc.), extract only if all required subfields are present.\n"
            "- For enums (gender, marital_status), match only known values. Return `null` if uncertain or non-standard.\n\n"
            "RECOMMENDED JOB ALERTS GENERATION:\n"
            "- Generate job alerts ONLY when the resume contains sufficient career information (work experience, skills, education, or clear job preferences).\n"
            "- If generating alerts, create 2-4 recommendations targeting different aspects of their background.\n"
            "- Base all recommendations strictly on actual resume content - skills, job titles, and experience mentioned.\n"
            "- Leave empty list if resume lacks sufficient career information for meaningful recommendations.\n\n"
            "Return a complete structured output with all fields defined. Leave nothing out — use `null` or `[]` where appropriate."
        ),
    )
