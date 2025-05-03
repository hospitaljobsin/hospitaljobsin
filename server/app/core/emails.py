from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

from aiosmtplib import SMTP
from jinja2 import Environment
from types_aiobotocore_ses import SESClient

from app.config import EmailSettings


@asynccontextmanager
async def create_smtp_client(settings: EmailSettings) -> AsyncGenerator[SMTP, None]:
    """Create an SMTP client."""
    if settings.email_username and settings.email_password:
        smtp_client = SMTP(
            hostname=settings.email_host,
            port=settings.email_port,
            password=settings.email_password.get_secret_value(),
            username=settings.email_username,
        )
    else:
        smtp_client = SMTP(
            hostname=settings.email_host,
            port=settings.email_port,
        )

    async with smtp_client:
        yield smtp_client


class BaseEmailSender:
    """Base email sender class."""

    def __init__(
        self,
        environment: Environment,
        settings: EmailSettings,
    ) -> None:
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
        raise NotImplementedError


class SMTPEmailSender(BaseEmailSender):
    """SMTP Email sender class."""

    def __init__(
        self,
        smtp_client: SMTP,
        environment: Environment,
        settings: EmailSettings,
    ) -> None:
        super().__init__(
            environment=environment,
            settings=settings,
        )
        self._smtp_client = smtp_client

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

        await self._smtp_client.send_message(message)


class SESEmailSender(BaseEmailSender):
    """SES Email sender class."""

    def __init__(
        self,
        ses_client: SESClient,
        environment: Environment,
        settings: EmailSettings,
    ) -> None:
        super().__init__(
            environment=environment,
            settings=settings,
        )
        self._ses_client = ses_client

    async def send_email(
        self,
        sender: str,
        receiver: str,
        subject: str,
        text: str,
        html: str,
    ) -> None:
        """Send an email via SMTP."""
        await self._ses_client.send_email(
            Source=sender,
            Destination={
                "ToAddresses": [receiver],
            },
            Message={
                "Subject": {
                    "Data": subject,
                    "Charset": "UTF-8",
                },
                "Body": {
                    "Text": {
                        "Data": text,
                        "Charset": "UTF-8",
                    },
                    "Html": {
                        "Data": html,
                        "Charset": "UTF-8",
                    },
                },
            },
        )
