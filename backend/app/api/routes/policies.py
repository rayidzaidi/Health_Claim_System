from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import models, database
from app.schemas import policy as policy_schemas
from app.api import deps
from typing import List

router = APIRouter()

@router.post("/", response_model=policy_schemas.PolicyResponse)
def create_policy(policy_in: policy_schemas.PolicyCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_admin_user)):
    db_policy = models.Policy(**policy_in.model_dump())
    # Calculate remaining amount
    db_policy.remaining_amount = policy_in.coverage_amount
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.get("/", response_model=List[policy_schemas.PolicyResponse])
def get_policies(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    if current_user.role == "PATIENT":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        policies = db.query(models.Policy).filter(models.Policy.patient_id == patient.id).offset(skip).limit(limit).all()
    else:
        policies = db.query(models.Policy).offset(skip).limit(limit).all()
    return policies
