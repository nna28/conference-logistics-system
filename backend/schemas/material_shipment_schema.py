from pydantic import BaseModel

from models.models import (
    PackagingStatusEnum,
    ShippingStatusEnum
)

class MaterialShipmentCreate(BaseModel):
    material_request_id: int
    material_id: int
    quantity: int


class MaterialShipmentUpdate(BaseModel):
    packaging_status: PackagingStatusEnum | None = None
    shipping_status: ShippingStatusEnum | None = None


class MaterialShipmentResponse(BaseModel):
    id: int
    material_request_id: int
    material_id: int
    quantity: int
    packaging_status: PackagingStatusEnum
    shipping_status: ShippingStatusEnum

    class Config:
        from_attributes = True