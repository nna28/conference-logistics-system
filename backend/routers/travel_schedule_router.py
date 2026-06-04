from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import os
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    TravelSchedule,
    Workshop,
    User
)

from schemas.travel_schedule_schema import (
    TravelScheduleCreate,
    TravelScheduleUpdate,
    TravelScheduleResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/travel-schedules",
    tags=["Travel Schedules"]
)


@router.get(
    "/",
    response_model=list[TravelScheduleResponse]
)
def get_travel_schedules(
    db: Session = Depends(get_db)
):
    return db.query(
        TravelSchedule
    ).all()


@router.get(
    "/{schedule_id}",
    response_model=TravelScheduleResponse
)
def get_travel_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = db.query(
        TravelSchedule
    ).filter(
        TravelSchedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Travel schedule not found"
        )

    return schedule


@router.get("/{schedule_id}/overview")
def get_travel_schedule_overview(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = db.query(
        TravelSchedule
    ).filter(
        TravelSchedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Travel schedule not found"
        )

    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == schedule.workshop_id
    ).first()

    consultant = db.query(
        User
    ).filter(
        User.id == schedule.consultant_id
    ).first()

    return {
        "travel_schedule": schedule,
        "workshop": workshop,
        "consultant": consultant
    }


@router.post(
    "/",
    response_model=TravelScheduleResponse
)
def create_travel_schedule(
    request: TravelScheduleCreate,
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

    schedule = TravelSchedule(
        workshop_id=request.workshop_id,
        consultant_id=request.consultant_id,
        transport_type=request.transport_type,
        departure_location=request.departure_location,
        destination=request.destination,
        departure_time=request.departure_time,
        travel_info=request.travel_info
    )

    db.add(schedule)

    db.commit()

    db.refresh(schedule)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Travel Schedule #{schedule.id}"
    )

    from models.models import Notification
    import datetime

    if request.consultant_id:
        notif = Notification(
            sender_id=current_user.id,
            receiver_id=request.consultant_id,
            title="New Travel Schedule",
            message=f"You have been assigned to Travel Schedule #{schedule.id} for Workshop #{schedule.workshop_id}.",
            created_at=datetime.datetime.utcnow()
        )
        db.add(notif)
        db.commit()

    return schedule


@router.put(
    "/{schedule_id}",
    response_model=TravelScheduleResponse
)
def update_travel_schedule(
    schedule_id: int,
    request: TravelScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    schedule = db.query(
        TravelSchedule
    ).filter(
        TravelSchedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Travel schedule not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            schedule,
            key,
            value
        )

    db.commit()

    db.refresh(schedule)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Travel Schedule #{schedule.id}"
    )

    return schedule


@router.delete("/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    schedule = db.query(
        TravelSchedule
    ).filter(
        TravelSchedule.id ==
        schedule_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"TravelSchedule #{schedule.id}"
    )

    db.delete(schedule)

    db.commit()

    return {
        "message":
        "Travel schedule deleted successfully"
    }


@router.post(
    "/{schedule_id}/notify-completion"
)
def notify_schedule_completion(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = db.query(TravelSchedule).filter(TravelSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(404, "Travel schedule not found")
        
    schedule.status = "CONFIRMED"
    
    from models.models import Notification
    from datetime import datetime, timezone
    
    # Notify Booking Staff & Logistics Coordinator
    users = db.query(User).filter(User.role.in_(["Booking Staff", "Logistics Coordinator"])).all()
    for u in users:
        notif = Notification(
            sender_id=current_user.id,
            receiver_id=u.id,
            title="Travel Schedule Confirmed",
            message=f"Consultant has confirmed Travel Schedule #{schedule.id}.",
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)
        
    create_audit_log(db, current_user.id, "UPDATE", f"Travel Schedule #{schedule.id} confirmed")
    db.commit()
    return {"message": "Success"}

@router.post("/{schedule_id}/upload-confirmation")
async def upload_confirmation(
    schedule_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = db.query(TravelSchedule).filter(TravelSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    file_path = f"uploads/travel_confirm_{schedule_id}_{file.filename}"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    schedule.confirmation_file = file_path
    schedule.status = "Confirmed"
    
    db.commit()
    db.refresh(schedule)
    
    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Uploaded confirmation for TravelSchedule #{schedule.id}"
    )
    
    return {"message": "File uploaded and schedule confirmed", "file_path": file_path}