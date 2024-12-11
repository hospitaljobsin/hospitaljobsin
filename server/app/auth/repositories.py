import secrets
from datetime import datetime, timedelta

from bson import ObjectId
from passlib.hash import sha256_crypt

from app.auth.documents import Session
from app.lib.constants import USER_SESSION_EXPIRES_IN


class SessionRepo:
    async def create(self, account_id: ObjectId) -> str:
        """Create a new session."""
        session_token = self.generate_session_token()
        session = Session(
            account_id=account_id,
            token_hash=self.hash_session_token(
                token=session_token,
            ),
            expires_at=datetime.now()
            + timedelta(
                seconds=USER_SESSION_EXPIRES_IN,
            ),
        )

        await session.insert()
        return session_token

    @staticmethod
    def generate_session_token() -> str:
        """Generate a new session token."""
        return secrets.token_hex(32)

    @staticmethod
    def hash_session_token(token: str) -> str:
        """Hash session token."""
        return sha256_crypt.hash(token)

    async def get(self, token: str) -> Session | None:
        """Get session by token."""
        return await Session.find_one(
            Session.token_hash == self.hash_session_token(token),
        )
