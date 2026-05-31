from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    Contract,
    Workshop,
    Venue,
    User
)

from schemas.contract_schema import (
    ContractCreate,
    ContractUpdate,
    ContractResponse
)

from core.dependencies import require_role

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"]
)

@router.get(
    "/",
    response_model=list[ContractResponse]
)
def get_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Sales Manager",
            "Logistics Coordinator"
        )
    )
):
    return db.query(Contract).all()

@router.get(
    "/{contract_id}",
    response_model=ContractResponse
)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Booking Staff",
            "Sales Manager",
            "Logistics Coordinator"
        )
    )
):
    contract = db.query(Contract).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return contract

@router.post(
    "/",
    response_model=ContractResponse
)
def create_contract(
    request: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Sales Manager",
            "Logistics Coordinator"
        )
    )
):
    workshop = db.query(Workshop).filter(
        Workshop.id == request.workshop_id
    ).first()

    if not workshop:
        raise HTTPException(
            status_code=404,
            detail="Workshop not found"
        )
    
        venue = db.query(Venue).filter(
        Venue.id == request.venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )
    
        manager = db.query(User).filter(
        User.id == request.sales_manager_id
    ).first()

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Sales manager not found"
        )
    
        contract = Contract(
        workshop_id=request.workshop_id,
        venue_id=request.venue_id,
        sales_manager_id=request.sales_manager_id
    )

    db.add(contract)
    db.commit()
    db.refresh(contract)

    return contract

@router.put(
    "/{contract_id}",
    response_model=ContractResponse
)
def update_contract(
    contract_id: int,
    request: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Sales Manager",
            "Logistics Coordinator"
        )
    )
):
    contract = db.query(Contract).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(contract, key, value)

    db.commit()
    db.refresh(contract)

    return contract

@router.delete(
    "/{contract_id}"
)
def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            "Admin",
            "Logistics Coordinator"
        )
    )
):
    contract = db.query(Contract).filter(
        Contract.id == contract_id
    ).first()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    db.delete(contract)
    db.commit()

    return {
        "message": "Contract deleted successfully"
    }

