from pydantic import BaseModel
from typing import Optional

class VenueCreate(BaseModel):
    name: str
    address: Optional[str] = None
    rental_cost: Optional[float] = None  # ✅ Đã chuyển từ str sang float
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = True

class VenueUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    rental_cost: Optional[float] = None  # ✅ Đã chuyển từ str sang float
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = None

class VenueResponse(BaseModel):
    id: int
    name: Optional[str] = None
    address: Optional[str] = None
    rental_cost: Optional[float] = None  # ✅ Đã chuyển từ str sang float
    room_type: Optional[str] = None
    equipment_supported: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = None

    class Config:
        from_attributes = True