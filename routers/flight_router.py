from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    FlightBooking,
    Workshop,
    User
)

from schemas.flight_schema import (
    FlightBookingCreate,
    FlightBookingUpdate,
    FlightBookingResponse
)

from core.dependencies import require_role

router = APIRouter(
    prefix="/flights",
    tags=["Flight Bookings"]
)

@router.get(
    "/",
    response_model=list[FlightBookingResponse]
)
def get_flights(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Training Consultant"
        )
    )
):
    return db.query(
        FlightBooking
    ).all()

@router.get(
    "/{flight_id}",
    response_model=FlightBookingResponse
)
def get_flight(
    flight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Training Consultant"
        )
    )
):
    flight = db.query(
        FlightBooking
    ).filter(
        FlightBooking.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight booking not found"
        )

    return flight

@router.post(
    "/",
    response_model=FlightBookingResponse
)
def create_flight(
    request: FlightBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
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
    
        flight = FlightBooking(
        workshop_id=request.workshop_id,
        trainer_id=request.trainer_id,
        flight_code=request.flight_code,
        departure_location=request.departure_location,
        destination=request.destination,
        departure_time=request.departure_time,
        confirmation_document=request.confirmation_document
    )

    db.add(flight)
    db.commit()
    db.refresh(flight)

    return flight

@router.put(
    "/{flight_id}",
    response_model=FlightBookingResponse
)
def update_flight(
    flight_id: int,
    request: FlightBookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    flight = db.query(
        FlightBooking
    ).filter(
        FlightBooking.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight booking not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(flight, key, value)

    db.commit()
    db.refresh(flight)

    return flight

@router.delete(
    "/{flight_id}"
)
def delete_flight(
    flight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    flight = db.query(
        FlightBooking
    ).filter(
        FlightBooking.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight booking not found"
        )

    db.delete(flight)
    db.commit()

    return {
        "message":
        "Flight booking deleted successfully"
    }