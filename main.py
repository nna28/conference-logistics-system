from fastapi import FastAPI

from db.database import engine, Base
from models import models

from routers.auth_router import router as auth_router
from routers.user_router import router as user_router
from routers.workshop_router import router as workshop_router
from routers.venue_router import router as venue_router
from routers.contract_router import router as contract_router
from routers.flight_router import router as flight_router
from routers.material_router import router as material_router
from routers.notification_router import router as notification_router
from routers.dashboard_router import router as dashboard_router
from routers.audit_router import router as audit_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Conference Logistics System API"
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(workshop_router)
app.include_router(venue_router)
app.include_router(contract_router)
app.include_router(flight_router)
app.include_router(material_router)
app.include_router(notification_router)
app.include_router(dashboard_router)
app.include_router(audit_router)

@app.get("/")
def root():
    return {
        "message": "Conference Logistics API"
    }