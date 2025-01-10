import hashlib
import secrets
from datetime import datetime, timedelta

from beanie import WriteRules

from app.accounts.documents import Account
from app.auth.documents import Session
from app.lib.constants import USER_SESSION_EXPIRES_IN


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
