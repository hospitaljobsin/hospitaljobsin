import asyncio
import dataclasses
import time

import aioinject
from strawberry.dataloader import DataLoader


@dataclasses.dataclass
class Job:
    pass


@dataclasses.dataclass
class Client:
    pass


def create_client() -> Client:
    return Client()


@dataclasses.dataclass
class EmbeddingsService:
    genai_client: Client


class JobRepo:
    # the deps here don't matter ig
    def __init__(self, embeddings_service: EmbeddingsService) -> None:
        self._embeddings_service = embeddings_service


class JobApplicantRepo:
    # the deps here don't matter ig
    def __init__(self, embeddings_service: EmbeddingsService) -> None:
        self._embeddings_service = embeddings_service


type JobBySlugLoader = DataLoader[str, Job | None]


async def create_job_by_slug_dataloader(
    job_repo: JobRepo,
) -> JobBySlugLoader:
    """Create a dataloader to load job applicants by their slugs."""
    pass


type JobByIdLoader = DataLoader[str, Job | None]


async def create_job_by_id_dataloader(
    job_repo: JobRepo,
) -> JobByIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    pass


type JobApplicantBySlugLoader = DataLoader[str, Job | None]


async def create_job_applicant_by_slug_dataloader(
    job_applicant_repo: JobApplicantRepo,
) -> JobApplicantBySlugLoader:
    """Create a dataloader to load job applicants by their slugs."""
    pass


type JobApplicantByIdLoader = DataLoader[str, Job | None]


async def create_job_applicant_by_id_dataloader(
    job_applicant_repo: JobApplicantRepo,
) -> JobApplicantByIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    pass


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: JobByIdLoader
    job_by_slug: JobBySlugLoader
    job_applicant_by_id: JobApplicantByIdLoader
    job_applicant_by_slug: JobApplicantBySlugLoader


def create_dataloaders(
    job_by_id: JobByIdLoader,
    job_by_slug: JobBySlugLoader,
    job_applicant_by_id: JobApplicantByIdLoader,
    job_applicant_by_slug: JobApplicantBySlugLoader,
) -> Dataloaders:
    """Create dataloaders for the current context."""
    return Dataloaders(
        job_by_id=job_by_id,
        job_by_slug=job_by_slug,
        job_applicant_by_id=job_applicant_by_id,
        job_applicant_by_slug=job_applicant_by_slug,
    )


def create_container() -> aioinject.Container:
    container = aioinject.Container()
    container.register(aioinject.Singleton(create_client))
    container.register(aioinject.Singleton(EmbeddingsService))
    container.register(aioinject.Singleton(JobRepo))
    container.register(aioinject.Singleton(JobApplicantRepo))
    container.register(aioinject.Scoped(create_job_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_by_slug_dataloader))
    container.register(aioinject.Scoped(create_job_applicant_by_id_dataloader))
    container.register(aioinject.Scoped(create_job_applicant_by_slug_dataloader))
    container.register(aioinject.Scoped(create_dataloaders))
    return container


async def main() -> None:
    async with create_container() as container:
        # async with container.context() as ctx:
        #     await ctx.resolve(genai.Client)

        async with container.context() as ctx:
            await ctx.resolve(JobApplicantRepo)
            await ctx.resolve(JobByIdLoader)
            t = time.perf_counter()
            await ctx.resolve(Dataloaders)
            print(time.perf_counter() - t)


asyncio.run(main())
