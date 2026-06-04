from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def root():
    return {
        "message":
        "Conference Logistics API"
    }

