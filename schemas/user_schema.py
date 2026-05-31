from pydantic import BaseModel

from models.models import RoleEnum


class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    role: RoleEnum
    is_active: bool

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    full_name: str
    username: str
    password: str
    role: RoleEnum


class UserUpdate(BaseModel):
    full_name: str
    role: RoleEnum
    is_active: bool