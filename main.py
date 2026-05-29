from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from db.database import engine, get_db
from models.models import Base, RoleEnum, User
from schemas.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from schemas.user_schema import FirstAdminCreate, UserCreate, UserLogin, UserResponse, UserUpdate


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Logistics Management System API",
    description="Hệ thống quản lý quy trình tổ chức hội thảo đào tạo",
    version="1.0.0",
)

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise credentials_exception

    username = payload.get("sub")
    if not username:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa.",
        )

    return user


def require_roles(*allowed_roles: RoleEnum):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền truy cập chức năng này.",
            )
        return current_user

    return role_checker


def get_user_or_404(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng.",
        )
    return user


def ensure_can_remove_admin_role(user: User, db: Session):
    if user.role != RoleEnum.ADMIN or not user.is_active:
        return

    active_admin_count = (
        db.query(User)
        .filter(User.role == RoleEnum.ADMIN, User.is_active == True)
        .count()
    )
    if active_admin_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể vô hiệu hóa hoặc đổi quyền Admin hoạt động cuối cùng.",
        )


@app.get("/")
def read_root():
    return {"message": "Chào mừng đến với API Hệ thống Quản lý Logistics!"}


@app.post(
    "/auth/first-admin",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_first_admin(admin_data: FirstAdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(User).filter(User.role == RoleEnum.ADMIN).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tài khoản Admin đầu tiên đã tồn tại.",
        )

    existing_user = db.query(User).filter(User.username == admin_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username đã tồn tại.",
        )

    try:
        hashed_password = get_password_hash(admin_data.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    admin = User(
        username=admin_data.username,
        hashed_password=hashed_password,
        full_name=admin_data.full_name,
        role=RoleEnum.ADMIN,
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin


@app.post("/auth/login", tags=["Xác thực"])
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Tìm người dùng trong Database
    user = db.query(User).filter(User.username == login_data.username).first()
    
    # 2. Kiểm tra tài khoản có tồn tại và mật khẩu có khớp không
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Tạo JWT Token nếu đăng nhập thành công
    # Nhúng username và quyền (role) vào bên trong token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role.value}
    )
    
    # Trả về token theo chuẩn OAuth2
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=UserResponse, tags=["Xác thực"])
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/admin/check", tags=["Admin"])
def admin_check(current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    return {
        "message": "Bạn đang truy cập với quyền Admin.",
        "username": current_user.username,
    }


@app.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Quản lý người dùng"],
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username đã tồn tại.",
        )

    try:
        hashed_password = get_password_hash(user_data.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    user = User(
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@app.get(
    "/users",
    response_model=list[UserResponse],
    tags=["Quản lý người dùng"],
)
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    limit = min(limit, 100)
    return db.query(User).order_by(User.id).offset(skip).limit(limit).all()


@app.get(
    "/users/{user_id}",
    response_model=UserResponse,
    tags=["Quản lý người dùng"],
)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    return get_user_or_404(user_id, db)


@app.patch(
    "/users/{user_id}",
    response_model=UserResponse,
    tags=["Quản lý người dùng"],
)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    user = get_user_or_404(user_id, db)
    update_data = user_data.model_dump(exclude_unset=True)

    if "username" in update_data:
        existing_user = (
            db.query(User)
            .filter(User.username == update_data["username"], User.id != user_id)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username đã tồn tại.",
            )
        user.username = update_data["username"]

    if "full_name" in update_data:
        user.full_name = update_data["full_name"]

    if "password" in update_data:
        try:
            user.hashed_password = get_password_hash(update_data["password"])
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc),
            ) from exc

    if "role" in update_data and update_data["role"] != user.role:
        if update_data["role"] != RoleEnum.ADMIN:
            ensure_can_remove_admin_role(user, db)
        user.role = update_data["role"]

    if "is_active" in update_data and update_data["is_active"] != user.is_active:
        if update_data["is_active"] is False:
            ensure_can_remove_admin_role(user, db)
        user.is_active = update_data["is_active"]

    db.commit()
    db.refresh(user)

    return user


@app.delete(
    "/users/{user_id}",
    response_model=UserResponse,
    tags=["Quản lý người dùng"],
)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    user = get_user_or_404(user_id, db)
    ensure_can_remove_admin_role(user, db)

    user.is_active = False
    db.commit()
    db.refresh(user)

    return user
