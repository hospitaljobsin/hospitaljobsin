import hashlib
import secrets
from datetime import datetime, timedelta

from beanie import WriteRules

from app.accounts.documents import Account
from app.auth.documents import PasswordResetToken, Session
from app.lib.constants import PASSWORD_RESET_EXPIRES_IN, USER_SESSION_EXPIRES_IN


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

    async def get(self, token: str) -> PasswordResetToken | None:
        """Get password reset token by token."""
        return await PasswordResetToken.find_one(
            PasswordResetToken.token_hash == self.hash_password_reset_token(token),
        )

    async def delete(self, token: str) -> None:
        """Delete password reset token by token."""
        await PasswordResetToken.find_one(
            PasswordResetToken.token_hash == self.hash_password_reset_token(token),
        ).delete()
