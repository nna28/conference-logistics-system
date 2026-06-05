from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class WorkshopCreate(BaseModel):
    workshop_code: str
    workshop_type: str
    scheduled_time: Optional[datetime] = None
    expected_attendees: Optional[int] = None
    city: Optional[str] = None
    trainer_id: Optional[int] = None
    status: Optional[str] = "PENDING"


class WorkshopUpdate(BaseModel):
    workshop_type: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    expected_attendees: Optional[int] = None
    city: Optional[str] = None
    status: Optional[str] = None
    trainer_id: Optional[int] = None


class WorkshopResponse(BaseModel):
    id: int
    workshop_code: str
    workshop_type: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    expected_attendees: Optional[int] = None
    city: Optional[str] = None
    status: Optional[str] = None
    trainer_id: Optional[int] = None

    class Config:
        from_attributes = True