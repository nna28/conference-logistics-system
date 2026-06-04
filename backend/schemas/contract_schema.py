from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ContractCreate(BaseModel):
    workshop_id: int
    venue_id: int
    sales_manager_id: Optional[int] = None
    status: Optional[str] = "Draft"
    meeting_rooms: Optional[int] = None
    seating_style: Optional[str] = None
    av_requirements: Optional[str] = None
    revision_notes: Optional[str] = None


class ContractUpdate(BaseModel):
    status: Optional[str] = None
    sales_manager_id: Optional[int] = None
    meeting_rooms: Optional[int] = None
    seating_style: Optional[str] = None
    av_requirements: Optional[str] = None
    revision_notes: Optional[str] = None
    pending_review_by: Optional[str] = None


class ContractResponse(BaseModel):
    id: int
    workshop_id: Optional[int] = None
    venue_id: Optional[int] = None
    sales_manager_id: Optional[int] = None
    status: Optional[str] = None
    meeting_rooms: Optional[int] = None
    seating_style: Optional[str] = None
    av_requirements: Optional[str] = None
    revision_notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True