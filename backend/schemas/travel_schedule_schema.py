from pydantic import BaseModel
from datetime import datetime


class TravelScheduleCreate(BaseModel):
    workshop_id: int
    consultant_id: int
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
    status: str | None = None


class TravelScheduleResponse(BaseModel):
    id: int
    workshop_id: int
    consultant_id: int
    transport_type: str
    departure_location: str
    destination: str
    departure_time: datetime
    travel_info: str
    status: str

    class Config:
        from_attributes = True