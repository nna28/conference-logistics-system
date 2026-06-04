from pydantic import BaseModel
from datetime import datetime


class MaterialRequestCreate(BaseModel):
    workshop_id: int
    request_date: datetime
    delivery_address: str
    registered_attendees: int


class MaterialRequestUpdate(BaseModel):
    delivery_address: str | None = None
    registered_attendees: int | None = None
    status: str | None = None


class MaterialRequestResponse(BaseModel):
    id: int
    workshop_id: int
    request_date: datetime
    delivery_address: str
    registered_attendees: int
    status: str

    class Config:
        from_attributes = True