from pydantic import BaseModel


class JobApplicantAnalysisEventBody(BaseModel):
    account_id: str
    job_id: str


class JobAutocompleteSuggestion(BaseModel):
    job_id: str
    display_name: str
