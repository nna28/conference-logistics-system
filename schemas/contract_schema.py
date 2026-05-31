from pydantic import BaseModel
from datetime import datetime

from models.models import ContractStatusEnum


class ContractCreate(BaseModel):
    workshop_id: int
    venue_id: int
    sales_manager_id: int

    meeting_rooms: int
    seating_style: str
    av_requirements: str


class ContractUpdate(BaseModel):
    workshop_id: int | None = None
    venue_id: int | None = None
    sales_manager_id: int | None = None

    meeting_rooms: int
    seating_style: str
    av_requirements: str

    status: ContractStatusEnum | None = None


class ContractResponse(BaseModel):
    id: int

    workshop_id: int
    venue_id: int
    sales_manager_id: int

    meeting_rooms: int
    seating_style: str
    av_requirements: str

    status: ContractStatusEnum

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True