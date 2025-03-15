from app.accounts.repositories import AccountRepo
from app.auth.repositories import WebAuthnCredentialRepo
from app.config import Settings
from app.database import initialize_database
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from webauthn.helpers.structs import AuthenticatorTransport


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = Settings()
    async with initialize_database(
        database_url=str(settings.database_url),
    ):
        # Create test data
        account_repo = AccountRepo()
        await account_repo.create(
            email="tester@example.org",
            full_name="Tester",
            auth_providers=["password"],
            password="Password123!",
        )

        webauthn_account = await account_repo.create(
            email="webauthn-tester@example.org",
            full_name="WebAuthn Tester",
            auth_providers=["webauthn_credential"],
            account_id=ObjectId("60f1b9b3b3b3b3b3b3b3b3b3"),
        )

        webauthn_credential_repo = WebAuthnCredentialRepo()

        await webauthn_credential_repo.create(
            account_id=webauthn_account.id,
            credential_id=b"\xe0\xac\x13K\xa6:\x1f7{/\xa8\xa3\xc1\x97v2",
            credential_public_key=b"0Y0\x13\x06\x07*\x86H\xce=\x02\x01\x06\x08*\x86H\xce=\x03\x01\x07\x03B\x00\x04\xe9J\xd8\x1e(\x16\xf7\x96\x07\x83\xc3\xe7\xb3|\xf7Y\xeaqU\xc0E\x86G\x13\xec\x87\xfb\xb4LM\xdc\x8b\xb8\xeb\xc8\x8d\x03\x03?\xe2\x08\x17\xb9\xee\xac^\x0f\xb0\xee\xbeg\xa3\xc0v\x8f\xee4\x9c\xf1<P\x0bb\x9a",
            sign_count=0,
            backed_up=False,
            device_type="platform",
            nickname="My Passkey",
            transports=[AuthenticatorTransport.INTERNAL],
        )


async def teardown_test_database() -> None:
    """Remove e2e fixtures from test database."""
    # Get connection to database
    settings = Settings()
    client: AsyncIOMotorClient = AsyncIOMotorClient(str(settings.database_url))

    database = client.get_default_database()

    collections = await database.list_collection_names()

    for collection_name in collections:
        collection = database.get_collection(collection_name)
        await collection.delete_many({})

    # Close connection
    client.close()
