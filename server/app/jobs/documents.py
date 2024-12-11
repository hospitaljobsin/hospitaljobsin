from datetime import datetime
from typing import Literal

import pymongo
from beanie import Document, Link
from pymongo import IndexModel

from app.accounts.documents import Account
from app.base.models import Address
from app.companies.documents import Company


class Job(Document):
    title: str
    description: str | None = None
    category: str
    type: Literal["Full_time", "Part_time", "Internship", "Contract"]
    work_mode: Literal["remote", "hybrid", "office"]

    address: Address
    application: str
    skills: list[str]

    currency: Literal["INR"] = "INR"

    has_salary_range: bool = False
    min_salary: int | None = None
    max_salary: int | None = None

    has_experience_range: bool = False
    min_experience: int | None = None
    max_experience: int | None = None

    updated_at: datetime
    expires_at: datetime | None = None

    owner_account: Link[Account]
    company: Link[Company]

    class Settings:
        name = "jobs"

    class Config:
        indexes = [
            IndexModel(
                [
                    ("title", pymongo.TEXT),
                    ("description", pymongo.TEXT),
                    ("skills", pymongo.TEXT),
                ],
                weights={"title": 10, "description": 5},
                name="title_description_skills_text_index",
                default_language="english",
            ),
            IndexModel(
                [("category", pymongo.ASCENDING), ("city", pymongo.ASCENDING)],
                name="category_city_index",
            ),
            IndexModel(
                [("expired", pymongo.ASCENDING), ("deleted", pymongo.ASCENDING)],
                name="expired_deleted_index",
            ),
        ]
