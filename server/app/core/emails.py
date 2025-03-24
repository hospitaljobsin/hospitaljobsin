from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

from aiosmtplib import SMTP
from jinja2 import Environment

from app.config import Settings


def create_smtp_client(settings: Settings) -> SMTP:
    """Create an SMTP client."""
    if settings.email_username and settings.email_password:
        return SMTP(
            hostname=settings.email_host,
            port=settings.email_port,
            password=settings.email_password.get_secret_value(),
            username=settings.email_username,
        )
    return SMTP(
        hostname=settings.email_host,
        port=settings.email_port,
    )


class EmailSender:
    """Email sender class."""

    def __init__(
        self,
        smtp_client: SMTP,
        environment: Environment,
        settings: Settings,
    ) -> None:
        self._smtp_client = smtp_client
        self._environment = environment
        self._default_sender = settings.email_from

    async def send_template_email(
        self,
        receiver: str,
        template: str,
        context: dict[str, Any],
        sender: str | None = None,
    ) -> None:
        """Send an email using a template."""
        subject_template = self._environment.get_template(
            name=f"emails/{template}/subject.txt",
        )

        text_template = self._environment.get_template(
            name=f"emails/{template}/body.txt",
        )

        html_template = self._environment.get_template(
            name=f"emails/{template}/body.html",
        )

        await self.send_email(
            sender=sender or self._default_sender,
            receiver=receiver,
            subject=subject_template.render(context),
            text=text_template.render(context),
            html=html_template.render(context),
        )

    async def send_email(
        self,
        sender: str,
        receiver: str,
        subject: str,
        text: str,
        html: str,
    ) -> None:
        """Send an email via SMTP."""
        message = MIMEMultipart("alternative")
        message["From"] = sender
        message["To"] = receiver
        message["Subject"] = subject
        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        async with self._smtp_client:
            await self._smtp_client.send_message(message)
