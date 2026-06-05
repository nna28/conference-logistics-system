from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from db.database import SessionLocal

from db.database import engine
from models.models import Base

from models.models import *

from routers.user_router import router as user_router
from routers.workshop_router import router as workshop_router
from routers.venue_router import router as venue_router
from routers.contract_router import router as contract_router
from routers.travel_schedule_router import router as travel_schedule_router
from routers.material_router import router as material_router
from routers.material_request_router import router as material_request_router
from routers.material_shipment_router import router as material_shipment_router
from routers.auth_router import router as auth_router
from routers.audit_logs_router import router as audit_logs_router
from routers.notification_router import router as notification_router


Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title="Conference Logistics System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)
app.include_router(workshop_router)
app.include_router(venue_router)
app.include_router(contract_router)
app.include_router(travel_schedule_router)
app.include_router(material_router)
app.include_router(material_request_router)
app.include_router(material_shipment_router)
app.include_router(auth_router)
app.include_router(audit_logs_router)
app.include_router(notification_router)


async def reminder_task():
    while True:
        try:
            db = SessionLocal()
            now = datetime.now(timezone.utc)
            two_weeks_later = now + timedelta(days=14)
            workshops = db.query(Workshop).filter(
                Workshop.scheduled_time >= two_weeks_later,
                Workshop.scheduled_time < two_weeks_later + timedelta(days=1)
            ).all()

            for w in workshops:
                req = db.query(MaterialRequest).filter(MaterialRequest.workshop_id == w.id).first()
                if not req:
                    logistics_users = db.query(User).filter(User.role == "Logistics Coordinator").all()
                    for l_user in logistics_users:
                        existing_notif = db.query(Notification).filter(
                            Notification.receiver_id == l_user.id,
                            Notification.title == "Material Request Reminder",
                            Notification.message.like(f"%{w.workshop_code}%")
                        ).first()
                        if not existing_notif:
                            notification = Notification(
                                sender_id=l_user.id,
                                receiver_id=l_user.id,
                                title="Material Request Reminder",
                                message=f"Workshop {w.workshop_code} is exactly 2 weeks away. Please prepare material requests.",
                                is_read=False,
                                created_at=datetime.now(timezone.utc)
                            )
                            db.add(notification)
            db.commit()
            db.close()
        except Exception as e:
            print(f"Error in reminder_task: {e}")
        # Run once a day
        await asyncio.sleep(86400)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(reminder_task())

@app.get("/")
def root():
    return {
        "message":
        "Conference Logistics API"
    }

