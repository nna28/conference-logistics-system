from pydantic import BaseModel
from typing import Optional


class VenueCreate(BaseModel):
    name: str
    address: Optional[str] = None
    rental_cost: Optional[str] = None
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[int] = 1


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    rental_cost: Optional[str] = None
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[int] = None


class VenueResponse(BaseModel):
    id: int
    name: Optional[str] = None
    address: Optional[str] = None
    rental_cost: Optional[str] = None
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[int] = None

    class Config:
        from_attributes = True