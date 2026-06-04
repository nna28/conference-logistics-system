from datetime import datetime

from db.database import SessionLocal
from core.security import hash_password

from models.models import (
    User,
    Workshop,
    Venue,
    Contract,
    TravelSchedule,
    Material,
    MaterialRequest,
    MaterialShipment,

    RoleEnum,
    WorkshopStatusEnum,
    ContractStatusEnum,
    ConfirmationStatusEnum,
    MaterialTypeEnum,
    PackagingStatusEnum,
    ShippingStatusEnum
)

db = SessionLocal()

# ==================================================
# USERS
# ==================================================

admin = User(
    full_name="System Admin",
    username="admin",
    hashed_password=hash_password("123456"),
    role=RoleEnum.ADMIN,
    is_active=True
)

booking_staff = User(
    full_name="Booking Staff",
    username="booking",
    hashed_password=hash_password("123456"),
    role=RoleEnum.BOOKING_STAFF,
    is_active=True
)

sales_manager = User(
    full_name="Sales Manager",
    username="sales",
    hashed_password=hash_password("123456"),
    role=RoleEnum.SALES_MANAGER,
    is_active=True
)

trainer = User(
    full_name="Training Consultant",
    username="trainer",
    hashed_password=hash_password("123456"),
    role=RoleEnum.TRAINING_CONSULTANT,
    is_active=True
)

logistics = User(
    full_name="Logistics Coordinator",
    username="logistics",
    hashed_password=hash_password("123456"),
    role=RoleEnum.LOGISTICS_COORDINATOR,
    is_active=True
)

materials_staff = User(
    full_name="Materials Staff",
    username="materials",
    hashed_password=hash_password("123456"),
    role=RoleEnum.MATERIALS_HANDLING_STAFF,
    is_active=True
)

db.add_all([
    admin,
    booking_staff,
    sales_manager,
    trainer,
    logistics,
    materials_staff
])

db.commit()

db.refresh(admin)
db.refresh(booking_staff)
db.refresh(sales_manager)
db.refresh(trainer)
db.refresh(logistics)
db.refresh(materials_staff)

print("Users created")

# ==================================================
# WORKSHOP
# ==================================================

workshop = Workshop(
    workshop_code="WS001",
    workshop_type="Leadership Training",
    scheduled_time=datetime(2026, 6, 10, 8, 0),
    expected_attendees=50,
    city="Ha Noi",
    trainer_id=trainer.id,
    status=WorkshopStatusEnum.PENDING
)

db.add(workshop)
db.commit()
db.refresh(workshop)

print("Workshop created")

# ==================================================
# VENUE
# ==================================================

venue = Venue(
    name="Hanoi Convention Center",
    address="57 Pham Hung, Ha Noi",
    rental_cost="5000",
    room_type="Conference Hall",
    equipment_supported="Projector, Sound System",
    capacity=100,
    is_available=True
)

db.add(venue)
db.commit()
db.refresh(venue)

print("Venue created")

# ==================================================
# CONTRACT
# ==================================================

contract = Contract(
    workshop_id=workshop.id,
    venue_id=venue.id,
    sales_manager_id=sales_manager.id,
    status=ContractStatusEnum.PENDING,
    meeting_rooms=2,
    seating_style="Classroom",
    av_requirements="Projector, Microphone",
    revision_notes="Initial contract",
    pending_review_by="Sales Manager"
)

db.add(contract)
db.commit()
db.refresh(contract)

print("Contract created")

# ==================================================
# TRAVEL SCHEDULE
# ==================================================

travel_schedule = TravelSchedule(
    workshop_id=workshop.id,
    trainer_id=trainer.id,
    transport_type="Flight",
    departure_location="Ho Chi Minh City",
    destination="Ha Noi",
    departure_time=datetime(2026, 6, 9, 18, 0),
    travel_info="VN220",
    status=ConfirmationStatusEnum.CONFIRMED
)

db.add(travel_schedule)
db.commit()
db.refresh(travel_schedule)

print("Travel Schedule created")

# ==================================================
# MATERIALS
# ==================================================

materials = [
    Material(
        workshop_id=workshop.id,
        material_type=MaterialTypeEnum.TRAINING_MATERIAL,
        quantity_needed=50,
        packaging_status=PackagingStatusEnum.PENDING,
        shipping_status=ShippingStatusEnum.PENDING
    ),
    Material(
        workshop_id=workshop.id,
        material_type=MaterialTypeEnum.PROMOTIONAL_MATERIAL,
        quantity_needed=50,
        packaging_status=PackagingStatusEnum.PENDING,
        shipping_status=ShippingStatusEnum.PENDING
    ),
    Material(
        workshop_id=workshop.id,
        material_type=MaterialTypeEnum.PARTICIPANT_GIFT,
        quantity_needed=50,
        packaging_status=PackagingStatusEnum.PENDING,
        shipping_status=ShippingStatusEnum.PENDING
    )
]

db.add_all(materials)
db.commit()

for material in materials:
    db.refresh(material)

print("Materials created")

# ==================================================
# MATERIAL REQUESTS
# ==================================================

material_requests = []

for material in materials:

    request = MaterialRequest(
        workshop_id=workshop.id,
        material_type=material.material_type,
        quantity_needed=material.quantity_needed,
        packaging_status=PackagingStatusEnum.PENDING,
        shipping_status=ShippingStatusEnum.PENDING,
        created_at=datetime.utcnow()
    )

    db.add(request)
    material_requests.append(request)

db.commit()

for request in material_requests:
    db.refresh(request)

print("Material Requests created")

# ==================================================
# MATERIAL SHIPMENTS
# ==================================================

for index, material in enumerate(materials):

    shipment = MaterialShipment(
        material_request_id=material_requests[index].id,
        material_id=material.id,
        quantity=material.quantity_needed,
        packaging_status=PackagingStatusEnum.PENDING,
        shipping_status=ShippingStatusEnum.PENDING
    )

    db.add(shipment)

db.commit()

print("Material Shipments created")

print("====================================")
print("Workflow Seed Completed Successfully")
print("====================================")
print("Admin Login")
print("Username: admin")
print("Password: 123456")

db.close()