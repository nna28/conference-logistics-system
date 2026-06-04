from pydantic import BaseModel


class ContractCreate(BaseModel):
    workshop_id: int
    venue_id: int
    contract_info: str


class ContractUpdate(BaseModel):
    contract_info: str | None = None
    status: str | None = None


class ContractResponse(BaseModel):
    id: int
    workshop_id: int
    venue_id: int
    contract_info: str
    status: str

    class Config:
        from_attributes = True