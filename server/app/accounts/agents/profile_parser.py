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
    MaritalStatus,
    SalaryExpectations,
    WorkExperience,
)
from app.config import SecretSettings


class PartialLicense(BaseModel):
    name: str = Field(..., description="The name of the license.")
    issuer: str = Field(..., description="The issuer of the license.")
    license_number: str = Field(..., description="The license number.")
    registration_year: int = Field(
        ..., description="The year the license was registered."
    )


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
            "Return a complete structured output with all fields defined. Leave nothing out — use `null` or `[]` where appropriate."
        ),
    )
