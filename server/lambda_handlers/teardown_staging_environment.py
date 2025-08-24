import asyncio

from app.config import MailinatorSettings
from app.container import create_container
from aws_lambda_powertools.utilities.parser import event_parser
from mailinator.mailinator import Mailinator
from mailinator.message import DeleteDomainMessagesRequest
from pydantic import BaseModel
from tests.e2e.seed_data import teardown_test_database

# initialize container outside lambda handler to avoid re-initialization on each invocation
container = create_container()


class MyEvent(BaseModel):
    pass


@event_parser(model=MyEvent)
def lambda_handler(event: MyEvent, context):
    asyncio.run(teardown_staging_environment())
    return {"statusCode": 200, "body": "Staging environment teardown complete."}


async def teardown_staging_environment() -> None:
    await delete_mailinator_messages()
    await teardown_test_database()


async def delete_mailinator_messages() -> None:
    async with container.context() as ctx:
        settings = await ctx.resolve(MailinatorSettings)
        mailinator_client = await ctx.resolve(Mailinator)

        mailinator_client.request(
            DeleteDomainMessagesRequest(settings.mailinator_private_domain)
        )
