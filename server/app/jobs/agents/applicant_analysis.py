from pydantic import BaseModel, Field
from pydantic_ai import Agent


class FieldAnalysis(BaseModel):
    """
    Represents the reasoning for a single healthcare-specific match criterion between a job applicant's profile and a job description.

    The criterion should be relevant to healthcare roles, such as 'Medical License', 'Specialization', 'Certifications', 'Years of Experience',
    'Shift Flexibility', 'Language Proficiency', 'Patient Care Experience', 'Board Certification', 'EMR Experience', etc.
    """

    analysis: str = Field(
        ...,
        description="Short, concise, and actionable insight about how the applicant matches this criterion for the given job. Avoid detailed paragraphs; provide only brief, recruiter-relevant points.",
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Numeric score (0-1) representing the degree of match for this criterion.",
    )


class AnalysedFields(BaseModel):
    applicant_fields: FieldAnalysis | None = Field(
        description="List of applicant fields (screening questions) that were analysed.",
        default=None,
    )
    gender: FieldAnalysis | None = Field(
        description="The analysis of the applicant's gender match to the job.",
        default=None,
    )
    date_of_birth: FieldAnalysis | None = Field(
        description="The analysis of the applicant's date of birth match to the job.",
        default=None,
    )
    address: FieldAnalysis | None = Field(
        description="The analysis of the applicant's address match to the job.",
        default=None,
    )
    marital_status: FieldAnalysis | None = Field(
        description="The analysis of the applicant's marital status match to the job.",
        default=None,
    )
    category: FieldAnalysis | None = Field(
        description="The analysis of the applicant's category match to the job.",
        default=None,
    )
    locations_open_to_work: FieldAnalysis | None = Field(
        description="The analysis of the applicant's locations open to work match to the job.",
        default=None,
    )
    open_to_relocation_anywhere: FieldAnalysis | None = Field(
        description="The analysis of the applicant's open to relocation anywhere match to the job.",
        default=None,
    )
    education: FieldAnalysis | None = Field(
        description="The analysis of the applicant's education match to the job.",
        default=None,
    )
    licenses: FieldAnalysis | None = Field(
        description="The analysis of the applicant's licenses match to the job.",
        default=None,
    )
    languages: FieldAnalysis | None = Field(
        description="The analysis of the applicant's languages match to the job.",
        default=None,
    )
    job_preferences: FieldAnalysis | None = Field(
        description="The analysis of the applicant's job preferences match to the job.",
        default=None,
    )
    work_experience: FieldAnalysis | None = Field(
        description="The analysis of the applicant's work experience match to the job.",
        default=None,
    )
    salary_expectations: FieldAnalysis | None = Field(
        description="The analysis of the applicant's salary expectations match to the job.",
        default=None,
    )
    certifications: FieldAnalysis | None = Field(
        description="The analysis of the applicant's certifications match to the job.",
        default=None,
    )
    professional_summary: FieldAnalysis | None = Field(
        description="The analysis of the applicant's professional summary match to the job.",
        default=None,
    )
    headline: FieldAnalysis | None = Field(
        description="The analysis of the applicant's headline match to the job.",
        default=None,
    )


class JobApplicantAnalysisOutput(BaseModel):
    """
    Stores the AI-generated analytical summary for how well a job applicant's profile matches a specific healthcare job description.

    This model contains only synthesized insights about the match (not the profile itself) and does not duplicate or store raw profile fields.
    The agent should use stepwise thinking in its reasoning, but the schema only stores the final analysis per field as 'analysed_fields'.
    """

    analysed_fields: AnalysedFields = Field(
        description="Structured match analyses for each profile field, with a FieldAnalysis (or null if not applicable) for each.",
    )
    overall_summary: str = Field(
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
    overall_score: float = Field(
        description="Final score for the applicant's match to the job (0-1), synthesized after all field analyses.",
        ge=0.0,
        le=1.0,
    )
    model_config = {"extra": "ignore"}


type JobApplicantAnalyzerAgent = Agent[None, JobApplicantAnalysisOutput]


def create_job_applicant_analyzer_agent() -> JobApplicantAnalyzerAgent:
    return Agent(
        model="bedrock:us.amazon.nova-pro-v1:0",
        output_type=JobApplicantAnalysisOutput,
        system_prompt=(
            "You are a Senior Healthcare Recruiter. You are given a job description and a job applicant profile. "
            "Your task is to analyze how well the applicant matches the job, step by step, field by field, focusing on each field in the applicant's profile. "
            "Think step by step for each field: first, consider the job's requirements and the applicant's information, then reason about the match, and finally produce a short, concise, and actionable insight for the recruiter. Then score the field. "
            "For each profile field (gender, date_of_birth, address, marital_status, category, locations_open_to_work, open_to_relocation_anywhere, education, licenses, languages, job_preferences, work_experience, salary_expectations, certifications, professional_summary, headline), output a FieldAnalysis object (with 'analysis' and 'score') or null if not applicable, as a field on the AnalysedFields object. "
            "For the 'analysis' field, provide only short, concise, and actionable insights that are directly relevant to the recruiter—avoid detailed paragraphs or verbose explanations. Each analysis should be a brief point or sentence that helps the recruiter quickly understand the applicant's fit for the job. "
            "After all field analyses, synthesize: (a) an overall_summary, (b) a list of strengths, (c) a list of risk_flags and (d) an overall_score (0-1). For the overall summary, also think step by step: consider all field analyses, then synthesize the main reasons for the match score. "
            "Do not copy or store raw profile fields; only output the structured JobApplicantAnalysis object. "
            "Be accurate, avoid hallucination, and remember the analysis is about the match between the profile and the job, not the profile in isolation. "
            "Your summary and all analyses must always be professional, respectful, and never derogatory to any candidate. "
            "If a field or the overall score is low, explain the reasons in a positive, constructive, and encouraging manner, focusing on areas for growth or alignment rather than shortcomings. "
            "Never use negative or judgmental language; always frame feedback in a supportive and objective way."
        ),
    )
