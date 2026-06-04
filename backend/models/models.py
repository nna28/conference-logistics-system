import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
    Enum
)

from sqlalchemy.orm import relationship

from db.database import Base


# ==================================================
# ENUMS
# ==================================================

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
    COMPLETED = "Completed"


class ShippingStatusEnum(enum.Enum):
    PENDING = "Pending"
    SHIPPING = "Shipping"
    DELIVERED = "Delivered"


class ConfirmationStatusEnum(enum.Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"


class MaterialTypeEnum(enum.Enum):
    TRAINING_MATERIAL = "Training Material"
    PROMOTIONAL_MATERIAL = "Promotional Material"
    PARTICIPANT_GIFT = "Participant Gift"


# ==================================================
# USER
# ==================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    full_name = Column(
        String,
        nullable=False
    )

    username = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    role = Column(
        Enum(RoleEnum),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(DateTime)

    updated_at = Column(DateTime)


# ==================================================
# WORKSHOP
# ==================================================

class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True)

    workshop_code = Column(
        String,
        unique=True
    )

    workshop_type = Column(String)

    scheduled_time = Column(DateTime)

    expected_attendees = Column(Integer)

    city = Column(String)

    status = Column(
        Enum(WorkshopStatusEnum),
        default=WorkshopStatusEnum.PENDING
    )

    trainer_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    training_consultant = relationship(
        "User",
        foreign_keys=[trainer_id]
    )


# ==================================================
# VENUE
# ==================================================

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    address = Column(String)

    rental_cost = Column(String)

    room_type = Column(String)

    equipment_supported = Column(String)

    is_available = Column(
        Boolean,
        default=True
    )

    capacity = Column(Integer)


# ==================================================
# CONTRACT
# ==================================================

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    venue_id = Column(
        Integer,
        ForeignKey("venues.id")
    )

    sales_manager_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    status = Column(
        Enum(ContractStatusEnum),
        default=ContractStatusEnum.PENDING
    )

    created_at = Column(DateTime)

    updated_at = Column(DateTime)

    approved_at = Column(DateTime)

    meeting_rooms = Column(Integer)

    seating_style = Column(String)

    av_requirements = Column(Text)

    revision_notes = Column(Text)

    pending_review_by = Column(String)

    workshop = relationship("Workshop")

    venue = relationship("Venue")

    sales_manager = relationship(
        "User",
        foreign_keys=[sales_manager_id]
    )


# ==================================================
# TRAVEL SCHEDULE
# ==================================================

class TravelSchedule(Base):
    __tablename__ = "travel_schedules"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    trainer_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    transport_type = Column(String)

    departure_location = Column(String)

    destination = Column(String)

    departure_time = Column(DateTime)

    travel_info = Column(Text)

    status = Column(
        Enum(ConfirmationStatusEnum),
        default=ConfirmationStatusEnum.PENDING
    )

    confirmation_file = Column(String)

    workshop = relationship("Workshop")

    consultant = relationship(
        "User",
        foreign_keys=[trainer_id]
    )


# ==================================================
# MATERIAL
# ==================================================

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    material_type = Column(
        Enum(MaterialTypeEnum)
    )

    quantity_needed = Column(Integer)

    packaging_status = Column(
        Enum(PackagingStatusEnum),
        default=PackagingStatusEnum.PENDING
    )

    shipping_status = Column(
        Enum(ShippingStatusEnum),
        default=ShippingStatusEnum.PENDING
    )

    shipping_date = Column(DateTime)

    workshop = relationship("Workshop")


# ==================================================
# MATERIAL REQUEST
# ==================================================

class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    material_type = Column(
        Enum(MaterialTypeEnum)
    )

    quantity_needed = Column(Integer)

    packaging_status = Column(
        Enum(PackagingStatusEnum),
        default=PackagingStatusEnum.PENDING
    )

    shipping_status = Column(
        Enum(ShippingStatusEnum),
        default=ShippingStatusEnum.PENDING
    )

    shipping_date = Column(DateTime)

    created_at = Column(DateTime)

    workshop = relationship("Workshop")


# ==================================================
# MATERIAL SHIPMENT
# ==================================================

class MaterialShipment(Base):
    __tablename__ = "material_shipments"

    id = Column(Integer, primary_key=True)

    material_request_id = Column(
        Integer,
        ForeignKey("material_requests.id")
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id")
    )

    quantity = Column(Integer)

    packaging_status = Column(
        Enum(PackagingStatusEnum),
        default=PackagingStatusEnum.PENDING
    )

    shipping_status = Column(
        Enum(ShippingStatusEnum),
        default=ShippingStatusEnum.PENDING
    )

    material_request = relationship(
        "MaterialRequest"
    )

    material = relationship(
        "Material"
    )


# ==================================================
# NOTIFICATION
# ==================================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    sender_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    receiver_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    title = Column(String)

    message = Column(Text)

    is_read = Column(
        Boolean,
        default=False
    )

    created_at = Column(DateTime)

    sender = relationship(
        "User",
        foreign_keys=[sender_id]
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id]
    )


# ==================================================
# AUDIT LOG
# ==================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    action = Column(String)

    entity = Column(String)

    entity_id = Column(Integer)

    old_value = Column(Text)

    new_value = Column(Text)

    created_at = Column(DateTime)

    user = relationship("User")