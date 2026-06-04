from pydantic import BaseModel


class MaterialCreate(BaseModel):
    material_name: str
    material_type: str


class MaterialResponse(BaseModel):
    id: int
    material_name: str
    material_type: str

    class Config:
        from_attributes = True