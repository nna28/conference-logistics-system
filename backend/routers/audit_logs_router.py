from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from db.database import get_db

from models.models import AuditLog

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.get("/")
def get_logs(
    db: Session = Depends(get_db)
):
    return db.query(
        AuditLog
    ).order_by(
        AuditLog.id.desc()
    ).all()