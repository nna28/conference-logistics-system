from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from models.models import (
    PackagingStatusEnum,
    ShippingStatusEnum,
    MaterialTypeEnum
)

class MaterialCreate(BaseModel):
    material_type: MaterialTypeEnum
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[PackagingStatusEnum] = "Pending"
    shipping_status: Optional[ShippingStatusEnum] = "Pending"
    shipping_date: Optional[datetime] = None


class MaterialResponse(BaseModel):
    id: int
    material_type: MaterialTypeEnum
    workshop_id: Optional[int] = None
    quantity_needed: Optional[int] = None
    packaging_status: Optional[PackagingStatusEnum] = None
    shipping_status: Optional[ShippingStatusEnum] = None
    shipping_date: Optional[datetime] = None

    class Config:
        from_attributes = True