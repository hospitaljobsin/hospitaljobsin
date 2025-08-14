import asyncio

from aws_lambda_powertools.utilities.parser import event_parser
from pydantic import BaseModel
from tests.e2e.seed_data import teardown_test_database


class MyEvent(BaseModel):
    pass


@event_parser(model=MyEvent)
def lambda_handler(event: MyEvent, context):
    asyncio.run(teardown_test_database())
    return {"statusCode": 200, "body": "Test database cleanup complete."}
