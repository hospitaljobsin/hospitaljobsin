from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider

from app.config import SecretSettings

# TODO: include screening questions here?


class MatchField(BaseModel):
    match: bool = Field(
        description="Whether the job applicant's field matches the job's field."
    )
    reason: str = Field(description="The reason for the match/ mismatch.")


class MatchFields(BaseModel):
    education: MatchField
    experience: MatchField
    skills: MatchField
    certifications: MatchField
    location: MatchField
    salary: MatchField
    job_type: MatchField
    languages: MatchField
    work_mode: MatchField
    currency: MatchField
    relocation: MatchField
    visa_sponsorship: MatchField
    visa_status: MatchField
    visa_type: MatchField


class JobApplicantAnalysis(BaseModel):
    score: float = Field(
        description="The score of the job applicant with respect to the job. A value between 0 and 1."
    )
    reason: str = Field(
        description="The reason for the score. Should summarize the match quality across all relevant fields."
    )
    fields: MatchFields = Field(
        description="A breakdown of whether the applicant matches the job across various criteria."
    )
    insights: list[str] = Field(
        default_factory=list,
        description="Additional insights, strengths, or standout factors about the applicant.",
    )
    risk_flags: list[str] = Field(
        default_factory=list,
        description="Potential risks or red flags in the applicant’s profile (e.g., job hopping, mismatched dates, lack of core skill).",
    )


type JobApplicantAnalyzerAgent = Agent[None, JobApplicantAnalysis]


def create_job_applicant_analyzer_agent(
    settings: SecretSettings,
) -> JobApplicantAnalyzerAgent:
    return Agent(
        model=GeminiModel(
            "gemini-2.5-flash-lite-preview-06-17",
            provider=GoogleGLAProvider(
                api_key=settings.google_api_key.get_secret_value(),
            ),
        ),
        output_type=JobApplicantAnalysis,
        system_prompt="You are a job applicant analyzer agent. You are given a job and a job applicant. You need to analyze the job applicant and provide a detailed analysis of the job applicant's profile with respect to the job.",
    )
