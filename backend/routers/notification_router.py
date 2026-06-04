from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from db.database import get_db

from models.models import Notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):
    return db.query(
        Notification
    ).order_by(
        Notification.id.desc()
    ).all()


@router.get("/user/{user_id}")
def get_user_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(
        Notification
    ).filter(
        Notification.user_id == user_id
    ).order_by(
        Notification.id.desc()
    ).all()


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = 1

    db.commit()

    return {
        "message":
        "Notification marked as read"
    }