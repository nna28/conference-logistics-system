from datetime import datetime, timezone

from models.models import AuditLog


def create_audit_log(
    db,
    user_id,
    action,
    entity
):

    entity_name = entity
    entity_id = 0
    if " #" in entity:
        parts = entity.split(" #")
        entity_name = parts[0]
        try:
            entity_id = int(parts[1])
        except ValueError:
            pass

    log = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity_name,
        entity_id=entity_id,
        created_at=datetime.now(timezone.utc)
    )

    db.add(log)

    db.commit()