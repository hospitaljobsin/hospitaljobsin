from mailinator.mailinator import Mailinator

from app.config import MailinatorSettings


def create_mailinator_client(settings: MailinatorSettings) -> Mailinator:
    """Create a mailinator client."""
    return Mailinator(
        token=settings.mailinator_api_key.get_secret_value(),
    )
