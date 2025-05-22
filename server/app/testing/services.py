from app.accounts.repositories import AccountRepo, ProfileRepo
from app.testing.schemas import CreateTestUserSchema, TestUserSchema


class TestSetupService:
    def __init__(self, account_repo: AccountRepo, profile_repo: ProfileRepo) -> None:
        self._account_repo = account_repo
        self._profile_repo = profile_repo

    async def create_account(self, data: CreateTestUserSchema) -> TestUserSchema:
        """Create an account for E2E testing."""
        if "password" in data.auth_providers and data.password is None:
            raise ValueError(
                "Password must be provided if password auth provider is used."
            )

        user = await self._account_repo.create(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            auth_providers=data.auth_providers,
        )

        # create auth providers
        if "webauthn_credential" in data.auth_providers:
            # TODO: create a webauthn credential
            pass

        if "oauth_google" in data.auth_providers:
            # TODO: create an oauth google credential
            pass

        # TODO: create a profile

        # TODO: set TOTP secret and return recovery codes

        return TestUserSchema(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            two_factor_secret=user.two_factor_secret,
            created_at=user.created_at,
            updated_at=user.updated_at,
            profile=user.profile,
            auth_providers=user.auth_providers,
        )
