from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class ClaimDocumentBase(BaseModel):
    file_name: str
    file_type: str

class ClaimDocumentResponse(ClaimDocumentBase):
    id: int
    claim_id: int
    file_path: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class ClaimBase(BaseModel):
    patient_id: int
    hospital_id: int
    policy_id: int
    diagnosis: str
    treatment_type: str
    claim_amount: float
    treatment_date: date
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None

class ClaimCreate(ClaimBase):
    pass

class ClaimStatusUpdate(BaseModel):
    status: str
    approved_amount: Optional[float] = None
    officer_remarks: Optional[str] = None

class FraudFlagResponse(BaseModel):
    id: int
    flag_type: str
    description: str
    risk_points: float
    created_at: datetime

    class Config:
        from_attributes = True

class ClaimResponse(ClaimBase):
    id: int
    claim_number: str
    approved_amount: Optional[float] = None
    status: str
    fraud_score: Optional[float] = None
    fraud_risk_level: Optional[str] = None
    ml_prediction: Optional[str] = None
    officer_remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    fraud_flags: List[FraudFlagResponse] = []
    
    class Config:
        from_attributes = True
