from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.db import models, database
from app.schemas import claim as claim_schemas
from app.api import deps
from app.services import fraud_engine
import os
import shutil
from typing import List

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=claim_schemas.ClaimResponse)
def create_claim(claim_in: claim_schemas.ClaimCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    import uuid
    from datetime import datetime, timezone

    # Strict Validation: Policy Checks
    policy = db.query(models.Policy).filter(models.Policy.id == claim_in.policy_id).first()
    if not policy:
        raise HTTPException(status_code=400, detail="Invalid policy specified.")
    
    if policy.status != "ACTIVE" or policy.end_date < datetime.now().date():
        raise HTTPException(status_code=400, detail="Policy is expired or inactive.")
        
    if claim_in.claim_amount > policy.remaining_amount:
        raise HTTPException(status_code=400, detail=f"Claim amount (${claim_in.claim_amount}) exceeds remaining policy coverage (${policy.remaining_amount}).")

    if claim_in.treatment_date < policy.start_date:
        raise HTTPException(status_code=400, detail="Treatment date is before the policy start date.")

    db_claim = models.Claim(**claim_in.model_dump())
    db_claim.claim_number = f"CLM-{uuid.uuid4().hex[:8].upper()}"
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    
    # Run Fraud Detection Engine
    db_claim = fraud_engine.analyze_claim(db, db_claim)
    
    return db_claim

@router.get("/", response_model=List[claim_schemas.ClaimResponse])
def read_claims(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    if current_user.role == "PATIENT":
        patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
        claims = db.query(models.Claim).filter(models.Claim.patient_id == patient.id).offset(skip).limit(limit).all()
    elif current_user.role == "HOSPITAL":
        # we'll assume the hospital is linked somehow or just return all for MVP for hospital role
        claims = db.query(models.Claim).offset(skip).limit(limit).all()
    else:
        claims = db.query(models.Claim).offset(skip).limit(limit).all()
    return claims

@router.get("/{claim_id}", response_model=claim_schemas.ClaimResponse)
def read_claim(claim_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@router.put("/{claim_id}/status", response_model=claim_schemas.ClaimResponse)
def update_claim_status(claim_id: int, status_update: claim_schemas.ClaimStatusUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    if current_user.role not in ["ADMIN", "CLAIM_OFFICER"]:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    old_status = claim.status
    claim.status = status_update.status
    if status_update.approved_amount is not None:
        claim.approved_amount = status_update.approved_amount
    if status_update.officer_remarks is not None:
        claim.officer_remarks = status_update.officer_remarks
        
    # Generate Notification if status changed
    if old_status != claim.status and claim.patient and claim.patient.user_id:
        msg = f"Your claim {claim.claim_number} status has been updated to {claim.status}."
        if claim.status == "DOCUMENT_REQUIRED":
            msg = f"Your claim {claim.claim_number} requires additional information/documents. Remarks: {claim.officer_remarks}"
        elif claim.status == "REJECTED":
            msg = f"Your claim {claim.claim_number} has been rejected. Remarks: {claim.officer_remarks}"
            
        notification = models.Notification(
            user_id=claim.patient.user_id,
            message=msg
        )
        db.add(notification)

    db.commit()
    db.refresh(claim)
    return claim

@router.put("/{claim_id}/resubmit", response_model=claim_schemas.ClaimResponse)
def resubmit_claim(claim_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    if current_user.role != "HOSPITAL":
        raise HTTPException(status_code=403, detail="Not enough privileges")
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim.status != "DOCUMENT_REQUIRED":
        raise HTTPException(status_code=400, detail="Claim is not pending documents")
    
    claim.status = "UNDER_REVIEW"
    db.commit()
    db.refresh(claim)
    return claim

@router.post("/{claim_id}/documents")
def upload_claim_document(claim_id: int, file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    file_location = f"{UPLOAD_DIR}/{claim_id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    db_doc = models.ClaimDocument(
        claim_id=claim_id,
        file_name=file.filename,
        file_path=file_location,
        file_type=file.content_type
    )
    db.add(db_doc)
    db.commit()
    return {"info": f"file '{file.filename}' saved"}
