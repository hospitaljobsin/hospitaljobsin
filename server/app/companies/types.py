from collections.abc import Iterable
from typing import Self

import strawberry
from strawberry import relay

from app.base.types import AddressType, BaseNodeType
from app.companies.documents import Company
from app.context import Info
from app.database.paginator import PaginatedResult


@strawberry.type(name="Company")
class CompanyType(BaseNodeType[Company]):
    name: str
    description: str
    address: AddressType
    phone: str
    website: str
    email: str
    logo_url: str | None

    @classmethod
    def marshal(cls, company: Company) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(company.id),
            name=company.name,
            description=company.description,
            address=AddressType.marshal(company.address),
            phone=company.phone,
            website=company.website,
            email=company.email,
            logo_url=company.logo_url,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        companies = await info.context["loaders"].company_by_id.load_many(node_ids)
        return [
            cls.marshal(company) if company is not None else company
            for company in companies
        ]


@strawberry.type(name="CompanyConnection")
class CompanyConnectionType(relay.Connection[CompanyType]):
    @classmethod
    def from_paginated_result(
        cls, paginated_result: PaginatedResult[Company, str]
    ) -> Self:
        return cls(
            page_info=relay.PageInfo(
                has_next_page=paginated_result.page_info.has_next_page,
                has_previous_page=paginated_result.page_info.has_previous_page,
                start_cursor=relay.to_base64(
                    CompanyType,
                    paginated_result.page_info.start_cursor,
                )
                if paginated_result.page_info.start_cursor
                else None,
                end_cursor=relay.to_base64(
                    CompanyType,
                    paginated_result.page_info.end_cursor,
                )
                if paginated_result.page_info.end_cursor
                else None,
            ),
            edges=[
                relay.Edge(
                    node=CompanyType.marshal(company),
                    cursor=relay.to_base64(CompanyType, company.id),
                )
                for company in paginated_result.entities
            ],
        )
