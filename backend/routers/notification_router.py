from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import datetime, timezone

from db.database import get_db

from models.models import (
    Notification,
    User,
    RoleEnum
)

from core.dependencies import (
    get_current_user
)

from schemas.notification_schema import (
    NotificationCreate,
    NotificationResponse
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    if current_user.role == RoleEnum.ADMIN:
        return db.query(
            Notification
        ).order_by(
            Notification.id.desc()
        ).all()

    return db.query(
        Notification
    ).filter(
        Notification.receiver_id ==
        current_user.id
    ).order_by(
        Notification.id.desc()
    ).all()


@router.post(
    "/",
    response_model=NotificationResponse
)
def create_notification(
    request: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    notification = Notification(
        sender_id=current_user.id,
        receiver_id=request.receiver_id,
        title=request.title,
        message=request.message,
        is_read=False,
        created_at=datetime.now(
            timezone.utc
        )
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return notification


@router.get(
    "/my"
)
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    return db.query(
        Notification
    ).filter(
        Notification.receiver_id ==
        current_user.id
    ).order_by(
        Notification.id.desc()
    ).all()


@router.put(
    "/{notification_id}/read"
)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    notification = db.query(
        Notification
    ).filter(
        Notification.id ==
        notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    if (
        notification.receiver_id
        != current_user.id
        and
        current_user.role
        != RoleEnum.ADMIN
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    notification.is_read = True

    db.commit()

    return {
        "message":
        "Notification marked as read"
    }