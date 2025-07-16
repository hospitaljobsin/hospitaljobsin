from datetime import date

from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from pydantic_ai.settings import ModelSettings

from app.accounts.documents import (
    Certification,
    Education,
    Gender,
    Language,
    License,
    MaritalStatus,
    SalaryExpectations,
    WorkExperience,
)
from app.config import SecretSettings


class ProfileOutput(BaseModel):
    gender: Gender | None = Field(
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
    marital_status: MaritalStatus | None = Field(
        ...,
        description="The marital status of the applicant.",
    )
    category: str | None = Field(
        ...,
        description="The socio-economic category of the applicant (caste).",
    )
    locations_open_to_work: list[str] = Field(
        ...,
        description="The locations the applicant is open to work in.",
    )
    open_to_relocation_anywhere: bool = Field(
        ...,
        description="Whether the applicant is open to relocation anywhere.",
    )
    education: list[Education] = Field(
        ...,
        description="The education of the applicant.",
    )
    licenses: list[License] = Field(
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
    total_work_experience_years: float = Field(
        ...,
        description="The total work experience of the applicant.",
    )
    salary_expectations: SalaryExpectations | None = Field(
        ...,
        description="The salary expectations of the applicant.",
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


type ProfileParserAgent = Agent[None, ProfileOutput]


def create_profile_parser_agent(
    settings: SecretSettings,
) -> ProfileParserAgent:
    return Agent(
        model=GeminiModel(
            "gemini-2.5-flash-lite-preview-06-17",
            provider=GoogleGLAProvider(
                api_key=settings.google_api_key.get_secret_value(),
            ),
        ),
        model_settings=ModelSettings(
            temperature=0.1,
        ),
        output_type=ProfileOutput,
        system_prompt=(
            "You are an expert information extraction agent. "
            "You will be given raw OCR output from scanned resume PDFs. "
            "Your task is to extract ONLY the information that is explicitly present in the text, mapping it to the following structured fields: "
            "gender, date_of_birth, address, marital_status, category, locations_open_to_work, open_to_relocation_anywhere, education, licenses, languages, job_preferences, work_experience, total_work_experience_years, salary_expectations, certifications, professional_summary, headline. "
            "If any field is not present, is ambiguous, or cannot be confidently extracted, set it to null. "
            "Do NOT hallucinate, infer, or guess any information. Never fill in plausible values for missing data. "
            "Be robust to OCR errors, typos, and formatting issues. Ignore irrelevant or decorative text. "
            "Output only what is explicitly and unambiguously extractable from the input. "
            "If the input is not relevant/ no data cannot be extracted, return null for all fields. "
        ),
    )
