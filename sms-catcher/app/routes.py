from datetime import UTC, datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

from app.templates import MESSAGE_TEMPLATES

router = APIRouter()

# In-memory storage for SMS messages
sms_messages: List[dict] = []


class Parameter(BaseModel):
    """Parameter model for incoming requests."""

    type: str = Field(..., description="Parameter type")
    parameter_name: str = Field(..., description="Parameter name")
    text: str = Field(..., description="Parameter text")


class SMSMessage(BaseModel):
    """SMS message model for incoming requests."""

    phone_number: str = Field(..., description="Phone number to send SMS to")
    template_name: str = Field(..., description="Template name")
    parameters: list[Parameter] = Field(..., description="Template parameters")
    sender: Optional[str] = Field(None, description="Sender identifier")


class SMSResponse(BaseModel):
    """SMS message response model."""

    id: str = Field(..., description="Unique message ID")
    phone_number: str = Field(..., description="Phone number")
    message: str = Field(..., description="Message content")
    sender: Optional[str] = Field(None, description="Sender identifier")
    created_at: datetime = Field(..., description="Message creation timestamp")
    status: str = Field(default="sent", description="Message status")


@router.get("/", response_class=HTMLResponse, summary="SMS Catcher Web Interface")
async def sms_interface(request: Request) -> HTMLResponse:
    """
    Serve the SMS Catcher web interface.

    Returns:
        HTMLResponse: The SMS Catcher web interface
    """
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMS Catcher</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            color: white;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            color: #666;
            margin-top: 5px;
        }

        .messages-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .messages-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .messages-header h2 {
            color: #333;
            font-weight: 500;
        }

        .clear-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.2s;
        }

        .clear-btn:hover {
            background: #c82333;
        }

        .messages-list {
            max-height: 600px;
            overflow-y: auto;
        }

        .message-item {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s;
        }

        .message-item:hover {
            background: #f8f9fa;
        }

        .message-item:last-child {
            border-bottom: none;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .message-phone {
            font-weight: 600;
            color: #333;
            font-size: 1.1rem;
        }

        .message-time {
            color: #666;
            font-size: 0.9rem;
        }

        .message-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 1rem;
            line-height: 1.5;
            color: #333;
        }

        .message-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            color: #666;
        }

        .message-sender {
            font-weight: 500;
        }

        .message-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .status-sent {
            background: #d4edda;
            color: #155724;
        }

        .delete-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background-color 0.2s;
        }

        .delete-btn:hover {
            background: #5a6268;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state h3 {
            margin-bottom: 10px;
            color: #333;
        }

        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
            margin-top: 20px;
        }

        .refresh-btn:hover {
            background: #0056b3;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .messages-header {
                flex-direction: column;
                gap: 10px;
                align-items: stretch;
            }

            .message-header {
                flex-direction: column;
                gap: 5px;
            }

            .message-meta {
                flex-direction: column;
                gap: 5px;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 SMS Catcher</h1>
            <p>Capture and view SMS messages in real-time</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-messages">0</div>
                <div class="stat-label">Total Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="unique-numbers">0</div>
                <div class="stat-label">Unique Numbers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="today-messages">0</div>
                <div class="stat-label">Today's Messages</div>
            </div>
        </div>

        <div class="messages-container">
            <div class="messages-header">
                <h2>📨 Messages</h2>
                <button class="clear-btn" onclick="clearAllMessages()">Clear All</button>
            </div>
            <div class="messages-list" id="messages-list">
                <div class="loading">Loading messages...</div>
            </div>
        </div>
    </div>

    <script>
        let messages = [];

        function formatTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;

            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        function updateStats() {
            const totalMessages = messages.length;
            const uniqueNumbers = new Set(messages.map(m => m.phone_number)).size;
            const today = new Date().toDateString();
            const todayMessages = messages.filter(m =>
                new Date(m.created_at).toDateString() === today
            ).length;

            document.getElementById('total-messages').textContent = totalMessages;
            document.getElementById('unique-numbers').textContent = uniqueNumbers;
            document.getElementById('today-messages').textContent = todayMessages;
        }

        function renderMessages() {
            const container = document.getElementById('messages-list');

            if (messages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No messages yet</h3>
                        <p>Send an SMS to see it appear here</p>
                        <button class="refresh-btn" onclick="loadMessages()">Refresh</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = messages.map(message => `
                <div class="message-item" data-id="${message.id}">
                    <div class="message-header">
                        <div class="message-phone">📞 ${message.phone_number}</div>
                        <div class="message-time">${formatTime(message.created_at)}</div>
                    </div>
                    <div class="message-content">${message.message}</div>
                    <div class="message-meta">
                        <div class="message-sender">
                            ${message.sender ? `From: ${message.sender}` : ''}
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="message-status status-sent">${message.status}</span>
                            <button class="delete-btn" onclick="deleteMessage('${message.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        async function loadMessages() {
            try {
                const response = await fetch('/sms/messages');
                if (response.ok) {
                    messages = await response.json();
                    renderMessages();
                    updateStats();
                } else {
                    console.error('Failed to load messages');
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        }

        async function deleteMessage(messageId) {
            try {
                const response = await fetch(`/sms/messages/${messageId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    messages = messages.filter(m => m.id !== messageId);
                    renderMessages();
                    updateStats();
                } else {
                    console.error('Failed to delete message');
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }

        async function clearAllMessages() {
            if (!confirm('Are you sure you want to delete all messages?')) {
                return;
            }

            try {
                const response = await fetch('/sms/messages', {
                    method: 'DELETE'
                });
                if (response.ok) {
                    messages = [];
                    renderMessages();
                    updateStats();
                } else {
                    console.error('Failed to clear messages');
                }
            } catch (error) {
                console.error('Error clearing messages:', error);
            }
        }

        // Load messages on page load
        loadMessages();

        // Auto-refresh every 5 seconds
        setInterval(loadMessages, 5000);
    </script>
</body>
</html>
    """
    return HTMLResponse(content=html_content)


@router.post("/sms/send", response_model=SMSResponse, summary="Send SMS message")
async def send_sms(sms: SMSMessage) -> SMSResponse:
    """
    Send an SMS message and store it in memory.

    Args:
        sms: SMS message data

    Returns:
        SMSResponse: Created message with ID and metadata
    """
    message_id = str(uuid4())
    current_time = datetime.now(UTC)

    # get message from template map
    message = MESSAGE_TEMPLATES[sms.template_name].format(
        **{parameter.parameter_name: parameter.text for parameter in sms.parameters}
    )

    message_data = {
        "id": message_id,
        "phone_number": sms.phone_number,
        "message": message,
        "sender": sms.sender,
        "created_at": current_time,
        "status": "sent",
    }

    sms_messages.append(message_data)

    return SMSResponse(**message_data)


@router.get(
    "/sms/messages", response_model=List[SMSResponse], summary="Get all SMS messages"
)
async def get_all_messages() -> List[SMSResponse]:
    """
    Retrieve all stored SMS messages.

    Returns:
        List[SMSResponse]: All stored messages
    """
    return [SMSResponse(**message) for message in sms_messages]


@router.get(
    "/sms/messages/{message_id}",
    response_model=SMSResponse,
    summary="Get SMS message by ID",
)
async def get_message_by_id(message_id: str) -> SMSResponse:
    """
    Retrieve a specific SMS message by its ID.

    Args:
        message_id: Unique message identifier

    Returns:
        SMSResponse: Message data

    Raises:
        HTTPException: If message not found
    """
    for message in sms_messages:
        if message["id"] == message_id:
            return SMSResponse(**message)

    raise HTTPException(status_code=404, detail="Message not found")


@router.delete("/sms/messages/{message_id}", summary="Delete SMS message by ID")
async def delete_message(message_id: str) -> dict:
    """
    Delete a specific SMS message by its ID.

    Args:
        message_id: Unique message identifier

    Returns:
        dict: Confirmation message

    Raises:
        HTTPException: If message not found
    """
    for i, message in enumerate(sms_messages):
        if message["id"] == message_id:
            deleted_message = sms_messages.pop(i)
            return {"message": "Message deleted successfully", "deleted_id": message_id}

    raise HTTPException(status_code=404, detail="Message not found")


@router.delete("/sms/messages", summary="Clear all SMS messages")
async def clear_all_messages() -> dict:
    """
    Delete all stored SMS messages.

    Returns:
        dict: Confirmation message
    """
    count = len(sms_messages)
    sms_messages.clear()
    return {"message": f"All {count} messages deleted successfully"}
