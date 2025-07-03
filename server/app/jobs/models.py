from pydantic import BaseModel


class JobApplicantAnalysisEventBody(BaseModel):
    account_id: str
    job_id: str
