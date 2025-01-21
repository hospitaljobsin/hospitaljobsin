from authlib.integrations.starlette_client import OAuth

from app.config import settings

oauth_client = OAuth()

oauth_client.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
)
