from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    Workshop,
    User,
    Contract,
    Venue,
    TravelSchedule,
    MaterialRequest,
    MaterialShipment
)

from schemas.workshop_schema import (
    WorkshopCreate,
    WorkshopUpdate,
    WorkshopResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/workshops",
    tags=["Workshops"]
)


@router.get(
    "/",
    response_model=list[WorkshopResponse]
)
def get_workshops(
    db: Session = Depends(get_db)
):
    return db.query(
        Workshop
    ).all()


@router.get(
    "/{workshop_id}",
    response_model=WorkshopResponse
)
def get_workshop(
    workshop_id: int,
    db: Session = Depends(get_db)
):
    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    return workshop


@router.get("/{workshop_id}/overview")
def get_workshop_overview(
    workshop_id: int,
    db: Session = Depends(get_db)
):
    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )

    consultant = db.query(
        User
    ).filter(
        User.id ==
        workshop.consultant_id
    ).first()

    contracts = db.query(
        Contract
    ).filter(
        Contract.workshop_id ==
        workshop.id
    ).all()

    venues = []

    for contract in contracts:

        venue = db.query(
            Venue
        ).filter(
            Venue.id ==
            contract.venue_id
        ).first()

        if venue:
            venues.append(venue)

    travel_schedules = db.query(
        TravelSchedule
    ).filter(
        TravelSchedule.workshop_id ==
        workshop.id
    ).all()

    material_requests = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.workshop_id ==
        workshop.id
    ).all()

    shipments = []

    for request in material_requests:

        shipment_list = db.query(
            MaterialShipment
        ).filter(
            MaterialShipment.material_request_id
            ==
            request.id
        ).all()

        shipments.extend(
            shipment_list
        )

    return {
        "workshop":
            workshop,

        "consultant":
            consultant,

        "contracts":
            contracts,

        "venues":
            venues,

        "travel_schedules":
            travel_schedules,

        "material_requests":
            material_requests,

        "shipments":
            shipments
    }


@router.post(
    "/",
    response_model=WorkshopResponse
)
def create_workshop(
    request: WorkshopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    consultant = db.query(
        User
    ).filter(
        User.id == request.consultant_id
    ).first()

    if not consultant:
        raise HTTPException(
            status_code=404,
            detail="Consultant not found"
        )

    workshop = Workshop(
        workshop_code=request.workshop_code,
        workshop_type=request.workshop_type,
        scheduled_time=request.scheduled_time,
        expected_attendees=request.expected_attendees,
        consultant_id=request.consultant_id
    )

    db.add(workshop)

    db.commit()

    db.refresh(workshop)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Workshop #{workshop.id}"
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
        get_current_user
    )
):
    workshop = db.query(
        Workshop
    ).filter(
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
        setattr(
            workshop,
            key,
            value
        )

    db.commit()

    db.refresh(workshop)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Workshop #{workshop.id}"
    )

    return workshop


@router.delete("/{workshop_id}")
def delete_workshop(
    workshop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )
    
    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Workshop #{workshop.id}"
    )

    db.delete(workshop)

    db.commit()

    return {
        "message":
        "Workshop deleted successfully"
    }