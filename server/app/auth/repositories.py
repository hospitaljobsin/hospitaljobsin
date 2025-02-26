import hashlib
import secrets
from datetime import datetime, timedelta

from beanie import WriteRules
from bson import ObjectId
from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.documents import Account
from app.auth.documents import (
    PasswordResetToken,
    Session,
    WebAuthnChallenge,
    WebAuthnCredential,
)
from app.lib.constants import (
    PASSWORD_RESET_EXPIRES_IN,
    USER_SESSION_EXPIRES_IN,
    WEBAUTHN_CHALLENGE_EXPIRES_IN,
)


class SessionRepo:
    async def create(
        self,
        account: Account,
        user_agent: str,
    ) -> str:
        """Create a new session."""
        session_token = self.generate_session_token()
        session = Session(
            account=account,
            token_hash=self.hash_session_token(
                token=session_token,
            ),
            expires_at=datetime.now()
            + timedelta(
                seconds=USER_SESSION_EXPIRES_IN,
            ),
            user_agent=user_agent,
        )

        await session.save(link_rule=WriteRules.WRITE)
        return session_token

    @staticmethod
    def generate_session_token() -> str:
        """Generate a new session token."""
        return secrets.token_hex(32)

    @staticmethod
    def hash_session_token(token: str) -> str:
        """Hash session token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()

    async def get(self, token: str) -> Session | None:
        """Get session by token."""
        return await Session.find_one(
            Session.token_hash == self.hash_session_token(token),
        )

    async def delete(self, token: str) -> None:
        """Delete session by token."""
        await Session.find_one(
            Session.token_hash == self.hash_session_token(token),
        ).delete()

    async def delete_all(self, account_id: ObjectId) -> None:
        """Delete all sessions for an account."""
        await Session.find_many(Session.account.id == account_id).delete()


class PasswordResetTokenRepo:
    async def create(
        self,
        account: Account,
    ) -> str:
        """Create a new password reset token."""
        token = self.generate_password_reset_token()
        token_hash = self.hash_password_reset_token(token)
        expires_at = datetime.now() + timedelta(seconds=PASSWORD_RESET_EXPIRES_IN)

        password_reset_token = PasswordResetToken(
            account=account,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        await password_reset_token.save(link_rule=WriteRules.WRITE)
        return token

    @staticmethod
    def generate_password_reset_token() -> str:
        """Generate a new password reset token."""
        return secrets.token_hex(32)

    @staticmethod
    def hash_password_reset_token(token: str) -> str:
        """Hash password reset token."""
        return hashlib.md5(token.encode("utf-8")).hexdigest()

    async def get(self, token: str, email: str) -> PasswordResetToken | None:
        """Get password reset token by token."""
        return await PasswordResetToken.find_one(
            PasswordResetToken.token_hash == self.hash_password_reset_token(token),
            PasswordResetToken.account.email == email,
            fetch_links=True,
            nesting_depth=1,
        )

    async def delete(self, token: str) -> None:
        """Delete password reset token by token."""
        await PasswordResetToken.find_one(
            PasswordResetToken.token_hash == self.hash_password_reset_token(token),
        ).delete()


class WebAuthnCredentialRepo:
    async def create(
        self,
        account_id: ObjectId,
        credential_id: bytes,
        credential_public_key: bytes,
        sign_count: int,
        device_type: str,
        backed_up: bool,
        transports: list[AuthenticatorTransport] | None = None,
    ) -> WebAuthnCredential:
        webauthn_credential = WebAuthnCredential(
            account=account_id,
            credential_id=credential_id,
            public_key=credential_public_key,
            sign_count=sign_count,
            device_type=device_type,
            transports=transports,
            backed_up=backed_up,
        )
        await webauthn_credential.save()
        return webauthn_credential

    async def update(
        self,
        *,
        webauthn_credential: WebAuthnCredential,
        sign_count: int,
    ) -> None:
        """Update the given WebAuthn credential."""
        webauthn_credential.sign_count = sign_count
        await webauthn_credential.save()

    async def get(self, credential_id: bytes) -> WebAuthnCredential | None:
        """Get WebAuthn credential by credential ID."""
        return await WebAuthnCredential.find_one(
            WebAuthnCredential.credential_id == credential_id,
            fetch_links=True,
            nesting_depth=1,
        )


class WebAuthnChallengeRepo:
    async def create(
        self, challenge: bytes, generated_account_id: ObjectId
    ) -> WebAuthnChallenge:
        expires_at = datetime.now() + timedelta(seconds=WEBAUTHN_CHALLENGE_EXPIRES_IN)
        webauthn_challenge = WebAuthnChallenge(
            challenge=challenge,
            generated_account_id=generated_account_id,
            expires_at=expires_at,
        )
        await webauthn_challenge.save()
        return webauthn_challenge

    async def get(self, challenge: bytes) -> WebAuthnChallenge | None:
        """Get WebAuthn challenge by challenge."""
        return await WebAuthnChallenge.find_one(
            WebAuthnChallenge.challenge == challenge,
        )

    async def delete(self, webauthn_challenge: WebAuthnChallenge) -> None:
        """Delete WebAuthn challenge by ID."""
        await webauthn_challenge.delete()
