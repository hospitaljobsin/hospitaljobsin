from beanie import PydanticObjectId
from beanie.operators import In
from bson import ObjectId

from app.database.paginator import PaginatedResult, Paginator

from .documents import Company


class CompanyRepo:
    async def create(
        self,
        name: str,
        description: str,
        address: str,
        city: str,
        postcode: int,
        country: str,
        phone: int,
        website: str,
        email: str,
    ) -> Company:
        """Create a new company."""
        company = Company(
            name=name,
            description=description,
            address=address,
            city=city,
            postcode=postcode,
            country=country,
            phone=phone,
            website=website,
            email=email,
        )

        return await company.insert()

    async def get(self, company_id: ObjectId) -> Company | None:
        """Get company by ID."""
        return await Company.get(company_id)

    async def update(
        self,
        company: Company,
        *,
        name: str,
        description: str,
        address: str,
        city: str,
        postcode: int,
        country: str,
        phone: str,
        website: str,
        email: str,
    ) -> Company:
        """Update the given company."""
        company.name = name
        company.description = description
        company.address = address
        company.city = city
        company.postcode = postcode
        company.country = country
        company.phone = phone
        company.website = website
        company.email = email
        return await company.save()

    async def get_many_by_ids(
        self, company_ids: list[ObjectId]
    ) -> list[Company | None]:
        """Get multiple companies by IDs."""
        companies = await Company.find(In(Company.id, company_ids)).to_list()
        company_by_id = {company.id: company for company in companies}

        return [
            company_by_id.get(PydanticObjectId(company_id))
            for company_id in company_ids
        ]

    async def get_all(
        self,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Company, ObjectId]:
        """Get a paginated result of companies."""

        paginator: Paginator[Company, ObjectId] = Paginator(
            reverse=True,
            document_cls=Company,
            paginate_by="id",
        )

        return await paginator.paginate(
            search_criteria=Company.find(),
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, company: Company) -> None:
        """Delete a company by ID."""
        await company.delete()
