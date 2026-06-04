from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from jose import jwt
from jose import JWTError

from sqlalchemy.orm import Session

from db.database import get_db

from models.models import User

from core.security import (
    SECRET_KEY,
    ALGORITHM
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(
        get_db
    )
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get(
            "user_id"
        )

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(
        User
    ).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


def require_role(*roles):

    def checker(
        current_user: User = Depends(
            get_current_user
        )
    ):

        user_role = (
            current_user.role.value
            if hasattr(
                current_user.role,
                "value"
            )
            else current_user.role
        )

        if user_role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return current_user

    return checker