from types_aiobotocore_cognito_idp import CognitoIdentityProviderClient

from app.auth.models import User


class AuthService:
    def __init__(self, cognito_idp_client: CognitoIdentityProviderClient) -> None:
        self._cognito_idp_client = cognito_idp_client

    # TODO: get user by username here instead
    # If possible, by user ID instead of username
    async def get_user(self, access_token: str) -> User:
        response = await self._cognito_idp_client.get_user(
            AccessToken=access_token,
        )

        return User(username=response["Username"])
