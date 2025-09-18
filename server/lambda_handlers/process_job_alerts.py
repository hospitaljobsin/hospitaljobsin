import asyncio
import json

from app.config import DatabaseSettings, EnvironmentSettings, get_settings
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.job_alerts.repositories import JobAlertRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from structlog import get_logger

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

# set up logging
setup_logging(
    human_readable=env_settings.debug,
)

# initialize container outside lambda handler to avoid re-initialization on each invocation
container = create_container()

logger = get_logger(__name__)


async def initialize_handler() -> None:
    database_settings = get_settings(DatabaseSettings)
    await initialize_database(
        database_url=str(database_settings.database_url),
        default_database_name=database_settings.default_database_name,
    )


# 🟢 Create a persistent event loop and use it both for init and handler
loop = asyncio.get_event_loop()

# ✅ run once per cold start
loop.run_until_complete(initialize_handler())


@event_source(data_class=EventBridgeEvent)
def lambda_handler(event: EventBridgeEvent, context: LambdaContext) -> str:
    """Lambda handler for the daily WhatsApp message generation cron job."""
    return loop.run_until_complete(send_job_alerts())


async def send_job_alerts() -> str:
    """Process the daily WhatsApp message generation job."""
    async with container.context() as ctx:
        job_alert_repo = await ctx.resolve(JobAlertRepo)

    # split job alerts into batches and put them into SQS queue.
    job_alerts = await job_alert_repo.get_all_list()
    return json.dumps({"status": "ok"})
