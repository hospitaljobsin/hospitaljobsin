from uuid import uuid4

from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.repositories import AccountRepo, ProfileRepo
from app.auth.documents import WebAuthnCredential
from app.auth.repositories import (
    OauthCredentialRepo,
    RecoveryCodeRepo,
    WebAuthnCredentialRepo,
)
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
    ) -> None:
        self._account_repo = account_repo
        self._profile_repo = profile_repo
        self._webauthn_credential_repo = webauthn_credential_repo
        self._recovery_code_repo = recovery_code_repo
        self._oauth_credential_repo = oauth_credential_repo

    async def create_account(self, data: CreateTestUserSchema) -> TestUserSchema:
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
                credential_id=b"\xe0\xac\x13K\xa6:\x1f7{/\xa8\xa3\xc1\x97v2",
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

        return TestUserSchema(
            id=account.id,
            username=account.username,
            email=account.email,
            is_active=account.is_active,
            two_factor_secret=account.two_factor_secret,
            created_at=account.created_at,
            updated_at=account.updated_at,
            auth_providers=account.auth_providers,
            recovery_codes=recovery_codes,
            has_2fa_enabled=account.has_2fa_enabled,
            webauthn_credentials=[
                WebAuthnCredentialSchema(
                    backed_up=webauthn_credential.backed_up,
                    credential_id=webauthn_credential.credential_id,
                    public_key=webauthn_credential.credential_public_key,
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
