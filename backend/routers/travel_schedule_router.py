from fastapi import APIRouter, Depends, HTTPException
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
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/travel-schedules",
    tags=["Travel Schedules"]
)


@router.get(
    "/",
    response_model=list[TravelScheduleResponse],
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Training Consultant",
                "Logistics Coordinator"
            )
        )
    ]
)
def get_travel_schedules(
    db: Session = Depends(get_db)
):
    return db.query(TravelSchedule).all()


@router.get(
    "/{schedule_id}",
    response_model=TravelScheduleResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Training Consultant",
                "Logistics Coordinator"
            )
        )
    ]
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


@router.get(
    "/{schedule_id}/overview",
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Training Consultant",
                "Logistics Coordinator"
            )
        )
    ]
)
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

    trainer = db.query(
        User
    ).filter(
        User.id == schedule.trainer_id
    ).first()

    return {
        "travel_schedule": schedule,
        "workshop": workshop,
        "trainer": trainer
    }


@router.post(
    "/",
    response_model=TravelScheduleResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Logistics Coordinator"
            )
        )
    ]
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

    trainer = db.query(
        User
    ).filter(
        User.id == request.trainer_id
    ).first()

    if not trainer:
        raise HTTPException(
            status_code=404,
            detail="Trainer not found"
        )

    schedule = TravelSchedule(
        workshop_id=request.workshop_id,
        trainer_id=request.trainer_id,
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

    return schedule


@router.put(
    "/{schedule_id}",
    response_model=TravelScheduleResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Logistics Coordinator"
            )
        )
    ]
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
        setattr(schedule, key, value)

    db.commit()
    db.refresh(schedule)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Travel Schedule #{schedule.id}"
    )

    return schedule


@router.delete(
    "/{schedule_id}",
    dependencies=[
        Depends(
            require_role(
                "Admin"
            )
        )
    ]
)
def delete_travel_schedule(
    schedule_id: int,
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

    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Travel Schedule #{schedule.id}"
    )

    db.delete(schedule)
    db.commit()

    return {
        "message":
        "Travel schedule deleted successfully"
    }