from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HospitalBase(BaseModel):
    name: str
    registration_number: str
    address: str
    city: str
    phone: str

class HospitalCreate(HospitalBase):
    pass

class HospitalResponse(HospitalBase):
    id: int
    risk_score: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
