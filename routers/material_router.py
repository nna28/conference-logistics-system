from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    MaterialRequest,
    Workshop,
    User
)

from schemas.material_schema import (
    MaterialRequestCreate,
    MaterialRequestUpdate,
    MaterialRequestResponse
)

from core.dependencies import require_role

router = APIRouter(
    prefix="/materials",
    tags=["Material Requests"]
)

@router.get(
    "/",
    response_model=list[MaterialRequestResponse]
)
def get_material_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator",
            "Materials Handling Staff"
        )
    )
):
    return db.query(
        MaterialRequest
    ).all()

@router.get(
    "/{material_id}",
    response_model=MaterialRequestResponse
)
def get_material_request(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator",
            "Materials Handling Staff"
        )
    )
):
    material = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == material_id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    return material

@router.post(
    "/",
    response_model=MaterialRequestResponse
)
def create_material_request(
    request: MaterialRequestCreate,
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
    
        material = MaterialRequest(
        workshop_id=request.workshop_id,
        quantity_needed=request.quantity_needed,
        shipping_date=request.shipping_date
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return material

@router.put(
    "/{material_id}",
    response_model=MaterialRequestResponse
)
def update_material_request(
    material_id: int,
    request: MaterialRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator",
            "Materials Handling Staff"
        )
    )
):
    material = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == material_id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(material, key, value)

    db.commit()
    db.refresh(material)

    return material

@router.delete(
    "/{material_id}"
)
def delete_material_request(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    material = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id == material_id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    db.delete(material)
    db.commit()

    return {
        "message":
        "Material request deleted successfully"
    }