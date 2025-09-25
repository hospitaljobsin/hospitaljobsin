import httpx
import phonenumbers
from phonenumbers import PhoneNumber, PhoneNumberFormat

from app.config import TwoFactorINSettings


class BaseMessageSender:
    """Base Message sender class."""

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
        two_factor_in_settings: TwoFactorINSettings,
    ) -> None:
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
            response.raise_for_status()


class SMSCatcherMessageSender(BaseMessageSender):
    """SMS catcher Message sender class."""

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
            "phone_number": phonenumbers.format_number(
                receiver, PhoneNumberFormat.E164
            ),
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


class DummyMessageSender(BaseMessageSender):
    """Dummy Message sender class."""

    async def send_message(
        self,
        receiver: PhoneNumber,
        template_name: str,
        parameters: list[dict[str, str]],
    ) -> None:
        """Send a dummy message."""

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
