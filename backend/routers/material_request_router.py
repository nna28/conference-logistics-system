from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    MaterialRequest,
    Workshop,
    Contract,
    User
)

from schemas.material_request_schema import (
    MaterialRequestCreate,
    MaterialRequestUpdate,
    MaterialRequestResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/material-requests",
    tags=["Material Requests"]
)


@router.get(
    "/",
    response_model=list[MaterialRequestResponse]
)
def get_material_requests(
    db: Session = Depends(get_db)
):
    reqs = db.query(MaterialRequest).all()
    for r in reqs:
        c = db.query(Contract).filter(Contract.workshop_id == r.workshop_id).first()
        r.delivery_address = c.venue.address if (c and c.venue) else None
    return reqs


@router.get(
    "/{request_id}",
    response_model=MaterialRequestResponse
)
def get_material_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == request_id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )
        
    c = db.query(Contract).filter(Contract.workshop_id == request.workshop_id).first()
    request.delivery_address = c.venue.address if (c and c.venue) else None

    return request


@router.get("/{request_id}/overview")
def get_material_request_overview(
    request_id: int,
    db: Session = Depends(get_db)
):
    request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == request_id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    workshop = db.query(
        Workshop
    ).filter(
        Workshop.id == request.workshop_id
    ).first()

    return {
        "material_request": request,
        "workshop": workshop
    }


@router.post(
    "/",
    response_model=MaterialRequestResponse
)
def create_material_request(
    request: MaterialRequestCreate,
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

    calc_qty = workshop.expected_attendees if workshop.expected_attendees else request.quantity_needed

    material_request = MaterialRequest(
        workshop_id=request.workshop_id,
        quantity_needed=calc_qty,
        packaging_status=request.packaging_status or "Pending",
        shipping_status=request.shipping_status or "Pending",
        shipping_date=request.shipping_date,
    )

    db.add(material_request)

    db.commit()

    db.refresh(material_request)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Material Request #{material_request.id}"
    )

    return material_request


@router.put(
    "/{request_id}",
    response_model=MaterialRequestResponse
)
def update_material_request(
    request_id: int,
    request: MaterialRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    material_request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == request_id
    ).first()

    if not material_request:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            material_request,
            key,
            value
        )

    db.commit()

    db.refresh(material_request)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Material Request #{material_request.id}"
    )

    return material_request


@router.delete("/{request_id}")
def delete_material_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    material_request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == request_id
    ).first()

    if not material_request:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Material Request #{material_request.id}"
    )

    db.delete(material_request)

    db.commit()

    return {
        "message":
        "Material request deleted successfully"
    }