from datetime import date

from beanie import Document, Link

from app.companies.documents import Company


class Job(Document):
    title: str
    description: str
    location: str
    salary: str
    closing_date: date
    company: Link[Company]

    class Settings:
        name = "jobs"
