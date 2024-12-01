from datetime import date

import pymongo
from beanie import Document, Link
from pymongo import IndexModel

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
        indexes = [
            "title_text_description_text_company_text",  # name of the index
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("company", pymongo.TEXT),
                ],
                weights={
                    "title": 10,
                    "description": 5,
                },
            ),
        ]
