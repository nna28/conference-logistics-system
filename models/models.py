from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Float,
    ForeignKey,
    Enum,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from db.database import Base


# =====================
# ENUMS
# =====================

class RoleEnum(enum.Enum):
    ADMIN = "Admin"
    LOGISTICS_COORDINATOR = "Logistics Coordinator"
    BOOKING_STAFF = "Booking Staff"
    SALES_MANAGER = "Sales Manager"
    TRAINING_CONSULTANT = "Training Consultant"
    MATERIALS_HANDLING_STAFF = "Materials Handling Staff"


class WorkshopStatusEnum(enum.Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    COMPLETED = "Completed"


class ContractStatusEnum(enum.Enum):
    PENDING = "Pending"
    EDITING = "Editing"
    APPROVED = "Approved"
    COMPLETED = "Completed"


class PackagingStatusEnum(enum.Enum):
    PENDING = "Pending"
    PACKED = "Packed"


class ShippingStatusEnum(enum.Enum):
    PENDING = "Pending"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"


# =====================
# USER
# =====================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)

    role = Column(Enum(RoleEnum), nullable=False)

    is_active = Column(Boolean, default=True)


# =====================
# WORKSHOP
# =====================

class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True, index=True)

    workshop_code = Column(String, unique=True, nullable=False)

    workshop_type = Column(String, nullable=False)

    scheduled_time = Column(DateTime, nullable=False)

    city = Column(String, nullable=False)

    trainer_id = Column(Integer, ForeignKey("users.id"))

    expected_attendees = Column(Integer, default=0)

    status = Column(
        Enum(WorkshopStatusEnum),
        default=WorkshopStatusEnum.PENDING
    )

    trainer = relationship("User")


# =====================
# VENUE
# =====================

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    address = Column(String, nullable=False)

    capacity = Column(Integer, nullable=False)

    rental_cost = Column(Float, nullable=False)

    room_type = Column(String)

    equipment_supported = Column(String)

    is_available = Column(Boolean, default=True)


# =====================
# CONTRACT
# =====================

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)

    workshop_id = Column(Integer, ForeignKey("workshops.id"))

    meeting_rooms = Column(Integer)

    seating_style = Column(String)

    av_requirements = Column(String)

    venue_id = Column(Integer, ForeignKey("venues.id"))

    sales_manager_id = Column(Integer, ForeignKey("users.id"))

    status = Column(
        Enum(ContractStatusEnum),
        default=ContractStatusEnum.PENDING
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    workshop = relationship("Workshop")

    venue = relationship("Venue")

    sales_manager = relationship("User")



# =====================
# FLIGHT BOOKING
# =====================

class FlightBooking(Base):
    __tablename__ = "flight_bookings"

    id = Column(Integer, primary_key=True, index=True)

    workshop_id = Column(Integer, ForeignKey("workshops.id"))

    trainer_id = Column(Integer, ForeignKey("users.id"))

    flight_code = Column(String, nullable=False)

    departure_location = Column(String, nullable=False)

    destination = Column(String, nullable=False)

    departure_time = Column(DateTime, nullable=False)

    confirmation_document = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workshop = relationship("Workshop")

    trainer = relationship("User")


# =====================
# MATERIAL REQUEST
# =====================

class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True, index=True)

    workshop_id = Column(Integer, ForeignKey("workshops.id"))

    quantity_needed = Column(Integer, default=0)

    packaging_status = Column(
        Enum(PackagingStatusEnum),
        default=PackagingStatusEnum.PENDING
    )

    shipping_status = Column(
        Enum(ShippingStatusEnum),
        default=ShippingStatusEnum.PENDING
    )

    shipping_date = Column(DateTime)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workshop = relationship("Workshop")


# =====================
# NOTIFICATION
# =====================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    sender_id = Column(Integer, ForeignKey("users.id"))

    receiver_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    is_read = Column(Boolean, default=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )