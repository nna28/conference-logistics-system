from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import AuditLog

from schemas.audit_schema import (
    AuditLogResponse
)

from core.dependencies import (
    require_role
)

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)

@router.get(
    "/",
    response_model=list[AuditLogResponse]
)
def get_logs(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin")
    )
):
    return db.query(
        AuditLog
    ).order_by(
        AuditLog.created_at.desc()
    ).all()