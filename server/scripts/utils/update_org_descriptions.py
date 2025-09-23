import asyncio

from app.config import DatabaseSettings, get_settings
from app.core.formatting import clean_markdown_text, markdown_to_clean_html
from app.database import initialize_database
from app.organizations.documents import Organization


async def add_cleaned_job_descriptions():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    orgs = await Organization.find().to_list()

    for org in orgs:
        if org.description is None:
            continue
        org.description_cleaned = clean_markdown_text(org.description)
        org.description_html = markdown_to_clean_html(org.description)
        await org.save()
        print(f"Saved org {org.id}")

    print("Done")


if __name__ == "__main__":
    asyncio.run(add_cleaned_job_descriptions())
