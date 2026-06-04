from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    Venue,
    User
)

from schemas.venue_schema import (
    VenueCreate,
    VenueUpdate,
    VenueResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/venues",
    tags=["Venues"]
)


from typing import Optional

@router.get(
    "/",
    response_model=list[VenueResponse]
)
def get_venues(
    city: Optional[str] = None,
    room_type: Optional[str] = None,
    max_cost: Optional[int] = None,
    min_capacity: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Venue)
    
    if city:
        query = query.filter(Venue.address.ilike(f"%{city}%"))
    if room_type:
        query = query.filter(Venue.room_type.ilike(f"%{room_type}%"))
    if min_capacity is not None:
        query = query.filter(Venue.capacity >= min_capacity)
    if max_cost is not None:
        query = query.filter(Venue.rental_cost <= max_cost)
    
    venues = query.all()

    return venues


@router.get(
    "/{venue_id}",
    response_model=VenueResponse
)
def get_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):
    venue = db.query(
        Venue
    ).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    return venue


@router.get("/{venue_id}/overview")
def get_venue_overview(
    venue_id: int,
    db: Session = Depends(get_db)
):
    venue = db.query(
        Venue
    ).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    return {
        "venue": venue,
        "sales_manager": None
    }


@router.post(
    "/",
    response_model=VenueResponse
)
def create_venue(
    request: VenueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    venue = Venue(
        name=request.name,
        address=request.address,
        rental_cost=request.rental_cost,
        room_type=request.room_type,
        equipment_supported=request.equipment_supported,
        capacity=request.capacity,
        is_available=request.is_available if request.is_available is not None else True,
    )

    db.add(venue)

    db.commit()

    db.refresh(venue)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Venue #{venue.id}"
    )

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
        get_current_user
    )
):
    venue = db.query(
        Venue
    ).filter(
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
        setattr(
            venue,
            key,
            value
        )

    db.commit()

    db.refresh(venue)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Venue #{venue.id}"
    )

    return venue


@router.delete("/{venue_id}")
def delete_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    venue = db.query(
        Venue
    ).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )
    
    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Venue #{venue.id}"
    )

    db.delete(venue)

    db.commit()

    return {
        "message":
        "Venue deleted successfully"
    }