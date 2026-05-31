from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from db.database import get_db
from models.models import User

from core.security import (
    verify_password,
    create_access_token
)

from core.dependencies import (
    get_current_user,
    require_role
)

from schemas.user_schema import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "role": user.role.value
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def read_me(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user

@router.get("/admin-only")
def admin_only(
    current_user: User = Depends(
        require_role("Admin")
    )
):
    return {
        "message": "Welcome Admin"
    }