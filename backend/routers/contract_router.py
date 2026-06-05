from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from db.database import get_db

from models.models import (
    Contract,
    Workshop,
    Venue,
    User
)

from schemas.contract_schema import (
    ContractCreate,
    ContractUpdate,
    ContractResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"]
)


@router.get(
    "/",
    response_model=list[ContractResponse]
)
def get_contracts(
    db: Session = Depends(get_db)
):
    return db.query(
        Contract
    ).all()


@router.get(
    "/{contract_id}",
    response_model=ContractResponse
)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db)
):
    contract = db.query(
        Contract
    ).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return contract


@router.get("/{contract_id}/overview")
def get_contract_overview(
    contract_id: int,
    db: Session = Depends(get_db)
):
    contract = db.query(
        Contract
    ).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == contract.workshop_id
    ).first()

    venue = db.query(
        Venue
    ).filter(
        Venue.id == contract.venue_id
    ).first()

    return {
        "contract": contract,
        "workshop": workshop,
        "venue": venue
    }


@router.post(
    "/",
    response_model=ContractResponse
)
def create_contract(
    request: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == request.workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    venue = db.query(
        Venue
    ).filter(
        Venue.id == request.venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    contract = Contract(
        workshop_id=request.workshop_id,
        venue_id=request.venue_id,
        sales_manager_id=request.sales_manager_id,
        status=request.status or "PENDING",
        meeting_rooms=request.meeting_rooms,
        seating_style=request.seating_style,
        av_requirements=request.av_requirements,
    )

    db.add(contract)

    db.commit()

    db.refresh(contract)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Contract #{contract.id}"
    )

    from models.models import Notification
    import datetime

    if request.sales_manager_id:
        notif = Notification(
            sender_id=current_user.id,
            receiver_id=request.sales_manager_id,
            title="New Contract Assigned",
            message=f"You have been assigned to Contract #{contract.id} for Workshop #{contract.workshop_id}.",
            created_at=datetime.datetime.utcnow()
        )
        db.add(notif)
        db.commit()

    return contract


@router.put(
    "/{contract_id}",
    response_model=ContractResponse
)
def update_contract(
    contract_id: int,
    request: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    contract = db.query(
        Contract
    ).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            contract,
            key,
            value
        )

    # Auto-set timestamps on status change
    contract.updated_at = datetime.now(timezone.utc)
    if update_data.get("status") == "Approved" and not contract.approved_at:
        contract.approved_at = datetime.now(timezone.utc)

    db.commit()

    db.refresh(contract)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Contract #{contract.id}"
    )

    return contract


@router.delete("/{contract_id}")
def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    contract = db.query(
        Contract
    ).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Contract #{contract.id}"
    )

    db.delete(contract)

    db.commit()

    return {
        "message":
        "Contract deleted successfully"
    }


@router.post(
    "/{contract_id}/notify-completion"
)
def notify_contract_completion(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(404, "Contract not found")
        
    contract.status = "COMPLETED"
    
    from models.models import Notification
    from datetime import datetime, timezone
    
    # Notify Sales Manager & Logistics Coordinator
    users = db.query(User).filter(User.role.in_(["Sales Manager", "Logistics Coordinator"])).all()
    for u in users:
        notif = Notification(
            sender_id=current_user.id,
            receiver_id=u.id,
            title="Contract Completed",
            message=f"Contract #{contract.id} has been fully completed and confirmed.",
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)
        
    create_audit_log(db, current_user.id, "UPDATE", f"Contract #{contract.id} marked as completed")
    db.commit()
    return {"message": "Success"}