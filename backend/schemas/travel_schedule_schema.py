from pydantic import BaseModel
from datetime import datetime

from models.models import ConfirmationStatusEnum

class TravelScheduleCreate(BaseModel):
    workshop_id: int
    trainer_id: int
    transport_type: str
    departure_location: str
    destination: str
    departure_time: datetime
    travel_info: str


class TravelScheduleUpdate(BaseModel):
    transport_type: str | None = None
    departure_location: str | None = None
    destination: str | None = None
    departure_time: datetime | None = None
    travel_info: str | None = None
    status: ConfirmationStatusEnum | None = None


class TravelScheduleResponse(BaseModel):
    id: int
    workshop_id: int
    trainer_id: int
    transport_type: str
    departure_location: str
    destination: str
    departure_time: datetime
    travel_info: str
    status: str

    class Config:
        from_attributes = True