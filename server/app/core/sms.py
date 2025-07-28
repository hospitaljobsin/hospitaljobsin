from jinja2 import Environment

from app.config import SMSSettings

# TODO: send messages using whatsapp rather than SMS- its cheaper, more reliable and efficient
# we need to register with DLTs for reliable SMS sending in India


class BaseSMSSender:
    """Base SMS sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: SMSSettings,
    ) -> None:
        self._environment = environment
        # self._default_sender = settings.email_from

    async def send_message(
        self,
        sender: str,
        receiver: str,
        text: str,
    ) -> None:
        """Send a SMS message."""
        raise NotImplementedError


class DummySMSSender(BaseSMSSender):
    """Dummy SMS sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: SMSSettings,
    ) -> None:
        super().__init__(
            environment=environment,
            settings=settings,
        )

    async def send_message(
        self,
        sender: str,
        receiver: str,
        text: str,
    ) -> None:
        """Send a dummy SMS message."""
        # TODO: probably make a HTTP request to some server
        # like mailcatcher


class DefaultSMSSender(BaseSMSSender):
    """Default SMS sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: SMSSettings,
    ) -> None:
        super().__init__(
            environment=environment,
            settings=settings,
        )

    async def send_message(
        self,
        sender: str,
        receiver: str,
        text: str,
    ) -> None:
        """Send a SMS message."""
        pass
