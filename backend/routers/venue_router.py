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


@router.get(
    "/",
    response_model=list[VenueResponse]
)
def get_venues(
    db: Session = Depends(get_db)
):
    return db.query(
        Venue
    ).all()


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

    sales_manager = None

    if venue.sales_manager_id:
        sales_manager = db.query(
            User
        ).filter(
            User.id == venue.sales_manager_id
        ).first()

    return {
        "venue": venue,
        "sales_manager": sales_manager
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
    manager = db.query(
        User
    ).filter(
        User.id == request.sales_manager_id
    ).first()

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Sales manager not found"
        )

    venue = Venue(
        name=request.name,
        address=request.address,
        contact_phone=request.contact_phone,
        description=request.description,
        sales_manager_id=request.sales_manager_id
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