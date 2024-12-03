from functools import lru_cache
from http import HTTPStatus
from typing import Annotated, Any

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import ExpiredSignatureError, InvalidTokenError, PyJWKClient

from app.config import settings


# Retrieve JWKS keys
@lru_cache
def jwks_client() -> PyJWKClient:
    return PyJWKClient(f"{settings.cognito_issuer_url}/.well-known/jwks.json")


# Decode and validate a JWT token
def validate_jwt(token: str, jwk_client: PyJWKClient) -> dict[str, Any]:
    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        # Decode and validate the token
        decoded_token = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.cognito_issuer_url,  # Ensure issuer matches
        )
        return decoded_token
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Token has expired",
        )
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )


# Extract and validate token from Authorization header
def validate_auth_header(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(
            HTTPBearer(
                auto_error=False,
            ),
        ),
    ],
    jwk_client: Annotated[
        PyJWKClient,
        Depends(
            jwks_client,
        ),
    ],
) -> dict[str, Any] | None:
    if credentials is None:
        return None
    token = credentials.credentials

    # Validate the token
    return validate_jwt(token, jwk_client=jwk_client)


def current_user_id(
    decoded_token: Annotated[
        dict[str, Any] | None,
        Depends(
            validate_auth_header,
        ),
    ],
) -> str | None:
    """
    Extract and return the current user ID from the decoded token.
    """
    if decoded_token is None:
        return None

    # Assume "sub" contains the user ID. This may vary based on your Cognito setup.
    return decoded_token.get("sub")
