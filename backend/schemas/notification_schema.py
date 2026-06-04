from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    receiver_id: int
    title: str
    message: str

class NotificationResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
