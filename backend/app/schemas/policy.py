from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class PolicyBase(BaseModel):
    policy_number: str
    patient_id: int
    coverage_amount: float
    start_date: date
    end_date: date
    covered_diseases: str
    claim_limit_per_case: float

class PolicyCreate(PolicyBase):
    pass

class PolicyResponse(PolicyBase):
    id: int
    used_amount: float
    remaining_amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
