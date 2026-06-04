from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
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

    email = Column(
        String,
        unique=True
    )

    password_hash = Column(String)

    role = Column(String)


class Workshop(Base):
    __tablename__ = "workshops"

    id = Column(Integer, primary_key=True)

    workshop_code = Column(String, unique=True)

    workshop_type = Column(String)

    scheduled_time = Column(DateTime)

    expected_attendees = Column(Integer)

    status = Column(
        String,
        default="Pending"
    )

    consultant_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    consultant = relationship("User")


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    address = Column(String)

    contact_phone = Column(String)

    description = Column(Text)

    sales_manager_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    sales_manager = relationship("User")


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

    contract_info = Column(Text)

    status = Column(
        String,
        default="Draft"
    )

    workshop = relationship("Workshop")

    venue = relationship("Venue")


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

    workshop = relationship("Workshop")

    consultant = relationship("User")


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True)

    material_name = Column(String)

    material_type = Column(String)


class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True)

    workshop_id = Column(
        Integer,
        ForeignKey("workshops.id")
    )

    request_date = Column(DateTime)

    delivery_address = Column(String)

    registered_attendees = Column(Integer)

    status = Column(
        String,
        default="Pending"
    )

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

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    title = Column(String)

    message = Column(Text)

    is_read = Column(
        Integer,
        default=0
    )

    created_at = Column(DateTime)

    user = relationship("User")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    action = Column(String)

    entity = Column(String)

    created_at = Column(DateTime)

    user = relationship("User")