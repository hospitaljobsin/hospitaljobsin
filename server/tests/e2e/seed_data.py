from app.accounts.repositories import AccountRepo
from app.auth.repositories import RecoveryCodeRepo, WebAuthnCredentialRepo
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from webauthn.helpers.structs import AuthenticatorTransport


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = get_settings(DatabaseSettings)
    async with initialize_database(
        database_url=str(settings.database_url),
        default_database_name=settings.default_database_name,
    ):
        # Create test data
        account_repo = AccountRepo()
        await account_repo.create(
            email="tester@example.org",
            full_name="Tester 1",
            auth_providers=["password"],
            password="Password123!",
        )

        await account_repo.create(
            email="tester2@example.org",
            full_name="Tester 2",
            auth_providers=["password"],
            password="Password123!",
        )

        webauthn_account = await account_repo.create(
            email="webauthn-tester@example.org",
            full_name="WebAuthn Tester 1",
            auth_providers=["webauthn_credential"],
            account_id=ObjectId("60f1b9b3b3b3b3b3b3b3b3b3"),
        )

        two_factor_account_1 = await account_repo.create(
            email="twofactor-tester@example.org",
            full_name="Two Factor Tester 1",
            auth_providers=["password"],
            password="Password123!",
        )

        two_factor_account_2 = await account_repo.create(
            email="twofactor-tester2@example.org",
            full_name="Two Factor Tester 2",
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

        await account_repo.set_two_factor_secret(
            account=two_factor_account_1,
            totp_secret="RW5SJG5SRCHL3YEBPUOOIB6W5VDOF4MA",
        )

        await account_repo.set_two_factor_secret(
            account=two_factor_account_2,
            totp_secret="RW5SJG5SRCHL3YEBPUOOIB6W5VDOF4MA",
        )

        recovery_code_repo = RecoveryCodeRepo()

        await recovery_code_repo.create(
            account_id=two_factor_account_1.id,
            code="11111111",
        )

        await recovery_code_repo.create(
            account_id=two_factor_account_2.id,
            code="11111111",
        )


async def teardown_test_database() -> None:
    """Remove e2e fixtures from test database."""
    # Get connection to database
    settings = get_settings(DatabaseSettings)
    client: AsyncIOMotorClient = AsyncIOMotorClient(str(settings.database_url))

    database = client.get_default_database()

    collections = await database.list_collection_names()

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)

    # Close connection
    client.close()
