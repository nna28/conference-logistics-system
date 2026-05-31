from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import User

from schemas.user_schema import (
    UserCreate,
    UserUpdate,
    UserResponse
)

from core.dependencies import require_role
from core.security import hash_password


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# =========================
# GET ALL USERS
# =========================

@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    return db.query(User).all()


# =========================
# GET USER BY ID
# =========================

@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# =========================
# CREATE USER
# =========================

@router.post(
    "/",
    response_model=UserResponse
)
def create_user(
    request: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    existing_user = db.query(User).filter(
        User.username == request.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    new_user = User(
        full_name=request.full_name,
        username=request.username,
        hashed_password=hash_password(
            request.password
        ),
        role=request.role,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# UPDATE USER
# =========================

@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    request: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.full_name = request.full_name
    user.role = request.role
    user.is_active = request.is_active

    db.commit()
    db.refresh(user)

    return user


# =========================
# DELETE USER
# =========================

@router.delete(
    "/{user_id}"
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }