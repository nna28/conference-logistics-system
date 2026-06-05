from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MaterialRequestCreate(BaseModel):
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[str] = "Pending"
    shipping_status: Optional[str] = "Pending"
    shipping_date: Optional[datetime] = None


class MaterialRequestUpdate(BaseModel):
    quantity_needed: Optional[int] = None
    packaging_status: Optional[str] = None
    shipping_status: Optional[str] = None
    shipping_date: Optional[datetime] = None


class MaterialRequestResponse(BaseModel):
    id: int
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[str] = None
    shipping_status: Optional[str] = None
    shipping_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    delivery_address: Optional[str] = None

    class Config:
        from_attributes = True