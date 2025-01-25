from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

from aiosmtplib import SMTP

from app.config import settings
from app.lib.templates import environment

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


async def send_template_email(
    receiver: str,
    template: str,
    context: dict[str, Any],
    sender: str = settings.email_from,
) -> None:
    """Send an email using a template."""
    subject_template = environment.get_template(
        name=f"emails/{template}/subject.txt",
    )

    text_template = environment.get_template(
        name=f"emails/{template}/body.txt",
    )

    html_template = environment.get_template(
        name=f"emails/{template}/body.html",
    )

    await send_email(
        sender=sender,
        receiver=receiver,
        subject=subject_template.render(context),
        text=text_template.render(context),
        html=html_template.render(context),
    )


async def send_email(
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

    async with smtp_client:
        await smtp_client.send_message(message)
