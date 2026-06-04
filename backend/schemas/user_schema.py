from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    full_name: str
    username: str
    role: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: Optional[int] = 1

    class Config:
        from_attributes = True