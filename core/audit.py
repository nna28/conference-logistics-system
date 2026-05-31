from models.models import AuditLog


def create_audit_log(
    db,
    user_id,
    action,
    entity,
    entity_id
):
    log = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id
    )

    db.add(log)

    db.commit()