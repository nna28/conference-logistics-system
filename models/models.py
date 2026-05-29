from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, Enum
from sqlalchemy.orm import relationship, declarative_base
import enum
from datetime import datetime

Base = declarative_base()

# --- ENUMS (Định nghĩa các trạng thái) ---
class RoleEnum(enum.Enum):
    LOGISTICS_COORDINATOR = "Logistics Coordinator"
    BOOKINGS = "Bookings"
    SALES_MANAGER = "Sales Manager"
    TRAINING_CONSULTANT = "Training Consultant"
    TRAVEL_AGENCY = "Travel Agency"
    MATERIALS_HANDLING = "Materials-handling"
    ADMIN = "Admin"

class WorkshopStatusEnum(enum.Enum):
    PENDING = "Chờ xử lý"
    PROCESSING = "Đang xử lý"
    COMPLETED = "Đã hoàn tất"

class ContractStatusEnum(enum.Enum):
    PENDING = "Chờ xử lý"
    EDITING = "Đang chỉnh sửa"
    APPROVED = "Đã phê duyệt"
    COMPLETED = "Đã hoàn tất"

# --- BẢNG DỮ LIỆU CHÍNH ---

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(RoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)

class Workshop(Base):
    __tablename__ = 'workshops'
    id = Column(Integer, primary_key=True, index=True)
    workshop_code = Column(String, unique=True, index=True, nullable=False)
    workshop_type = Column(String, nullable=False)
    scheduled_time = Column(DateTime, nullable=False)
    city = Column(String, nullable=False)
    trainer_id = Column(Integer, ForeignKey('users.id')) # Liên kết với Training Consultant
    expected_attendees = Column(Integer, default=0)
    status = Column(Enum(WorkshopStatusEnum), default=WorkshopStatusEnum.PENDING)
    
    # Relationships
    trainer = relationship("User", foreign_keys=[trainer_id])
    contracts = relationship("Contract", back_populates="workshop")
    materials = relationship("Material", back_populates="workshop")

class Venue(Base):
    __tablename__ = 'venues'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    rental_cost = Column(Float, nullable=False)
    room_type = Column(String)
    equipment_supported = Column(String)
    is_available = Column(Boolean, default=True)

class Contract(Base):
    __tablename__ = 'contracts'
    id = Column(Integer, primary_key=True, index=True)
    workshop_id = Column(Integer, ForeignKey('workshops.id'))
    venue_id = Column(Integer, ForeignKey('venues.id'))
    sales_manager_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Enum(ContractStatusEnum), default=ContractStatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workshop = relationship("Workshop", back_populates="contracts")
    venue = relationship("Venue")

class Flight(Base):
    __tablename__ = 'flights'
    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey('users.id'))
    workshop_id = Column(Integer, ForeignKey('workshops.id'))
    flight_code = Column(String, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    departure_location = Column(String, nullable=False) # Điểm đi
    destination = Column(String, nullable=False)        # Điểm đến

class Material(Base):
    __tablename__ = 'materials'
    id = Column(Integer, primary_key=True, index=True)
    workshop_id = Column(Integer, ForeignKey('workshops.id'))
    quantity_needed = Column(Integer, default=0)
    packaging_status = Column(String, default="Chưa đóng gói") # Có thể dùng Enum
    shipping_status = Column(String, default="Chưa vận chuyển")
    shipping_date = Column(DateTime, nullable=True)
    
    # Relationships
    workshop = relationship("Workshop", back_populates="materials")