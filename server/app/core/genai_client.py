from google.genai import Client

from app.config import SecretSettings


def create_google_genai_client(settings: SecretSettings) -> Client:
    """Create a Google GenAI client."""
    return Client(api_key=settings.google_api_key.get_secret_value())
