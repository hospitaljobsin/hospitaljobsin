import base64
import secrets
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi import Request
from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.repositories import AccountRepo, ProfileRepo
from app.auth.documents import WebAuthnCredential
from app.auth.repositories import (
    OauthCredentialRepo,
    RecoveryCodeRepo,
    SessionRepo,
    WebAuthnCredentialRepo,
)
from app.core.constants import SUDO_MODE_EXPIRES_IN
from app.core.formatting import format_datetime
from app.testing.schemas import (
    CreateTestUserSchema,
    TestUserSchema,
    WebAuthnCredentialSchema,
)


class TestSetupService:
    def __init__(
        self,
        account_repo: AccountRepo,
        profile_repo: ProfileRepo,
        webauthn_credential_repo: WebAuthnCredentialRepo,
        recovery_code_repo: RecoveryCodeRepo,
        oauth_credential_repo: OauthCredentialRepo,
        session_repo: SessionRepo,
    ) -> None:
        self._account_repo = account_repo
        self._profile_repo = profile_repo
        self._webauthn_credential_repo = webauthn_credential_repo
        self._recovery_code_repo = recovery_code_repo
        self._oauth_credential_repo = oauth_credential_repo
        self._session_repo = session_repo

    async def create_account(
        self,
        data: CreateTestUserSchema,
        request: Request,
        user_agent: str,
    ) -> TestUserSchema:
        """Create an account for E2E testing."""
        if "password" in data.auth_providers and data.password is None:
            raise ValueError(
                "Password must be provided if password auth provider is used."
            )

        account = await self._account_repo.create(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            auth_providers=data.auth_providers,
        )

        webauthn_credentials: list[WebAuthnCredential] = []
        # create auth providers
        if "webauthn_credential" in data.auth_providers:
            webauthn_credential = await self._webauthn_credential_repo.create(
                account_id=account.id,
                credential_id=secrets.token_bytes(16),
                credential_public_key=b"\x04}ZJc\x0e\x13U\x9a\xddI\xc6%\xe6v\xd5\xc5W\xd5\xf8\xea\x97\x9f\x99\xfd\xb3S\x903\x14\xf73H\xbbi\xa5U\xdd\xf6-\xa0\xcc\xa0\xa5\xbeG\xa7\xa0D\xaf\xbd\xd3\x9a\x17o}[Q\xa9\xf11\x12y\nq",
                sign_count=0,
                backed_up=False,
                device_type="platform",
                nickname="My Passkey",
                transports=[AuthenticatorTransport.INTERNAL],
            )
            webauthn_credentials.append(webauthn_credential)

        if "oauth_google" in data.auth_providers:
            await self._oauth_credential_repo.create(
                account_id=account.id,
                provider="google",
                provider_user_id=uuid4().hex,
            )

        # create profile
        await self._profile_repo.create(account=account)

        recovery_codes = []

        if data.two_factor_secret:
            await self._account_repo.set_two_factor_secret(
                account=account,
                totp_secret=data.two_factor_secret,
            )
            for digit in range(10):
                code = await self._recovery_code_repo.create(
                    account_id=account.id,
                    code=str(digit) * 8,
                )
                recovery_codes.append(code)

        # setup user session
        session_token = await self._session_repo.create(
            ip_address=request.client.host,
            user_agent=user_agent,
            account=account,
        )

        # set the session token
        request.session["session_token"] = session_token

        if data.enable_sudo_mode:
            sudo_mode_expires_at = datetime.now(UTC) + timedelta(
                seconds=SUDO_MODE_EXPIRES_IN
            )
            request.session["sudo_mode_expires_at"] = format_datetime(
                sudo_mode_expires_at
            )

        return TestUserSchema(
            id=str(account.id),
            email=account.email,
            full_name=account.full_name,
            two_factor_secret=account.two_factor_secret,
            created_at=account.id.generation_time,
            updated_at=account.updated_at,
            auth_providers=account.auth_providers,
            recovery_codes=recovery_codes,
            has_2fa_enabled=account.has_2fa_enabled,
            webauthn_credentials=[
                WebAuthnCredentialSchema(
                    backed_up=webauthn_credential.backed_up,
                    credential_id=base64.b64encode(webauthn_credential.credential_id),
                    public_key=webauthn_credential.public_key,
                    device_type=webauthn_credential.device_type,
                    sign_count=webauthn_credential.sign_count,
                    nickname=webauthn_credential.nickname,
                    transports=webauthn_credential.transports,
                    last_used_at=webauthn_credential.last_used_at,
                )
                for webauthn_credential in webauthn_credentials
            ],
            two_factor_providers=account.two_factor_providers,
        )
