from datetime import datetime, timedelta
import os
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from jose import JWTError, jwt

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "venv" / ".env")

# Khóa bí mật để ký JWT (Bạn cần thêm SECRET_KEY vào file .env)
SECRET_KEY = os.getenv("SECRET_KEY", "chuoi-bi-mat-tam-thoi-doi-sau")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token sống trong 1 ngày


def _password_bytes(password: str) -> bytes:
    password_data = password.encode("utf-8")
    if len(password_data) > 72:
        raise ValueError("Password must be at most 72 bytes when using bcrypt.")
    return password_data


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(
        _password_bytes(plain_password),
        hashed_password.encode("utf-8"),
    )

def get_password_hash(password):
    return bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode("utf-8")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
