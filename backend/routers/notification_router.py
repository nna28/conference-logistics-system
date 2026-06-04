from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from datetime import datetime, timezone

from db.database import get_db
from models.models import Notification, User
from core.dependencies import get_current_user
from schemas.notification_schema import NotificationCreate, NotificationResponse

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


@router.post("/", response_model=NotificationResponse)
def create_notification(
    request: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = Notification(
        sender_id=current_user.id,
        receiver_id=request.receiver_id,
        title=request.title,
        message=request.message,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.get("/user/{user_id}")
def get_user_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(
        Notification
    ).filter(
        Notification.receiver_id == user_id
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
    notification.is_read = True

    db.commit()

    return {
        "message":
        "Notification marked as read"
    }