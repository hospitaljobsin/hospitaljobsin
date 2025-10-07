import secrets
from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.repositories import WebAuthnCredentialRepo
from webauthn.helpers.structs import AuthenticatorTransport

from tests.utils.emails import generate_test_email


@pytest.fixture(scope="module")
async def password_account(account_repo: AccountRepo) -> AsyncGenerator[Account]:
    account = await account_repo.create(
        full_name="Aryan Iyappan",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    yield account
    await account_repo.delete(account)


@pytest.fixture(scope="module")
async def foreign_password_account(
    account_repo: AccountRepo,
) -> AsyncGenerator[Account]:
    account = await account_repo.create(
        full_name="Mark David",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password"],
    )
    yield account
    await account_repo.delete(account)


@pytest.fixture(scope="module")
async def webauthn_account(
    account_repo: AccountRepo,
    webauthn_credential_repo: WebAuthnCredentialRepo,
) -> AsyncGenerator[Account]:
    account = await account_repo.create(
        full_name="Jane Doe",
        email=generate_test_email(),
        password="Password123!",
        analytics_preference="acceptance",
        auth_providers=["password", "webauthn_credential"],
    )

    credential = await webauthn_credential_repo.create(
        account_id=account.id,
        credential_id=secrets.token_bytes(16),
        credential_public_key=b"\x04\x03O\xc0QU\xac-\xfdJ[O\xa8t&\xe30X#\r\x19\x9e\xa3W\x14\x08SM\xbf\x9b\x11\x16\x9e\x89\xb9j\xe4\xe2\x17\x9a\xe0Z\xc5\xcf\xc9\xfb/\x96B{\xed\x13\x84G\xca\xb6\xf9\xb9V\xff\xd1\x1f\x00\xb3l",
        sign_count=0,
        backed_up=False,
        device_type="platform",
        nickname="Test Passkey",
        transports=[AuthenticatorTransport.INTERNAL],
    )

    yield account
    await account_repo.delete(account)
    await webauthn_credential_repo.delete(credential)
