from app.accounts.repositories import AccountRepo
from app.auth.repositories import (
    TwoFactorAuthenticationChallengeRepo,
    WebAuthnCredentialRepo,
)
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

        two_factor_account = await account_repo.create(
            email="twofactor-tester@example.org",
            full_name="Two Factor Tester",
            auth_providers=["password"],
            password="Password123!",
        )

        webauthn_credential_repo = WebAuthnCredentialRepo()

        await webauthn_credential_repo.create(
            account_id=webauthn_account.id,
            credential_id=b"\xe0\xac\x13K\xa6:\x1f7{/\xa8\xa3\xc1\x97v2",
            credential_public_key=b"\x04}ZJc\x0e\x13U\x9a\xddI\xc6%\xe6v\xd5\xc5W\xd5\xf8\xea\x97\x9f\x99\xfd\xb3S\x903\x14\xf73H\xbbi\xa5U\xdd\xf6-\xa0\xcc\xa0\xa5\xbeG\xa7\xa0D\xaf\xbd\xd3\x9a\x17o}[Q\xa9\xf11\x12y\nq",
            sign_count=0,
            backed_up=False,
            device_type="platform",
            nickname="My Passkey",
            transports=[AuthenticatorTransport.INTERNAL],
        )

        two_factor_challenge_repo = TwoFactorAuthenticationChallengeRepo()
        (_challenge, two_factor_challenge) = await two_factor_challenge_repo.create(
            account=two_factor_account,
        )

        await account_repo.set_two_factor_secret(
            account=two_factor_account,
            totp_secret=two_factor_challenge.totp_secret,
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
