from google import genai

from app.config import SecretSettings


def create_google_genai_client(settings: SecretSettings) -> genai.Client:
    """Create a Google GenAI client."""
    return genai.Client(api_key=settings.google_api_key.get_secret_value())
