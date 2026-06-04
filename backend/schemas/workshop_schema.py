from pydantic import BaseModel
from datetime import datetime


class WorkshopCreate(BaseModel):
    workshop_code: str
    workshop_type: str
    scheduled_time: datetime
    expected_attendees: int
    consultant_id: int


class WorkshopUpdate(BaseModel):
    workshop_type: str | None = None
    scheduled_time: datetime | None = None
    expected_attendees: int | None = None
    status: str | None = None


class WorkshopResponse(BaseModel):
    id: int
    workshop_code: str
    workshop_type: str
    scheduled_time: datetime
    expected_attendees: int
    status: str
    consultant_id: int

    class Config:
        from_attributes = True