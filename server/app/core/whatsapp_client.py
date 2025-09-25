from typing import Any

import httpx
from phonenumbers import PhoneNumber

from app.config import WhatsappSettings


class WhatsappClient:
    def __init__(
        self,
        settings: WhatsappSettings,
    ) -> None:
        self._settings = settings

    async def send_message(
        self,
        receiver: PhoneNumber,
        template_name: str,
        parameters: list[dict[str, str]],
        additional_components: list[dict[str, Any]] = [],
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
                    },
                    *additional_components,
                ],
            },
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()

    async def send_job_alerts(
        self,
        receiver: PhoneNumber,
        name: str,
        organization_name: str,
        location: str,
        other_jobs_count: str,
        search_jobs_url: str,
    ) -> None:
        """Send a job alerts message."""
        await self.send_message(
            receiver=receiver,
            template_name="send_job_alerts",
            parameters=[
                {
                    "type": "text",
                    "parameter_name": "name",
                    "text": name,
                },
                {
                    "type": "text",
                    "parameter_name": "org_name_location",
                    "text": f"{organization_name}, {location}",
                },
                {
                    "type": "text",
                    "parameter_name": "other_jobs_count",
                    "text": other_jobs_count,
                },
            ],
            additional_components=[
                {
                    "type": "button",
                    "sub_type": "url",
                    "index": "0",
                    "parameters": [
                        {
                            "type": "text",
                            "text": search_jobs_url,
                        },
                    ],
                },
            ],
        )
