import httpx
from jinja2 import Environment

from app.config import SecretSettings, WhatsappSettings


class BaseMessageSender:
    """Base Message sender class."""

    def __init__(
        self,
        environment: Environment,
    ) -> None:
        self._environment = environment

    async def send_message(
        self,
        receiver: str,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a message."""
        raise NotImplementedError


class DummyMessageSender(BaseMessageSender):
    """Dummy Message sender class."""

    def __init__(
        self,
        environment: Environment,
    ) -> None:
        super().__init__(
            environment=environment,
        )

    async def send_message(
        self,
        receiver: str,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a dummy message."""
        url = "http://localhost:4444/sms/send"
        headers = {"Content-Type": "application/json"}
        data = {
            "phone_number": receiver,
            "template_name": template_name,
            "parameters": parameters,
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()


class WhatsappMessageSender(BaseMessageSender):
    """Whatsapp Message sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: WhatsappSettings,
        secret_settings: SecretSettings,
    ) -> None:
        super().__init__(
            environment=environment,
        )
        self._settings = settings
        self._secret_settings = secret_settings

    async def send_message(
        self,
        receiver: str,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a Whatsapp message."""
        url = f"https://graph.facebook.com/v22.0/{self._settings.whatsapp_phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self._secret_settings.whatsapp_access_token.get_secret_value()}",
            "Content-Type": "application/json",
        }
        data = {
            "messaging_product": "whatsapp",
            "to": receiver,  # Add the recipient's WhatsApp number here in international format, e.g., "1234567890"
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": "en_US"},
                "components": [
                    {
                        "type": "body",
                        "parameters": parameters,
                        # "parameters": [
                        #     {
                        #         "type": "text",
                        #         "parameter_name": "customer_name",
                        #         "text": "John",
                        #     },
                        #     {
                        #         "type": "text",
                        #         "parameter_name": "order_id",
                        #         "text": "9128312831",
                        #     },
                        # ],
                    }
                ],
            },
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
