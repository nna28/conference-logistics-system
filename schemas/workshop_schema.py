from pydantic import BaseModel
from datetime import datetime

from models.models import WorkshopStatusEnum


class WorkshopCreate(BaseModel):
    workshop_code: str
    workshop_type: str
    scheduled_time: datetime
    city: str
    trainer_id: int
    expected_attendees: int = 0


class WorkshopUpdate(BaseModel):
    workshop_type: str | None = None
    scheduled_time: datetime | None = None
    city: str | None = None
    trainer_id: int | None = None
    expected_attendees: int | None = None
    status: WorkshopStatusEnum | None = None


class WorkshopResponse(BaseModel):
    id: int
    workshop_code: str
    workshop_type: str
    scheduled_time: datetime
    city: str
    trainer_id: int | None
    expected_attendees: int
    status: WorkshopStatusEnum

    class Config:
        from_attributes = True