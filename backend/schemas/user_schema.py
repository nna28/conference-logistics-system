from pydantic import BaseModel
from typing import Optional

from models.models import RoleEnum

class UserBase(BaseModel):
    full_name: str
    username: str
    role: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    role: Optional[RoleEnum] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: Optional[int] = 1

    class Config:
        from_attributes = True