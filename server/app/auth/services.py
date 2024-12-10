from result import Err, Ok, Result

from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.auth.exceptions import EmailInUseError, InvalidCredentialsError


class AuthService:
    def __init__(self, account_repo: AccountRepo) -> None:
        self._account_repo = account_repo

    async def register(
        self, email: str, password: str
    ) -> Result[Account, EmailInUseError]:
        if await self._account_repo.get_by_email(email=email):
            return Err(EmailInUseError())
        account = await self._account_repo.create(
            email=email,
            password=password,
        )

        return Ok(account)

    async def login(
        self, email: str, password: str
    ) -> Result[Account, InvalidCredentialsError]:
        account = await self._account_repo.get_by_email(email=email)
        if not account:
            return Err(InvalidCredentialsError())

        if not self._account_repo.verify_password(
            password=password,
            password_hash=account.password_hash,
        ):
            return Err(InvalidCredentialsError())
        return Ok(account)
