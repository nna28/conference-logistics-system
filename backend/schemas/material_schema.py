from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MaterialCreate(BaseModel):
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[str] = "Pending"
    shipping_status: Optional[str] = "Pending"
    shipping_date: Optional[datetime] = None


class MaterialResponse(BaseModel):
    id: int
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[str] = None
    shipping_status: Optional[str] = None
    shipping_date: Optional[datetime] = None

    class Config:
        from_attributes = True