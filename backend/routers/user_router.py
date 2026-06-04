from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import User

from schemas.user_schema import (
    UserCreate,
    UserResponse
)

from core.security import (
    hash_password
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()


@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
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


@router.post(
    "/",
    response_model=UserResponse
)
def create_user(
    request: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.username == request.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    user = User(
        full_name=request.full_name,

        username=request.username,

        email=request.email,

        password_hash=
        hash_password(
            request.password
        ),

        role=request.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    request: UserCreate,
    db: Session = Depends(get_db)
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
    user.username = request.username
    user.email = request.email
    user.role = request.role

    db.commit()
    db.refresh(user)

    return user


@router.delete(
    "/{user_id}"
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
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