from datetime import datetime, timedelta
import random

from db.database import SessionLocal
from models.models import (
    User, Workshop, Venue, Contract, TravelSchedule,
    Material, MaterialRequest, MaterialShipment
)

db = SessionLocal()

print("Starting rich data seed...")

# Add Venues
venues_data = [
    {"name": "Saigon Exhibition Center", "address": "District 7, HCMC", "capacity": 500, "rental_cost": 2000, "room_type": "Auditorium"},
    {"name": "Danang Tech Hub", "address": "Hai Chau, Da Nang", "capacity": 200, "rental_cost": 1000, "room_type": "Conference Room"},
    {"name": "Landmark 81 Sky", "address": "Binh Thanh, HCMC", "capacity": 100, "rental_cost": 5000, "room_type": "Sky Lounge"},
    {"name": "JW Marriott Hotel", "address": "Nam Tu Liem, Hanoi", "capacity": 300, "rental_cost": 3000, "room_type": "Ballroom"}
]
db_venues = []
for v in venues_data:
    venue = Venue(
        name=v["name"], 
        address=v["address"], 
        capacity=v["capacity"],
        rental_cost=v["rental_cost"],
        room_type=v["room_type"],
        equipment_supported="Projector, Wi-Fi, Sound System",
        is_available=True
    )
    db.add(venue)
    db.commit()
    db.refresh(venue)
    db_venues.append(venue)
for v in db_venues: pass

# Add Workshops
ws_types = ["AI & Machine Learning", "Advanced Sales Tactics", "Agile Project Management", "Cybersecurity Basics", "Financial Planning 101"]
cities = ["HCMC", "Da Nang", "HCMC", "Hanoi", "Hanoi"]
statuses = ["PENDING", "PROCESSING", "COMPLETED", "CONFIRMED", "PENDING"]
db_workshops = []
for i in range(5):
    ws = Workshop(
        workshop_code=f"WS2026-{random.randint(1000, 9999)}",
        workshop_type=ws_types[i],
        scheduled_time=datetime.utcnow() + timedelta(days=random.randint(-10, 30)),
        expected_attendees=random.randint(30, 200),
        city=cities[i],
        trainer_id=7,
        status=statuses[i]
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    db_workshops.append(ws)
for ws in db_workshops: pass

# Add Contracts
db_contracts = []
for i in range(5):
    contract = Contract(
        workshop_id=db_workshops[i].id,
        venue_id=db_venues[i % len(db_venues)].id,
        sales_manager_id=8,
        status="APPROVED" if statuses[i] != "PENDING" else "PENDING",
        meeting_rooms=random.randint(1, 3),
        seating_style=random.choice(["Theater", "Classroom", "U-Shape"]),
        av_requirements="Projector, Microphones, Sound System"
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    db_contracts.append(contract)
for c in db_contracts: pass

# Add Travel Schedules
for i in range(3):
    ts = TravelSchedule(
        workshop_id=db_workshops[i].id,
        consultant_id=7,
        transport_type=random.choice(["Flight", "Train", "Car"]),
        departure_location="Hanoi",
        destination=cities[i],
        departure_time=db_workshops[i].scheduled_time - timedelta(days=1),
        travel_info="Ticket Confirmed",
        status="CONFIRMED"
    )
    db.add(ts)
    db.commit()

# Materials
for i in range(4):
    mat = Material(
        workshop_id=db_workshops[i].id,
        quantity_needed=db_workshops[i].expected_attendees,
        packaging_status="PACKED",
        shipping_status="DELIVERED"
    )
    db.add(mat)
    db.commit()
    db.refresh(mat)
    
    req = MaterialRequest(
        workshop_id=db_workshops[i].id,
        quantity_needed=db_workshops[i].expected_attendees,
        created_at=datetime.now() - timedelta(days=random.randint(1, 5)),
        packaging_status=random.choice(["PENDING", "PACKED"]),
        shipping_status=random.choice(["PENDING", "SHIPPING", "DELIVERED"])
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    
    shipment = MaterialShipment(
        material_request_id=req.id,
        material_id=mat.id,
        quantity=req.quantity_needed,
        packaging_status="PACKED",
        shipping_status=req.shipping_status
    )
    db.add(shipment)
    db.commit()

print("Elaborate Dashboard Seed completed!")
