from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from db.database import get_db

from models.models import AuditLog

from core.dependencies import require_role

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Logistics Coordinator"
            )
        )
    ]
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