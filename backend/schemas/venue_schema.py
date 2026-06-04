from pydantic import BaseModel


class VenueCreate(BaseModel):
    name: str
    address: str
    contact_phone: str
    description: str
    sales_manager_id: int


class VenueUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    contact_phone: str | None = None
    description: str | None = None


class VenueResponse(BaseModel):
    id: int
    name: str
    address: str
    contact_phone: str
    description: str
    sales_manager_id: int

    class Config:
        from_attributes = True