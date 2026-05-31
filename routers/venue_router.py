from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import Venue
from models.models import User

from schemas.venue_schema import (
    VenueCreate,
    VenueUpdate,
    VenueResponse
)

from core.dependencies import require_role

router = APIRouter(
    prefix="/venues",
    tags=["Venues"]
)

@router.get(
    "/",
    response_model=list[VenueResponse]
)
def get_venues(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Sales Manager"
        )
    )
):
    return db.query(Venue).all()

@router.get("/search")
def search_venues(
    capacity: int | None = None,
    room_type: str | None = None,
    max_cost: float | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Sales Manager"
        )
    )
):
    query = db.query(Venue)

    if capacity:
        query = query.filter(
            Venue.capacity >= capacity
        )

    if room_type:
        query = query.filter(
            Venue.room_type.ilike(
                f"%{room_type}%"
            )
        )

    if max_cost:
        query = query.filter(
            Venue.rental_cost <= max_cost
        )

    return query.all()

@router.get(
    "/{venue_id}",
    response_model=VenueResponse
)
def get_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Logistics Coordinator",
            "Sales Manager"
        )
    )
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    return venue

@router.post(
    "/",
    response_model=VenueResponse
)
def create_venue(
    request: VenueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    venue = Venue(
        name=request.name,
        address=request.address,
        capacity=request.capacity,
        rental_cost=request.rental_cost,
        room_type=request.room_type,
        equipment_supported=request.equipment_supported
    )

    db.add(venue)
    db.commit()
    db.refresh(venue)

    return venue

@router.put(
    "/{venue_id}",
    response_model=VenueResponse
)
def update_venue(
    venue_id: int,
    request: VenueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(venue, key, value)

    db.commit()
    db.refresh(venue)

    return venue

@router.delete(
    "/{venue_id}"
)
def delete_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    db.delete(venue)
    db.commit()

    return {
        "message": "Venue deleted successfully"
    }

