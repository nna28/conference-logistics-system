from pydantic import BaseModel


class VenueCreate(BaseModel):
    name: str
    address: str
    capacity: int
    rental_cost: float
    room_type: str | None = None
    equipment_supported: str | None = None


class VenueUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    capacity: int | None = None
    rental_cost: float | None = None
    room_type: str | None = None
    equipment_supported: str | None = None
    is_available: bool | None = None


class VenueResponse(BaseModel):
    id: int
    name: str
    address: str
    capacity: int
    rental_cost: float
    room_type: str | None
    equipment_supported: str | None
    is_available: bool

    class Config:
        from_attributes = True