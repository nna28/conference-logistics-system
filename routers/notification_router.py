from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    User,
    Notification
)

from schemas.notification_schema import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse
)

from core.dependencies import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    return db.query(Notification).filter(
        Notification.receiver_id == current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

@router.get(
    "/{notification_id}",
    response_model=NotificationResponse
)
def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.receiver_id == current_user.id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification

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
    receiver = db.query(User).filter(
        User.id == request.receiver_id
    ).first()

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="Receiver not found"
        )

    notification = Notification(
        sender_id=current_user.id,
        receiver_id=request.receiver_id,
        title=request.title,
        message=request.message
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification

@router.put(
    "/{notification_id}",
    response_model=NotificationResponse
)
def update_notification(
    notification_id: int,
    request: NotificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = request.is_read

    db.commit()
    db.refresh(notification)

    return notification

@router.delete(
    "/{notification_id}"
)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("Admin")
    )
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    db.delete(notification)
    db.commit()

    return {
        "message": "Notification deleted successfully"
    }

