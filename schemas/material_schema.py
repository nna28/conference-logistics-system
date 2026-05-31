from pydantic import BaseModel
from datetime import datetime

from models.models import (
    PackagingStatusEnum,
    ShippingStatusEnum
)


class MaterialRequestCreate(BaseModel):
    workshop_id: int
    quantity_needed: int
    shipping_date: datetime | None = None


class MaterialRequestUpdate(BaseModel):
    quantity_needed: int | None = None

    packaging_status: PackagingStatusEnum | None = None

    shipping_status: ShippingStatusEnum | None = None

    shipping_date: datetime | None = None


class MaterialRequestResponse(BaseModel):
    id: int

    workshop_id: int

    quantity_needed: int

    packaging_status: PackagingStatusEnum

    shipping_status: ShippingStatusEnum

    shipping_date: datetime | None

    created_at: datetime

    class Config:
        from_attributes = True