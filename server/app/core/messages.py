import httpx
import phonenumbers
from jinja2 import Environment
from phonenumbers import PhoneNumber, PhoneNumberFormat

from app.config import TwoFactorINSettings, WhatsappSettings


class BaseMessageSender:
    """Base Message sender class."""

    def __init__(
        self,
        environment: Environment,
    ) -> None:
        self._environment = environment

    async def send_message(
        self,
        receiver: PhoneNumber,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a message."""
        raise NotImplementedError

    async def send_otp_message(
        self,
        receiver: PhoneNumber,
        otp: str,
    ) -> None:
        """Send an OTP message."""
        raise NotImplementedError


class TwoFactorINSMSMessageSender(BaseMessageSender):
    """Two Factor IN SMS Message sender class."""

    def __init__(
        self,
        environment: Environment,
        two_factor_in_settings: TwoFactorINSettings,
    ) -> None:
        super().__init__(
            environment=environment,
        )
        self._two_factor_in_settings = two_factor_in_settings

    async def send_otp_message(
        self,
        receiver: PhoneNumber,
        otp: str,
    ) -> None:
        """Send a dummy message."""
        url = f"https://2factor.in/API/V1/{self._two_factor_in_settings.two_factor_in_api_key.get_secret_value()}/SMS/{phonenumbers.format_number(receiver, PhoneNumberFormat.E164)}/{otp}/OTP1"
        headers = {
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            print(response.json())
            response.raise_for_status()


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
        receiver: PhoneNumber,
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

    async def send_otp_message(
        self,
        receiver: PhoneNumber,
        otp: str,
    ) -> None:
        """Send an OTP message."""
        await self.send_message(
            receiver=receiver,
            template_name="login_code",
            parameters=[
                {
                    "type": "text",
                    "parameter_name": "code",
                    "text": otp,
                },
            ],
        )


class WhatsappMessageSender(BaseMessageSender):
    """Whatsapp Message sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: WhatsappSettings,
    ) -> None:
        super().__init__(
            environment=environment,
        )
        self._settings = settings

    async def send_message(
        self,
        receiver: PhoneNumber,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a Whatsapp message."""
        url = f"https://graph.facebook.com/v22.0/{self._settings.whatsapp_phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self._settings.whatsapp_access_token.get_secret_value()}",
            "Content-Type": "application/json",
        }
        data = {
            "messaging_product": "whatsapp",
            "to": receiver.national_number,
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

    async def send_otp_message(
        self,
        receiver: PhoneNumber,
        otp: str,
    ) -> None:
        """Send an OTP message."""
        await self.send_message(
            receiver=receiver,
            template_name="login_code",
            parameters=[
                {
                    "type": "text",
                    "parameter_name": "code",
                    "text": otp,
                },
            ],
        )
