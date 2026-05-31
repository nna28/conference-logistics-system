from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db

from models.models import (
    User,
    Workshop,
    Venue,
    Contract,
    FlightBooking,
    MaterialRequest,
    Notification,
    ContractStatusEnum,
    ShippingStatusEnum
)

from schemas.dashboard_schema import DashboardResponse

from core.dependencies import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get(
    "/summary",
    response_model=DashboardResponse
)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    role = current_user.role.value

    if role == "Admin":
        return {
            "role": role,
            "data": {
                "total_users":
                    db.query(User).count(),

                "total_workshops":
                    db.query(Workshop).count(),

                "total_venues":
                    db.query(Venue).count(),

                "total_contracts":
                    db.query(Contract).count(),

                "total_material_requests":
                    db.query(MaterialRequest).count()
            }
        }

    if role == "Logistics Coordinator":
        return {
            "role": role,
            "data": {
                "pending_contracts":
                    db.query(Contract).filter(
                        Contract.status ==
                        ContractStatusEnum.PENDING
                    ).count(),

                "shipping_materials":
                    db.query(MaterialRequest).filter(
                        MaterialRequest.shipping_status ==
                        ShippingStatusEnum.SHIPPING
                    ).count(),

                "unread_notifications":
                    db.query(Notification).filter(
                        Notification.receiver_id ==
                        current_user.id,
                        Notification.is_read == False
                    ).count()
            }
        }

    if role == "Materials Handling Staff":
        return {
            "role": role,
            "data": {
                "pending_materials":
                    db.query(MaterialRequest).filter(
                        MaterialRequest.shipping_status ==
                        ShippingStatusEnum.PENDING
                    ).count(),

                "shipping_materials":
                    db.query(MaterialRequest).filter(
                        MaterialRequest.shipping_status ==
                        ShippingStatusEnum.SHIPPING
                    ).count()
            }
        }

    if role == "Training Consultant":
        return {
            "role": role,
            "data": {
                "flight_bookings":
                    db.query(FlightBooking).filter(
                        FlightBooking.trainer_id ==
                        current_user.id
                    ).count(),

                "unread_notifications":
                    db.query(Notification).filter(
                        Notification.receiver_id ==
                        current_user.id,
                        Notification.is_read == False
                    ).count()
            }
        }

    return {
        "role": role,
        "data": {}
    }