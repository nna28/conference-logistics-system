from datetime import datetime

from db.database import SessionLocal

from models.models import (
    User,
    Workshop,
    Venue,
    Contract,
    TravelSchedule,
    Material,
    MaterialRequest,
    MaterialShipment
)

db = SessionLocal()

# =========================
# WORKSHOP
# =========================

workshop = Workshop(
    workshop_code="WS001",
    workshop_type="Leadership Training",
    scheduled_time=datetime(2026, 6, 10, 8, 0),
    expected_attendees=50,
    consultant_id=7,
    status="Approved"
)

db.add(workshop)
db.commit()
db.refresh(workshop)

print("Workshop created")

# =========================
# VENUE
# =========================

venue = Venue(
    name="Hanoi Convention Center",
    address="57 Pham Hung, Ha Noi",
    contact_phone="0901234567",
    description="Conference venue",
    sales_manager_id=8
)

db.add(venue)
db.commit()
db.refresh(venue)

print("Venue created")

# =========================
# CONTRACT
# =========================

contract = Contract(
    workshop_id=workshop.id,
    venue_id=venue.id,
    contract_info="Conference room booking contract",
    status="Approved"
)

db.add(contract)
db.commit()
db.refresh(contract)

print("Contract created")

# =========================
# TRAVEL SCHEDULE
# =========================

travel = TravelSchedule(
    workshop_id=workshop.id,
    consultant_id=7,
    transport_type="Flight",
    departure_location="Ho Chi Minh City",
    destination="Ha Noi",
    departure_time=datetime(2026, 6, 9, 18, 0),
    travel_info="VN220",
    status="Confirmed"
)

db.add(travel)
db.commit()
db.refresh(travel)

print("Travel schedule created")

# =========================
# MATERIALS
# =========================

materials = [
    Material(
        material_name="Training Handbook",
        material_type="Document"
    ),
    Material(
        material_name="Certificate",
        material_type="Document"
    ),
    Material(
        material_name="Name Tag",
        material_type="Accessory"
    ),
    Material(
        material_name="Banner",
        material_type="Marketing"
    )
]

db.add_all(materials)
db.commit()

print("Materials created")

# lấy lại materials sau commit
materials = db.query(Material).all()

# =========================
# MATERIAL REQUEST
# =========================

request = MaterialRequest(
    workshop_id=workshop.id,
    request_date=datetime.utcnow(),
    delivery_address=venue.address,
    registered_attendees=50,
    status="Pending"
)

db.add(request)
db.commit()
db.refresh(request)

print("Material request created")

# =========================
# SHIPMENTS
# =========================

for material in materials:

    shipment = MaterialShipment(
        material_request_id=request.id,
        material_id=material.id,
        quantity=50,
        packaging_status="Packed",
        shipping_status="Pending"
    )

    db.add(shipment)

db.commit()

print("Material shipments created")

print("Workflow seed completed")