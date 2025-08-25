from typing import Any

from aioinject import Injected
from aioinject.ext.fastapi import inject
from fastapi import APIRouter

from app.mailbox.messages import DummyMailbox

mailbox_router = APIRouter(prefix="/mailbox")


@mailbox_router.get("/messages")
@inject
async def get_messages(mailbox: Injected[DummyMailbox]) -> list[dict[str, Any]]:
    """Get all messages in JSON format with key details."""
    return await mailbox.get_messages()
