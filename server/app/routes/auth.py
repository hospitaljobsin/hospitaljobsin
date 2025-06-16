from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
async def login():
    """Placeholder for login endpoint."""
    return {"message": "Login endpoint"}


@router.post("/register")
async def register():
    """Placeholder for register endpoint."""
    return {"message": "Register endpoint"}


@router.post("/logout")
async def logout():
    """Placeholder for logout endpoint."""
    return {"message": "Logout endpoint"}
