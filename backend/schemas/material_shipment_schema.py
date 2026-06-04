from pydantic import BaseModel


class MaterialShipmentCreate(BaseModel):
    material_request_id: int
    material_id: int
    quantity: int


class MaterialShipmentUpdate(BaseModel):
    packaging_status: str | None = None
    shipping_status: str | None = None


class MaterialShipmentResponse(BaseModel):
    id: int
    material_request_id: int
    material_id: int
    quantity: int
    packaging_status: str
    shipping_status: str

    class Config:
        from_attributes = True