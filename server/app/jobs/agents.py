from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider

from app.config import SecretSettings


class FieldAnalysis(BaseModel):
    """
    Represents the reasoning for a single healthcare-specific match criterion between a job applicant's profile and a job description.
    The criterion should be relevant to healthcare roles, such as 'Medical License', 'Specialization', 'Certifications', 'Years of Experience',
    'Shift Flexibility', 'Language Proficiency', 'Patient Care Experience', 'Board Certification', 'EMR Experience', etc.
    """

    criterion: str = Field(
        ...,
        description="The healthcare-specific criterion being analyzed (e.g., 'Medical License', 'Specialization', 'Years of Experience').",
    )
    analysis: str = Field(
        ...,
        description="Detailed explanation of how the applicant matches this criterion for the given job.",
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Numeric score (0-1) representing the degree of match for this criterion.",
    )


class JobApplicantAnalysisOutput(BaseModel):
    """
    Stores the AI-generated analytical summary for how well a job applicant's profile matches a specific healthcare job description.
    This model contains only synthesized insights about the match (not the profile itself) and does not duplicate or store raw profile fields.
    The agent should use stepwise thinking in its reasoning, but the schema only stores the final analysis per field as 'fields_analysis'.
    """

    analysed_fields: list[FieldAnalysis] | None = Field(
        default=None,
        description="List of healthcare-specific match analyses, one per criterion (e.g., 'Medical License', 'Specialization', etc.).",
    )
    overall_score: float | None = Field(
        default=None,
        description="Final score for the applicant's match to the job (0-1), synthesized after all field analyses.",
        ge=0.0,
        le=1.0,
    )
    overall_summary: str | None = Field(
        default=None,
        description="Summary reason for the overall match score, synthesized after all field analyses.",
    )
    strengths: list[str] | None = Field(
        default=None,
        description="List of strengths or standout factors identified in the match analysis.",
    )
    risk_flags: list[str] | None = Field(
        default=None,
        description="List of potential risks or red flags identified in the match analysis.",
    )
    model_config = {"extra": "ignore"}


type JobApplicantAnalyzerAgent = Agent[None, JobApplicantAnalysisOutput]


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
        output_type=JobApplicantAnalysisOutput,
        system_prompt=(
            "You are a job applicant analyzer agent. You are given a job description and a job applicant profile. "
            "Your task is to analyze how well the applicant matches the job, step by step, field by field, focusing on healthcare-specific criteria such as "
            "Medical License, Specialization, Certifications, Years of Experience, Shift Flexibility, Language Proficiency, Patient Care Experience, Board Certification, EMR Experience, and any other relevant fields. "
            "For each criterion, provide: (1) the criterion name, (2) a numeric score from 0 to 1 representing the degree of match, and (3) a brief analysis. "
            "Output these as a list of FieldAnalysis objects in the 'analysed_fields' field. "
            "After all field analyses, synthesize: (a) an overall_score (0-1), (b) an overall_summary, (c) a list of strengths, and (d) a list of risk_flags. "
            "Do not copy or store raw profile fields; only output the structured JobApplicantAnalysis object. "
            "Be accurate, avoid hallucination, and remember the analysis is about the match between the profile and the job, not the profile in isolation."
        ),
    )
