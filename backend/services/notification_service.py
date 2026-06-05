from models.models import Notification


def create_notification(
    db,
    user_id,
    title,
    message
):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        is_read=0
    )

    db.add(notification)

    db.commit()