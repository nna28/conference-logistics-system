from datetime import datetime, timezone

from models.models import AuditLog


def create_audit_log(
    db,
    user_id,
    action,
    entity
):

    log = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity,
        created_at=datetime.now(timezone.utc)
    )

    db.add(log)

    db.commit()