from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.models import Material, User
from schemas.material_schema import MaterialCreate, MaterialResponse
from services.audit_service import create_audit_log
from core.dependencies import get_current_user

router = APIRouter(
    prefix="/materials",
    tags=["Materials"]
)


@router.get("/", response_model=list[MaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return db.query(Material).all()


@router.get("/{material_id}", response_model=MaterialResponse)
def get_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.post("/", response_model=MaterialResponse)
def create_material(
    request: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = Material(
        workshop_id=request.workshop_id,
        quantity_needed=request.quantity_needed,
        packaging_status=request.packaging_status or "Pending",
        shipping_status=request.shipping_status or "Pending",
        shipping_date=request.shipping_date,
    )
    db.add(material)
    db.commit()
    db.refresh(material)
    create_audit_log(db, current_user.id, "CREATE", f"Material #{material.id}")
    return material


@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(
    material_id: int,
    request: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(material, key, value)

    db.commit()
    db.refresh(material)
    create_audit_log(db, current_user.id, "UPDATE", f"Material #{material.id}")
    return material


@router.delete("/{material_id}")
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    create_audit_log(db, current_user.id, "DELETE", f"Material #{material.id}")
    db.delete(material)
    db.commit()
    return {"message": "Material deleted successfully"}