from jose import jwt
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer

from db.database import SessionLocal

from models.models import User

from core.security import (
    SECRET_KEY,
    ALGORITHM
)

security = HTTPBearer()


def get_current_user(
    credentials=Depends(security)
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

        db = SessionLocal()

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

    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


def require_role(*roles):

    def checker(
        current_user=Depends(
            get_current_user
        )
    ):

        if current_user.role not in roles:

            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return current_user

    return checker