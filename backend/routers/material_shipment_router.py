from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    MaterialShipment,
    MaterialRequest,
    Material,
    User
)

from schemas.material_shipment_schema import (
    MaterialShipmentCreate,
    MaterialShipmentUpdate,
    MaterialShipmentResponse
)

from services.audit_service import (
    create_audit_log
)

from core.dependencies import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/material-shipments",
    tags=["Material Shipments"]
)


@router.get(
    "/",
    response_model=list[MaterialShipmentResponse],
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def get_shipments(
    db: Session = Depends(get_db)
):
    return db.query(
        MaterialShipment
    ).all()


@router.get(
    "/{shipment_id}",
    response_model=MaterialShipmentResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    shipment = db.query(
        MaterialShipment
    ).filter(
        MaterialShipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    return shipment


@router.get(
    "/{shipment_id}/overview",
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def get_shipment_overview(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    shipment = db.query(
        MaterialShipment
    ).filter(
        MaterialShipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    material_request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id ==
        shipment.material_request_id
    ).first()

    material = db.query(
        Material
    ).filter(
        Material.id ==
        shipment.material_id
    ).first()

    return {
        "shipment": shipment,
        "material_request": material_request,
        "material": material
    }


@router.post(
    "/",
    response_model=MaterialShipmentResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def create_shipment(
    request: MaterialShipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    material_request = db.query(
        MaterialRequest
    ).filter(
        MaterialRequest.id ==
        request.material_request_id
    ).first()

    if not material_request:
        raise HTTPException(
            status_code=404,
            detail="Material request not found"
        )

    material = db.query(
        Material
    ).filter(
        Material.id ==
        request.material_id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    shipment = MaterialShipment(
        material_request_id=request.material_request_id,
        material_id=request.material_id,
        quantity=request.quantity
    )

    db.add(shipment)

    db.commit()

    db.refresh(shipment)

    create_audit_log(
        db,
        current_user.id,
        "CREATE",
        f"Shipment #{shipment.id}"
    )

    return shipment


@router.put(
    "/{shipment_id}",
    response_model=MaterialShipmentResponse,
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def update_shipment(
    shipment_id: int,
    request: MaterialShipmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    shipment = db.query(
        MaterialShipment
    ).filter(
        MaterialShipment.id ==
        shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            shipment,
            key,
            value
        )

    db.commit()

    db.refresh(shipment)

    create_audit_log(
        db,
        current_user.id,
        "UPDATE",
        f"Shipment #{shipment.id}"
    )

    return shipment


@router.delete(
    "/{shipment_id}",
    dependencies=[
        Depends(
            require_role(
                "Admin",
                "Materials Handling Staff",
                "Logistics Coordinator"
            )
        )
    ]
)
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    shipment = db.query(
        MaterialShipment
    ).filter(
        MaterialShipment.id ==
        shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    create_audit_log(
        db,
        current_user.id,
        "DELETE",
        f"Shipment #{shipment.id}"
    )

    db.delete(shipment)

    db.commit()

    return {
        "message":
        "Shipment deleted successfully"
    }