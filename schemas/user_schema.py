from pydantic import BaseModel, ConfigDict
from models.models import RoleEnum

# Schema dùng để nhận dữ liệu khi tạo người dùng mới
class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str
    role: RoleEnum


# Schema dùng để cập nhật thông tin người dùng
class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    full_name: str | None = None
    role: RoleEnum | None = None
    is_active: bool | None = None


# Schema dùng riêng để tạo tài khoản Admin đầu tiên
class FirstAdminCreate(BaseModel):
    username: str
    password: str
    full_name: str


# Schema dùng để nhận dữ liệu khi đăng nhập
class UserLogin(BaseModel):
    username: str
    password: str

# Schema dùng để trả về thông tin người dùng (ẩn mật khẩu)
class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    role: RoleEnum
    is_active: bool

    # Cấu hình để Pydantic có thể đọc dữ liệu trực tiếp từ SQLAlchemy Model
    model_config = ConfigDict(from_attributes=True)
    
