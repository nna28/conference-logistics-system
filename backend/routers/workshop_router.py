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
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/workshops",
    tags=["Workshops"]
)


@router.get(
    "/",
    response_model=list[WorkshopResponse],
    dependencies=[Depends(require_role("Admin", "Booking Staff", "Consultant", "Logistics Coordinator"))]
)
def get_workshops(
    db: Session = Depends(get_db)
):
    return db.query(
        Workshop
    ).all()


@router.get(
    "/{workshop_id}",
    response_model=WorkshopResponse,
    dependencies=[Depends(require_role("Admin", "Booking Staff", "Consultant", "Logistics Coordinator"))]
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


@router.get(
    "/{workshop_id}/overview",
    dependencies=[Depends(require_role("Admin", "Booking Staff", "Consultant", "Logistics Coordinator"))]
)
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
        workshop.trainer_id
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
    "/{workshop_id}/notify-logistics",
    dependencies=[Depends(require_role("Admin", "Booking Staff"))]
)
def notify_logistics(
    workshop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    logistics_users = db.query(User).filter(User.role == "Logistics Coordinator").all()
    if not logistics_users:
        raise HTTPException(status_code=404, detail="No Logistics Coordinator found")

    from models.models import Notification
    from datetime import datetime, timezone
    
    city = workshop.city or "Unknown City"
    w_type = workshop.workshop_type or "Unknown Type"
    date = str(workshop.scheduled_time) if workshop.scheduled_time else "Unknown Date"
    
    consultant_name = "Unknown Consultant"
    if workshop.consultant_id:
        c_user = db.query(User).filter(User.id == workshop.consultant_id).first()
        if c_user:
            consultant_name = c_user.full_name

    msg = f"Seminar: {w_type}\nDate: {date}\nCity: {city}\nConsultant: {consultant_name}"

    for l_user in logistics_users:
        notification = Notification(
            sender_id=current_user.id,
            receiver_id=l_user.id,
            title=f"New Workshop Alert: {workshop.workshop_code}",
            message=msg,
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notification)
        
    db.commit()
    return {"message": "Logistics Coordinators notified successfully."}


@router.post(
    "/",
    response_model=WorkshopResponse,
    dependencies=[Depends(require_role("Admin", "Booking Staff"))]
)
def create_workshop(
    request: WorkshopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    workshop = Workshop(
        workshop_code=request.workshop_code,
        workshop_type=request.workshop_type,
        scheduled_time=request.scheduled_time,
        expected_attendees=request.expected_attendees,
        city=request.city,
        trainer_id=request.trainer_id,
        status=request.status or "Pending"
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
    response_model=WorkshopResponse,
    dependencies=[Depends(require_role("Admin", "Booking Staff"))]
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


@router.delete(
    "/{workshop_id}",
    dependencies=[Depends(require_role("Admin", "Booking Staff"))]
)
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