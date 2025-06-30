from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.providers.google_gla import GoogleGLAProvider

from app.accounts.documents import Gender, MaritalStatus
from app.config import SecretSettings


class LocationWithRadius(BaseModel):
    location: str = Field(
        ...,
        description="The location to search for, as a string. This can be a city, state, country, or a combination of these.",
    )
    radius: int = Field(
        default=50000,  # 50km
        description="The radius in meters to search within the location.",
    )


class ApplicantQueryFilters(BaseModel):
    """
    Represents parsed filters from a recruiter-style free-text query for applicant search.

    - query: A string suitable for vector search (e.g., degrees, institutions, employers, certifications, languages, licenses, skills, etc. that cannot be matched by explicit fields).
    - min_experience: Minimum years of experience required (if specified).
    - max_experience: Maximum years of experience allowed (if specified).
    - location: Location(s) specified in the query (if any), as a string or list of strings.
    - open_to_relocation_anywhere: Whether the applicant must be open to relocation anywhere (if specified).
    - gender: Gender requirement (if specified).
    - min_age: Minimum age required (if specified).
    - max_age: Maximum age allowed (if specified).
    - marital_status: Marital status requirement (if specified).
    - category: Reservation/diversity category (if specified).
    """

    query: str = Field(
        ...,
        description="A string for vector search, capturing implicit requirements (degrees, institutions, employers, certifications, languages, licenses, skills, etc.).",
    )
    min_total_work_experience_years: int | None = Field(
        default=None,
        description="Minimum years of total work experience required, if specified.",
    )
    max_total_work_experience_years: int | None = Field(
        default=None, description="Maximum years of experience allowed, if specified."
    )
    location: LocationWithRadius | list[LocationWithRadius] | None = Field(
        default=None,
        description="Location(s) along with radius, specified to narrow down applicants—i.e., where the applicant must be willing to work or relocate (not just any location mentioned in the query).",
    )
    open_to_relocation_anywhere: bool | None = Field(
        default=None,
        description="Whether the applicant must be open to relocation anywhere, if specified.",
    )
    gender: Gender | None = Field(
        default=None, description="Gender requirement, if specified."
    )
    min_age: int | None = Field(
        default=None, description="Minimum age required, if specified."
    )
    max_age: int | None = Field(
        default=None, description="Maximum age allowed, if specified."
    )
    marital_status: MaritalStatus | None = Field(
        default=None, description="Marital status requirement, if specified."
    )
    category: str | None = Field(
        default=None, description="Reservation/diversity category, if specified."
    )

    # TODO: add fields to determine:
    # -additional_rag_needed: bool
    # - rag_instructions: str
    # We need to figure out how to handle pagination with RAG tho, cause its on the fly and results might change for the same query/ filters


type ApplicantQueryParserAgent = Agent[None, ApplicantQueryFilters]


def create_applicant_query_parser_agent(
    settings: SecretSettings,
) -> ApplicantQueryParserAgent:
    return Agent(
        model=GeminiModel(
            "gemini-2.5-flash-lite-preview-06-17",
            provider=GoogleGLAProvider(
                api_key=settings.google_api_key.get_secret_value(),
            ),
        ),
        output_type=ApplicantQueryFilters,
        system_prompt=(
            "You are an expert in parsing natural language into search filters. You are given a free-text query describing the kind of applicants to search for. "
            "Your job is to parse this text and extract the following filters as structured data: "
            "(1) query: a string suitable for vector search (capture degrees, institutions, employers, certifications, languages, licenses, skills, etc. that cannot be matched by explicit fields), "
            "(2) min_experience: minimum years of experience required (if specified), "
            "(3) max_experience: maximum years of experience allowed (if specified), "
            "(4) location: location(s) specified in the query (as a string or list of strings, if any), "
            "(5) open_to_relocation_anywhere: whether the applicant must be open to relocation anywhere (if specified), "
            "(6) gender: gender requirement (if specified), "
            "(7) min_age: minimum age required (if specified), "
            "(8) max_age: maximum age allowed (if specified), "
            "(9) marital_status: marital status requirement (if specified), "
            "(10) category: reservation/diversity category (if specified). "
            "If a filter is not mentioned or is ambiguous, set it to null (except for 'query', which should always be present and summarize the implicit requirements for vector search). "
            "Be robust to ambiguous or missing information. Do not hallucinate details. "
            "Strictly avoid inferring, inventing, or hallucinating any information that is not explicitly present or clearly implied in the input. "
            "If you are unsure about a filter, set it to null. Only extract what is directly stated or unambiguously implied. "
        ),
    )
