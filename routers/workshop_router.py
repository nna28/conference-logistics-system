from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import Workshop
from models.models import User

from schemas.workshop_schema import (
    WorkshopCreate,
    WorkshopUpdate,
    WorkshopResponse
)

from core.dependencies import require_role
from core.audit import create_audit_log

router = APIRouter(
    prefix="/workshops",
    tags=["Workshops"]
)

@router.get(
    "/",
    response_model=list[WorkshopResponse]
)
def get_workshops(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Sales Manager",
            "Training Consultant",
            "Materials Handling Staff"
        )
    )
):
    return db.query(Workshop).all()

@router.get(
    "/{workshop_id}",
    response_model=WorkshopResponse
)
def get_workshop(
    workshop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Sales Manager",
            "Training Consultant",
            "Materials Handling Staff"
        )
    )
):
    workshop = db.query(Workshop).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    return workshop

@router.post(
    "/",
    response_model=WorkshopResponse
)
def create_workshop(
    request: WorkshopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator"
        )
    )
):
    workshop = Workshop(
        workshop_code=request.workshop_code,
        workshop_type=request.workshop_type,
        scheduled_time=request.scheduled_time,
        city=request.city,
        trainer_id=request.trainer_id,
        expected_attendees=request.expected_attendees
    )

    db.add(workshop)
    db.commit()
    db.refresh(workshop)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="Create",
        entity="Workshop",
        entity_id=workshop.id
    )
    
    return workshop

@router.put(
    "/{workshop_id}",
    response_model=WorkshopResponse
)
def update_workshop(
    workshop_id: int,
    request: WorkshopUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator"
        )
    )
):
    workshop = db.query(Workshop).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(workshop, key, value)

    db.commit()
    db.refresh(workshop)

    return workshop

@router.delete(
    "/{workshop_id}"
)
def delete_workshop(
    workshop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator"
        )
    )
):
    workshop = db.query(Workshop).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    db.delete(workshop)
    db.commit()

    return {
        "message": "Workshop deleted successfully"
    }
