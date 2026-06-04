from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Boolean
)

from sqlalchemy.orm import relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    full_name = Column(String)

    username = Column(
        String,
        unique=True
    )

    hashed_password = Column(String)

    role = Column(String)

    is_active = Column(Integer, default=1)


class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True)

    workshop_code = Column(String, unique=True)

    workshop_type = Column(String)

    scheduled_time = Column(DateTime)

    expected_attendees = Column(Integer)

    city = Column(String)

    status = Column(
        String,
        default="Pending"
    )

    trainer_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    consultant = relationship("User", foreign_keys=[trainer_id])


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    address = Column(String)

    rental_cost = Column(String)

    room_type = Column(String)

    equipment_supported = Column(String)

    is_available = Column(Integer, default=1)

    capacity = Column(Integer)


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
        String,
        default="Draft"
    )

    created_at = Column(DateTime)

    meeting_rooms = Column(Integer)

    seating_style = Column(String)

    av_requirements = Column(Text)

    revision_notes = Column(Text)

    updated_at = Column(DateTime)

    pending_review_by = Column(String)

    approved_at = Column(DateTime)

    workshop = relationship("Workshop")

    venue = relationship("Venue")

    sales_manager = relationship("User", foreign_keys=[sales_manager_id])


class TravelSchedule(Base):
    __tablename__ = "travel_schedules"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    consultant_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    transport_type = Column(String)

    departure_location = Column(String)

    destination = Column(String)

    departure_time = Column(DateTime)

    travel_info = Column(Text)

    status = Column(
        String,
        default="Pending"
    )

    confirmation_file = Column(String)

    workshop = relationship("Workshop")

    consultant = relationship("User")


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    quantity_needed = Column(Integer)

    packaging_status = Column(String, default="Pending")

    shipping_status = Column(String, default="Pending")

    shipping_date = Column(DateTime)

    workshop = relationship("Workshop")


class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    quantity_needed = Column(Integer)

    packaging_status = Column(String, default="Pending")

    shipping_status = Column(String, default="Pending")

    shipping_date = Column(DateTime)

    created_at = Column(DateTime)

    workshop = relationship("Workshop")


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
        String,
        default="Pending"
    )

    shipping_status = Column(
        String,
        default="Pending"
    )

    material_request = relationship(
        "MaterialRequest"
    )

    material = relationship(
        "Material"
    )


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

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


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

    created_at = Column(DateTime)

    user = relationship("User")