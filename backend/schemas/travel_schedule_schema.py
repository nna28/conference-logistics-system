from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TravelScheduleCreate(BaseModel):
    workshop_id: int
    consultant_id: int
    transport_type: str
    departure_location: str
    destination: str
    departure_time: datetime
    travel_info: Optional[str] = None


class TravelScheduleUpdate(BaseModel):
    transport_type: Optional[str] = None
    departure_location: Optional[str] = None
    destination: Optional[str] = None
    departure_time: Optional[datetime] = None
    travel_info: Optional[str] = None
    status: Optional[str] = None


class TravelScheduleResponse(BaseModel):
    id: int
    workshop_id: int
    consultant_id: int
    transport_type: Optional[str] = None
    departure_location: Optional[str] = None
    destination: Optional[str] = None
    departure_time: Optional[datetime] = None
    travel_info: Optional[str] = None
    status: Optional[str] = None
    confirmation_file: Optional[str] = None

    class Config:
        from_attributes = True