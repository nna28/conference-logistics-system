from pydantic import BaseModel
from typing import Any

class DashboardResponse(BaseModel):
    role: str
    data: dict[str, Any]