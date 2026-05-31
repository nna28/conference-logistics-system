from pydantic import BaseModel
from datetime import datetime


class FlightBookingCreate(BaseModel):
    workshop_id: int
    trainer_id: int
    flight_code: str
    departure_location: str
    destination: str
    departure_time: datetime
    confirmation_document: str | None = None


class FlightBookingUpdate(BaseModel):
    workshop_id: int | None = None
    trainer_id: int | None = None
    flight_code: str | None = None
    departure_location: str | None = None
    destination: str | None = None
    departure_time: datetime | None = None
    confirmation_document: str | None = None


class FlightBookingResponse(BaseModel):
    id: int

    workshop_id: int
    trainer_id: int

    flight_code: str
    departure_location: str
    destination: str

    departure_time: datetime

    confirmation_document: str | None

    created_at: datetime

    class Config:
        from_attributes = True