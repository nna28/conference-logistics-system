from db.database import SessionLocal
from models.models import Workshop, Venue, Contract, TravelSchedule, MaterialRequest, MaterialShipment

db = SessionLocal()
print("Workshops:", db.query(Workshop).count())
print("Venues:", db.query(Venue).count())
print("Contracts:", db.query(Contract).count())
print("Schedules:", db.query(TravelSchedule).count())
print("MaterialRequests:", db.query(MaterialRequest).count())
print("MaterialShipments:", db.query(MaterialShipment).count())
